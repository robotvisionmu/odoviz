import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  faCircleNotch,
  faEye,
  faEyeSlash,
  faFileExport,
  faInfoCircle,
  faPlusCircle,
  faRandom,
  faTimesCircle,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Grid from '@material-ui/core/Grid';

import { exportPoses, matchPosesFn } from 'matcher/oxfordRobotcarMatcher';
import { addCars, hideCars, removeCars, showCars } from 'reducers/env/envActions';
import { removeMatchingPath, setMatchedCars, setMatchOnlySampled } from 'reducers/matching/matchingActions';
import { refreshOffsets } from 'reducers/settings/offset/offsetActions';
import { refreshScene } from 'reducers/settings/scene/sceneActions';
import AntSwitch from 'ui/AntSwitch';

import { addDeltaToCars, getDistancesAndDeltaAngles } from '../../threedView/scripts/sample';

import './matching.scss';

class Matching extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      matching: null,
      matchingProgress: null,
    };
  }

  handleUpdateProgress = (matchingProgress) => {
    this.setState({ matchingProgress });
    // console.log("matchingProgress", matchingProgress);
    // this.setState({matchingProgress}, ()=> {
    // console.log("matchingProgressCb", matchingProgress);
    // })
  };

  handleStartMatching = async () => {
    this.setState({ loading: true });
    const { matchingPaths, scene, matchOnlySampled, allCars } = this.props;
    let cars = [];
    if (!matchOnlySampled) {
      cars = allCars;
      const { distances, deltaAngles } = getDistancesAndDeltaAngles(cars);
      cars = addDeltaToCars(cars, distances, deltaAngles);
    } else {
      const carsGroup = scene.getObjectByName('cars');
      if (carsGroup) cars = carsGroup.children[0].children;
      cars = cars.map((car) => car.data);
    }

    const matchedCars = {};
    for (let i = 0; i < matchingPaths.length; i++) {
      const matchingPath = matchingPaths[i];
      this.setState({ matching: i + 1, matchingProgress: 0 });
      const refCams = await matchPosesFn(matchingPath, cars, this.handleUpdateProgress);
      console.debug(`Total matched: ${refCams.length} out of ${cars.length}`);
      matchedCars[matchingPath] = refCams;
    }
    this.props.setMatchedCars(matchedCars);

    this.setState({ matching: null, loading: false, matchingProgress: null });
  };

  displayAllMatchedCars = () => {
    Object.entries(this.props.matchedCars).forEach(([matchingPath, matchedCams]) => {
      addCars(matchedCams, matchingPath);
    });
    refreshScene();
    refreshOffsets();
    this.forceUpdate();
  };

  displayMatchedCars = (e) => {
    const matchingPath = e.currentTarget.getAttribute('matching-path');
    addCars(this.props.matchedCars[matchingPath], matchingPath);
    refreshScene();
    refreshOffsets();
    this.forceUpdate();
  };

  removeAllMatchedCars = () => {
    const { matchedCars } = this.props;
    for (const matchingPath of Object.keys(matchedCars)) removeCars(matchingPath);
    this.forceUpdate();
  };

  removeMatchedCars = (e) => {
    const matchingPath = e.currentTarget.getAttribute('matching-path');
    removeCars(matchingPath);
    this.forceUpdate();
  };

  handleRemoveMatchingPath = (e) => {
    const removePath = e.currentTarget.getAttribute('remove-path');
    this.props.removeMatchingPath(removePath);
  };

  handleShowCars = (e) => {
    const matchingPath = e.currentTarget.getAttribute('matching-path');
    showCars(matchingPath);
    this.forceUpdate();
  };

  handleHideCars = (e) => {
    const matchingPath = e.currentTarget.getAttribute('matching-path');
    hideCars(matchingPath);
    this.forceUpdate();
  };

  handleExportCars = () => {
    const { scene } = this.props;
    let carsSubgroups = [];
    const carsGroup = scene.getObjectByName('cars');
    if (carsGroup) carsSubgroups = carsGroup.children;

    const queryCars = carsSubgroups[0].children;
    const refCarsArray = carsSubgroups.slice(1).map((carsSubgroup) => carsSubgroup.children);
    exportPoses(queryCars, refCarsArray);
  };

  handleMatchOnlySampled = (e, value) => {
    this.props.setMatchOnlySampled(value);
  };

  render() {
    const { matchingPaths, scene, matchedCars, matchOnlySampled } = this.props;
    const { matching, loading } = this.state;

    if (scene == null) return null;

    let carsSubgroups = [];
    const carsGroup = scene.getObjectByName('cars');
    if (carsGroup) carsSubgroups = carsGroup.children;

    const matchingPathsNotAddedToScene = matchingPaths.filter(
      (matchingPath) => !carsSubgroups.map((e) => e.name).includes(matchingPath)
    );

    const numMatchedPaths = Object.keys(matchedCars).length;
    let displayStatus = 'Ready',
      displayMessage = 'Choose from file browser using RMB';
    if (matchingPaths.length > 0) {
      displayMessage = `${matchingPaths.length} traversal(s) chosen for matching`;
      displayStatus = 'Loaded';
    }
    if (numMatchedPaths > 0) {
      if (carsSubgroups.length > 1) {
        displayStatus = 'Added';
        displayMessage = `Matched ${numMatchedPaths} traversals, ${carsSubgroups.length - 1} added to scene`;
      } else {
        displayStatus = 'Matched';
        const queryCarsLength = carsGroup.children[0].children.length;
        const matchedCarsLengthArray = Object.values(matchedCars).map((e) => e.length);
        displayMessage = `${queryCarsLength} poses matched with ${matchedCarsLengthArray} poses`;
      }
    }

    return (
      <div className="matching">
        <Grid container direction={'column'}>
          <Grid item className="topBar">
            <div className="title">Matching</div>
            <div>{loading && <FontAwesomeIcon icon={faCircleNotch} spin />}</div>
          </Grid>

          <Grid item xs>
            <Grid container spacing={2} direction="column" className={'matchingWrapper'}>
              <Grid item>
                <Grid container spacing={2} style={{ height: '100%' }}>
                  <Grid item xs>
                    Match only sampled
                  </Grid>
                  <Grid item>
                    <Grid component="label" container alignItems="center" spacing={1}>
                      <Grid item> {'off'} </Grid>
                      <Grid item>
                        <AntSwitch checked={matchOnlySampled === true} onChange={this.handleMatchOnlySampled} />
                      </Grid>
                      <Grid item> {'on'} </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item>
                <Grid container spacing={1} direction="column" className="matchingPaths">
                  {matchingPathsNotAddedToScene.length > 0 &&
                    matchingPathsNotAddedToScene.map((matchingPath, i) => {
                      const isProcessed = Object.keys(matchedCars).includes(matchingPath);
                      return (
                        <Grid item key={i}>
                          <Grid container direction={'row'} spacing={1} alignItems={'center'}>
                            <Grid item xs className={isProcessed ? 'yellow' : ''}>
                              {matchingPath}
                            </Grid>
                            {isProcessed && (
                              <React.Fragment>
                                <Grid item style={{ fontSize: 10 }}>
                                  {matchedCars[matchingPath].length}
                                </Grid>
                                <Grid item>
                                  <FontAwesomeIcon
                                    className={'displayButton'}
                                    matching-path={matchingPath}
                                    onClick={this.displayMatchedCars}
                                    icon={faPlusCircle}
                                  />
                                </Grid>
                              </React.Fragment>
                            )}
                            <Grid item>
                              <FontAwesomeIcon
                                className={'closeButton'}
                                remove-path={matchingPath}
                                onClick={this.handleRemoveMatchingPath}
                                icon={faTimesCircle}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      );
                    })}
                  {carsSubgroups.length > 1 &&
                    carsSubgroups.slice(1).map((e, i) => {
                      return (
                        <Grid item key={i}>
                          <Grid container spacing={1} direction={'row'} alignItems={'center'}>
                            <Grid xs item>
                              {e.name}
                            </Grid>
                            <Grid item style={{ fontSize: 10 }}>
                              {e.children.length}
                            </Grid>
                            <Grid item>
                              {e.visible && (
                                <FontAwesomeIcon
                                  className={'displayButton'}
                                  matching-path={e.name}
                                  onClick={this.handleHideCars}
                                  icon={faEyeSlash}
                                />
                              )}
                              {!e.visible && (
                                <FontAwesomeIcon
                                  className={'displayButton'}
                                  matching-path={e.name}
                                  onClick={this.handleShowCars}
                                  icon={faEye}
                                />
                              )}
                            </Grid>
                            <Grid item>
                              <FontAwesomeIcon
                                className={'closeButton'}
                                matching-path={e.name}
                                onClick={this.removeMatchedCars}
                                icon={faTrash}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      );
                    })}
                </Grid>
              </Grid>

              <Grid item xs>
                <Grid container spacing={1} direction={'row'} alignItems={'center'} className={'uploadWrapper'}>
                  {matchingPaths.length > 0 && (
                    <Grid item>
                      <div className="button" onClick={this.handleStartMatching}>
                        {matching == null && <FontAwesomeIcon icon={faRandom} />}
                        {matching != null && <FontAwesomeIcon icon={faCircleNotch} spin />}
                        <div className="caption">
                          {matching == null && <span>Start Matching</span>}
                          {matching != null && (
                            <span>
                              Matching {matching} / {matchingPaths.length}{' '}
                            </span>
                          )}
                          <span>on files inside selected path</span>
                        </div>
                        {
                          // matchingProgress != null &&
                          // <div className={"progress"}> { (matchingProgress * 100).round(2) + "%" } </div>
                        }
                      </div>
                    </Grid>
                  )}
                </Grid>
              </Grid>

              <Grid item>
                <Grid container spacing={1} direction={'row'} alignItems={'center'}>
                  {Object.keys(matchedCars).length > 0 && matchingPathsNotAddedToScene.length > 0 && (
                    <Grid item>
                      <div className="button" onClick={this.displayAllMatchedCars}>
                        <FontAwesomeIcon icon={faEye} />
                        <div className="caption">
                          <span>Add all</span>
                          <span>matched cars to the 3D Viewer</span>
                        </div>
                      </div>
                    </Grid>
                  )}

                  {matchingPaths.length > 0 &&
                    Object.keys(matchedCars).length > 0 &&
                    matchingPathsNotAddedToScene.length === 0 && (
                      <Grid item>
                        <div className="button" onClick={this.removeAllMatchedCars}>
                          <FontAwesomeIcon icon={faTimesCircle} />
                          <div className="caption">
                            <span>Remove all</span>
                            <span>matched cars from the 3D Viewer</span>
                          </div>
                        </div>
                      </Grid>
                    )}

                  {matchingPaths.length > 0 && Object.keys(matchedCars).length > 0 && (
                    <Grid item>
                      <div className="button" onClick={this.handleExportCars}>
                        <FontAwesomeIcon icon={faFileExport} />
                        <div className="caption">
                          <span>Export matched</span>
                          <span>as JSON file</span>
                        </div>
                      </div>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item>
            <Grid container className="bottomBar">
              <Grid item>{displayStatus}</Grid>
              <Grid item xs className="loadedFileWrapper">
                <FontAwesomeIcon icon={faInfoCircle} />
                <span className="loadedFileName">{displayMessage}</span>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default connect(
  (store) => {
    const matchingPaths = store.matching.paths;
    const matchedCars = store.matching.matchedCars;
    const selectedObject = store.env.selected.object;
    const scene = store.env.scene;
    const parserType = store.parser.type;
    const matchOnlySampled = store.matching.matchOnlySampled;
    const allCars = store.env.cars;
    return { matchingPaths, matchedCars, selectedObject, scene, parserType, matchOnlySampled, allCars };
  },
  { removeMatchingPath, setMatchedCars, setMatchOnlySampled }
)(Matching);
