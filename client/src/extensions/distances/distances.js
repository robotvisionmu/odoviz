import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as pathUtils from 'path';

import {
  faCircleNotch,
  faExclamationTriangle,
  faFile,
  faImages,
  faUpload,
  faVideo,
  faVideoSlash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Slider, Tooltip } from '@material-ui/core';
import classnames from 'classnames';
import jsZip from 'jszip';
import npyjs from 'npyjs';
import nj from 'numjs';

import {
  setCurrentDistancesIndex,
  setDataJson,
  setDistancesNpzs,
  setSkip0thMatch,
  setTopKToDisplay,
} from 'reducers/distances/distancesActions';
import AntSwitch from 'ui/AntSwitch';
import TooltipValueLabel from 'ui/TooltipValueLabel';

import ImageSideBar from './imageSideBar/imageSideBar';
import Label from './label/label';

import './distances.scss';

class Distances extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: null,
      error: null,
      sideBar: true,
      selectedIndex: null,
      compareIndex: 1,
      localTopKToDisplay: props.topKToDisplay,
    };
  }

  attachDataRef = (ref) => {
    this.dataUploader = ref;
  };
  attachDistancesRef = (ref) => {
    this.distancesUploader = ref;
  };
  chooseDataJson = () => {
    this.dataUploader.click();
  };
  chooseDistancesNpz = () => {
    this.distancesUploader.click();
  };

  uploadDataJson = async () => {
    this.setState({ loading: true });
    const dataFile = this.dataUploader.files[0];
    const data = await new Response(dataFile).json();
    this.props.setDataJson(data, dataFile);
    this.setState({ loading: false });
  };

  getDistancesNpz = async (distancesFile) => {
    const npyParser = new npyjs();
    const distances = {};

    const archive = await new Response(distancesFile).arrayBuffer();
    const { files } = await jsZip.loadAsync(archive);
    for (const filename of Object.keys(files)) {
      const filenameWithoutExt = pathUtils.basename(filename, pathUtils.extname(filename));
      const content = await files[filename].async('arraybuffer');
      const { data, shape, dtype } = npyParser.parse(content);
      distances[filenameWithoutExt] = nj.array(data, dtype).reshape(...shape);
    }

    return distances;
  };

  uploadDistances = async () => {
    this.setState({ loading: true });
    const distancesNpzs = [];
    const distancesFiles = [];
    for (const distancesFile of this.distancesUploader.files) {
      distancesNpzs.push(await this.getDistancesNpz(distancesFile));
      distancesFiles.push(distancesFile);
    }
    this.props.setDistancesNpzs(distancesNpzs, distancesFiles);
    this.setState({ loading: false });
  };

  getImagesToDisplay = (i) => {
    if (i == null) return {};
    const { distancesNpzs, currentDistancesIndex, topKToDisplay, skip0thMatch } = this.props;
    const distances = distancesNpzs && distancesNpzs[currentDistancesIndex];
    const imagesToDisplay = [...Array(topKToDisplay + skip0thMatch).keys()].reduce((result, j, dict_index) => {
      const label = distances.top_k.get(i, j, 0);
      const index = distances.top_k.get(i, j, 1);
      result[dict_index] = [this.getImagePath(label, index), [label, index]];
      return result;
    }, {});
    return imagesToDisplay;
  };

  getImagePath = (label, index) => {
    const { dataJson } = this.props;
    let imagePath = null;
    if (dataJson && dataJson.hasOwnProperty(label) && dataJson[label].length > index)
      imagePath = dataJson[label][index];
    else console.log(`data[${label}][${index}] not found`);
    return imagePath;
  };

  toggleSideBar = () => {
    this.setState((state) => ({ sideBar: !state.sideBar }));
  };

  setCompareIndex = (index) => {
    this.setState({ compareIndex: index });
  };

  setSelectedIndex = (index) => {
    this.setState({ selectedIndex: index });
  };

  handleSetSelectedIndex = (e) => {
    const index = parseInt(e.currentTarget.getAttribute('i'));
    this.setSelectedIndex(index);
  };

  handleSetCompareIndex = (e) => {
    const index = parseInt(e.currentTarget.getAttribute('j'));
    this.setCompareIndex(index);
  };

  handleSetLocalTopKDisplay = (e, value) => {
    this.setState({ localTopKToDisplay: value });
  };

  handleSetTopKDisplay = (e, value) => {
    this.setState((s) => ({ localTopKToDisplay: value, compareIndex: s.compareIndex > value ? 1 : s.compareIndex }));
    this.props.setTopKToDisplay(value);
  };

  handleSetSkip0thMatch = (e, value) => {
    this.props.setSkip0thMatch(value);
  };

  getAllSteps = () => {
    const { distancesFiles } = this.props;
    return distancesFiles.map((distancesFile) => {
      let filename = distancesFile.name;
      filename = pathUtils.basename(filename, pathUtils.extname(filename));
      const tokens = filename.split('_');
      if (tokens.length > 1) return parseInt(tokens[1]);
      else return -1;
    });
  };

  handleChangeCurrentDistanceIndex = (e, value) => {
    this.props.setCurrentDistancesIndex(value);
  };

  render() {
    const { loading, error, sideBar } = this.state;
    const { topKToDisplay, skip0thMatch, dataFile, dataJson, distancesNpzs, distancesFiles, currentDistancesIndex } =
      this.props;
    const { selectedIndex, compareIndex, localTopKToDisplay } = this.state;
    const imagesToDisplay = this.getImagesToDisplay(selectedIndex);

    const steps = this.getAllSteps();
    const distanceIndexMarks = steps.map((step, i) => ({
      value: i,
      label: step,
    }));

    const distances = distancesNpzs && distancesNpzs[currentDistancesIndex];
    const distancesFile = distancesFiles.length > 0 && distancesFiles[currentDistancesIndex];

    let dataFileName = 'Upload Data',
      distancesFileName = 'Upload Distances';
    let dataDesc = 'JSON Format',
      distancesDesc = 'NPZ Format';
    if (dataJson) {
      dataFileName = dataFile.name;
      dataDesc = `${Object.keys(dataJson).length - 1} locations`;
    }
    if (distances) {
      distancesFileName = `${distancesFiles.length} files | ${distancesFile.name}`;
      distancesDesc = Object.keys(distances).join(', ') + ` | ${distances.labels.shape[0]} records`;
    }

    const examplesToDisplay = distances && distances.top_k.shape[0];
    const maxTopK = distances && distances.top_k.shape[1] - skip0thMatch;

    return (
      <Grid container direction={'row'} className={'distances'}>
        <Grid item className={'mainBar'}>
          <Grid container direction={'column'}>
            <Grid item className={'topBar'}>
              <div className="title">Analyze Distances</div>
              <div>{loading && <FontAwesomeIcon icon={faCircleNotch} spin />}</div>
            </Grid>

            <Grid item>
              <Grid container spacing={1} direction={'row'} alignItems={'center'} className={'uploadWrapper'}>
                <Grid item>
                  <div className="button" onClick={this.chooseDataJson}>
                    <FontAwesomeIcon icon={faUpload} />
                    <div className="caption">
                      <span>{dataFileName}</span>
                      <span>{dataDesc}</span>
                    </div>
                    <input
                      type="file"
                      accept="application/json"
                      ref={this.attachDataRef}
                      style={{ display: 'none' }}
                      onChange={this.uploadDataJson}
                    />
                  </div>
                </Grid>

                <Grid item>
                  <div className="button" onClick={this.chooseDistancesNpz}>
                    <FontAwesomeIcon icon={faUpload} />
                    <div className="caption">
                      <span>{distancesFileName}</span>
                      <span>{distancesDesc}</span>
                    </div>
                    <input
                      type="file"
                      accept=".npz"
                      multiple
                      ref={this.attachDistancesRef}
                      style={{ display: 'none' }}
                      onChange={this.uploadDistances}
                    />
                  </div>
                </Grid>

                {distances && dataJson && Object.keys(imagesToDisplay).length > 0 && (
                  <Grid item>
                    <div className="button" onClick={this.toggleSideBar}>
                      {sideBar && <FontAwesomeIcon icon={faVideo} fixedWidth />}
                      {!sideBar && <FontAwesomeIcon icon={faVideoSlash} fixedWidth />}
                    </div>
                  </Grid>
                )}
              </Grid>
            </Grid>

            {distances && distances.hasOwnProperty('top_k') && distances.hasOwnProperty('labels') && (
              <React.Fragment>
                <Grid item className={'distancesSettings'}>
                  <Grid container spacing={2} direction={'column'}>
                    <Grid item>
                      <Grid container spacing={2}>
                        <Grid item>
                          <Tooltip placement="bottom" title="Top K to display">
                            <span>Top-k</span>
                          </Tooltip>
                        </Grid>
                        <Grid item xs>
                          <Slider
                            className="slider"
                            ValueLabelComponent={TooltipValueLabel}
                            value={localTopKToDisplay}
                            valueLabelDisplay="auto"
                            min={2}
                            max={maxTopK}
                            step={1}
                            onChange={this.handleSetLocalTopKDisplay}
                            onChangeCommitted={this.handleSetTopKDisplay}
                          />
                        </Grid>
                        <Grid item>
                          <Grid component="label" container alignItems="center" spacing={1}>
                            <Grid item> skip 0th match </Grid>
                            <Grid item>
                              <AntSwitch checked={skip0thMatch === true} onChange={this.handleSetSkip0thMatch} />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item>
                      <Grid container spacing={2}>
                        <Grid item>
                          <Tooltip placement="bottom" title="Training Steps">
                            <span>Steps</span>
                          </Tooltip>
                        </Grid>
                        <Grid item xs>
                          <Slider
                            className="slider"
                            value={currentDistancesIndex}
                            valueLabelDisplay="off"
                            marks={distanceIndexMarks}
                            track={false}
                            step={1}
                            min={0}
                            max={distanceIndexMarks.length - 1}
                            onChange={this.handleChangeCurrentDistanceIndex}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item className="distancesRecords">
                  <Grid container direction={'column'}>
                    {[...Array(examplesToDisplay).keys()].map((i) => {
                      const label = distances.labels.get(i, 0);
                      const index = distances.labels.get(i, 1);
                      return (
                        <Grid
                          item
                          className={classnames('row', { selected: i === selectedIndex })}
                          key={i}
                          i={i}
                          onClick={this.handleSetSelectedIndex}
                        >
                          <Grid container spacing={1} direction={'row'} wrap={'nowrap'}>
                            <Grid item className={'displayImagesIcon'}>
                              <FontAwesomeIcon icon={faImages} color={'#90CAF9'} />
                            </Grid>
                            <Grid item label={label} index={index}>
                              <Label label={label} index={index} query={true} />
                            </Grid>
                            {[...Array(topKToDisplay + skip0thMatch).keys()].slice(+skip0thMatch).map((j) => {
                              const label = distances.top_k.get(i, j, 0);
                              const index = distances.top_k.get(i, j, 1);
                              return (
                                <Grid
                                  item
                                  key={j}
                                  label={label}
                                  index={index}
                                  onClick={this.handleSetCompareIndex}
                                  j={j}
                                  className={classnames({ compared: i === selectedIndex && j === compareIndex })}
                                >
                                  <Label label={label} index={index} />
                                </Grid>
                              );
                            })}
                          </Grid>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Grid>

                {!error && (
                  <Grid item>
                    <Grid container className="bottomBar">
                      <Grid item>Loaded</Grid>
                      <Grid item xs className="loadedFileWrapper">
                        <FontAwesomeIcon icon={faFile} />
                        <span className="loadedFileName">
                          Showing {topKToDisplay} Top Matches for {examplesToDisplay} records
                        </span>
                      </Grid>
                    </Grid>
                  </Grid>
                )}

                {error && (
                  <Grid item>
                    <Grid container className="bottomBar">
                      <Grid item>Error</Grid>
                      <Grid item xs className="errorMessageWrapper">
                        <FontAwesomeIcon icon={faExclamationTriangle} color={'#ff342f'} />
                        <span className="errorMessage"> {error.toTitleCase()} </span>
                      </Grid>
                    </Grid>
                  </Grid>
                )}
              </React.Fragment>
            )}
          </Grid>
        </Grid>
        {sideBar && Object.keys(imagesToDisplay).length > 0 && (
          <Grid item className={'sideBar'}>
            <ImageSideBar
              imagesToDisplay={imagesToDisplay}
              compareIndex={compareIndex}
              setCompareIndex={this.setCompareIndex}
            />
          </Grid>
        )}
      </Grid>
    );
  }
}

export default connect((store) => store.distances, {
  setDataJson,
  setDistancesNpzs,
  setSkip0thMatch,
  setTopKToDisplay,
  setCurrentDistancesIndex,
})(Distances);
