import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  faCheckCircle,
  faCircleNotch,
  faExclamationTriangle,
  faInfoCircle,
  faLink,
  faMapMarkerAlt,
  faPalette,
  faTimesCircle,
  faTintSlash,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Tooltip } from '@material-ui/core';

import {
  addLocationInfo,
  removeLocationInfo,
  setColorApplied,
  setLocationsApplied,
  setLocationsData,
  setLoopsData,
} from 'reducers/locations/locationsActions';

import { getImageIndexToLocation, getLoops } from './locationsParser';

import './locations.scss';

class Locations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: null,
    };
  }

  attachResultsTxtRef = (ref) => {
    this.resultsTxtUploader = ref;
  };
  chooseResultsTxt = () => {
    this.resultsTxtUploader.click();
  };

  uploadResultsTxt = async () => {
    const dataFiles = [...this.resultsTxtUploader.files]; // Convert FileList to Array
    let loopsTxtUploaderFiles = dataFiles.filter((file) => file.name.startsWith('htmap_loops_'));
    if (loopsTxtUploaderFiles.length > 1)
      loopsTxtUploaderFiles = loopsTxtUploaderFiles.filter((file) => file.name.startsWith('htmap_loops_processed_'));
    const locationsTxtUploaderFiles = dataFiles.filter((file) => file.name.startsWith('htmap_img2loc_'));
    await Promise.all([
      this.uploadLoopsTxt(null, loopsTxtUploaderFiles[0]),
      this.uploadLocationsTxt(null, locationsTxtUploaderFiles[0]),
    ]);
  };

  attachLoopsTxtRef = (ref) => {
    this.loopsTxtUploader = ref;
  };
  chooseLoopsTxt = () => {
    this.loopsTxtUploader.click();
  };

  uploadLoopsTxt = async (e, loopsFile = null) => {
    this.setState({ loading: true });
    const dataFile = loopsFile != null ? loopsFile : this.loopsTxtUploader.files[0];
    const data = await new Response(dataFile).text();
    const loops = getLoops(data);
    this.props.setLoopsData(loops, dataFile);
    this.setState({ loading: false });
  };

  attachLocationsTxtRef = (ref) => {
    this.locationsTxtUploader = ref;
  };
  chooseLocationsTxt = () => {
    this.locationsTxtUploader.click();
  };

  uploadLocationsTxt = async (e, locationsFile = null) => {
    this.setState({ loading: true });
    const dataFile = locationsFile != null ? locationsFile : this.locationsTxtUploader.files[0];
    const data = await new Response(dataFile).text();
    const imageIndexToLocation = getImageIndexToLocation(data);
    this.props.setLocationsData(imageIndexToLocation, dataFile);
    this.setState({ loading: false });
  };

  handleApplyLocations = () => {
    this.setState({ loading: true });
    const { locationsApplied } = this.props;
    if (locationsApplied) {
      removeLocationInfo();
      this.props.setLocationsApplied(false);
      this.props.setColorApplied(false);
    } else {
      addLocationInfo();
      this.props.setLocationsApplied(true);
      this.props.setColorApplied(true);
    }
    this.setState({ loading: false });
  };

  handleApplyColors = () => {
    this.setState({ loading: true });
    const { colorApplied } = this.props;
    this.props.setColorApplied(!colorApplied);
    this.setState({ loading: false });
  };

  render() {
    const { loading, error } = this.state;
    const { imageIndexToLocation, loops, locationsTxtFile, loopsTxtFile, locationsApplied, colorApplied } = this.props;
    let resultsFileName = 'Upload Results',
      resultsFileDesc = 'All TXT Files in results folder';
    let locationsFileName = 'Upload Locations',
      locationsFileDesc = 'Tab Separated TXT File';
    let loopsFileName = 'Upload Loops',
      loopsFileDesc = 'Tab Separated TXT File';
    let numLocations = 0,
      numImages = 0,
      numLoops = 0;
    if (imageIndexToLocation) {
      locationsFileName = locationsTxtFile.name;
      numImages = Object.keys(imageIndexToLocation).length;
      numLocations = Math.max.apply(null, Object.values(imageIndexToLocation));
      locationsFileDesc = `${numLocations} locations; ${numImages} images`;
    }
    if (loops) {
      numLoops = Object.values(loops).filter((e) => e.length).length;
      numImages = Object.keys(loops).length;
      loopsFileName = loopsTxtFile.name;
      loopsFileDesc = `${numLoops} loops; ${numImages} images`;
    }
    if (imageIndexToLocation && loops) {
      resultsFileName = 'Results files uploaded';
      resultsFileDesc = 'Locations and Loops loaded';
    }

    return (
      <div className="locations">
        <Grid container direction={'column'}>
          <Grid item className={'topBar'}>
            <div className="title">Analyze Locations</div>
            <div>{loading && <FontAwesomeIcon icon={faCircleNotch} spin />}</div>
          </Grid>

          <Grid item xs>
            <Grid container spacing={1} direction={'column'} style={{ height: '100%' }}>
              <Grid item xs>
                <Grid container spacing={1} direction={'row'} alignItems={'center'} className={'uploadWrapper'}>
                  <Grid item>
                    <div className="button" onClick={this.chooseResultsTxt}>
                      <FontAwesomeIcon icon={faUpload} />
                      <div className="caption">
                        <span>{resultsFileName}</span>
                        <span>{resultsFileDesc}</span>
                      </div>
                      <input
                        multiple
                        type="file"
                        accept=".txt"
                        ref={this.attachResultsTxtRef}
                        style={{ display: 'none' }}
                        onChange={this.uploadResultsTxt}
                      />
                    </div>
                  </Grid>

                  <Grid item>
                    <Tooltip
                      placement="bottom"
                      title={
                        <React.Fragment>
                          <div style={{ fontSize: 11 }}>{locationsFileName}</div>
                          <div>{locationsFileDesc}</div>
                        </React.Fragment>
                      }
                      arrow
                    >
                      <div className="button" onClick={this.chooseLocationsTxt}>
                        <FontAwesomeIcon icon={faMapMarkerAlt} color={imageIndexToLocation ? '#32c9ff' : '#ffffff'} />
                        <input
                          type="file"
                          accept=".txt"
                          ref={this.attachLocationsTxtRef}
                          style={{ display: 'none' }}
                          onChange={this.uploadLocationsTxt}
                        />
                      </div>
                    </Tooltip>
                  </Grid>

                  <Grid item>
                    <Tooltip
                      placement="bottom"
                      title={
                        <React.Fragment>
                          <div style={{ fontSize: 11 }}>{loopsFileName}</div>
                          <div>{loopsFileDesc}</div>
                        </React.Fragment>
                      }
                      arrow
                    >
                      <div className="button" onClick={this.chooseLoopsTxt}>
                        <FontAwesomeIcon icon={faLink} color={loops ? '#32c9ff' : '#ffffff'} />
                        <input
                          type="file"
                          accept=".txt"
                          ref={this.attachLoopsTxtRef}
                          style={{ display: 'none' }}
                          onChange={this.uploadLoopsTxt}
                        />
                      </div>
                    </Tooltip>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item>
                <Grid container spacing={1} direction={'row'} alignItems={'center'} className={'uploadWrapper'}>
                  {imageIndexToLocation && numLocations > 0 && numImages > 0 && !error && (
                    <Grid item>
                      <div className="button" onClick={this.handleApplyLocations}>
                        {!locationsApplied && (
                          <React.Fragment>
                            <FontAwesomeIcon icon={faCheckCircle} />
                            <div className="caption">
                              <span>Add locations</span>
                              <span>to poses in workspace</span>
                            </div>
                          </React.Fragment>
                        )}
                        {locationsApplied && (
                          <React.Fragment>
                            <FontAwesomeIcon icon={faTimesCircle} />
                            <div className="caption">
                              <span>Remove locations</span>
                              <span>from poses in workspace</span>
                            </div>
                          </React.Fragment>
                        )}
                      </div>
                    </Grid>
                  )}

                  {locationsApplied && (
                    <Grid item>
                      <div className="button" onClick={this.handleApplyColors}>
                        {!colorApplied && <FontAwesomeIcon icon={faPalette} />}
                        {colorApplied && <FontAwesomeIcon icon={faTintSlash} />}
                      </div>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {!error && imageIndexToLocation && (
            <Grid item>
              <Grid container className="bottomBar">
                <Grid item>Loaded</Grid>
                <Grid item xs className="loadedFileWrapper">
                  <FontAwesomeIcon icon={faInfoCircle} />
                  <span className="loadedFileName">
                    {numLocations} locations, {numLoops} loops, {numImages} images
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
        </Grid>
      </div>
    );
  }
}

export default connect((store) => store.locations, {
  setLocationsData,
  setLoopsData,
  setLocationsApplied,
  setColorApplied,
})(Locations);
