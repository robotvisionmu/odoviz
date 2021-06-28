import React, { Component } from 'react';
import { connect } from 'react-redux';

import { faBraille, faCar, faMousePointer, faStopwatch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Slider, Tooltip } from '@material-ui/core';

import { setControlsObject, setControlsType } from 'reducers/env/controls/controlsActions';
import {
  defaultState as controlDefaultState,
  possibleValues as controlPossibleValues,
} from 'reducers/env/controls/controlsReducer';
import {
  setAnimationDuration,
  setCarScale,
  setDirectionalLight,
  setGrid,
  setHighlightPointSize,
  setPointSize,
  setSceneAnimate,
  setShowCameras,
  setShowPointCloud,
  setTopView,
} from 'reducers/settings/scene/sceneActions';
import { possibleValues } from 'reducers/settings/scene/sceneReducer';
import AntSwitch from 'ui/AntSwitch';
import TooltipValueLabel from 'ui/TooltipValueLabel';

import './sceneSettings.scss';

class SceneSettings extends Component {
  changeCarScale = (e, value) => {
    this.props.setCarScale(value.round(2));
  };
  changeAnimationDuration = (e, value) => {
    this.props.setAnimationDuration(value);
  };
  changePointCloudSize = (e, value) => {
    this.props.setPointSize(value.round(2));
  };
  changeHighlightPointCloudSize = (e, value) => {
    this.props.setHighlightPointSize(value.round(2));
  };

  toggleCameras = (e, value) => {
    this.props.setShowCameras(value);
  };
  togglePointCloud = (e, value) => {
    this.props.setShowPointCloud(value);
  };
  toggleAnimate = (e, value) => {
    this.props.setSceneAnimate(value);
  };
  toggleTopView = (e, value) => {
    this.props.setTopView(value);
  };
  toggleGrid = (e, value) => {
    this.props.setGrid(value);
  };
  toggleDirectionalLight = (e, value) => {
    this.props.setDirectionalLight(value);
  };
  toggleControlType = (e, value) => {
    if (value) this.props.setControlsType(controlPossibleValues.controls[1]);
    else this.props.setControlsType(controlPossibleValues.controls[0]);
  };

  render() {
    const {
      toggleControlType,
      toggleCameras,
      togglePointCloud,
      toggleAnimate,
      toggleTopView,
      toggleGrid,
      toggleDirectionalLight,
    } = this;
    const {
      carScale,
      controlsType,
      showCameras,
      showPointCloud,
      pointSize,
      highlightPointSize,
      animate,
      animationDuration,
      topView,
      directionalLight,
      grid,
    } = this.props;
    return (
      <div className="sceneSettings">
        <Grid container direction={'column'}>
          <Grid item className="topBar">
            <div className="title">Scene Settings</div>
          </Grid>

          <Grid item>
            <Grid container spacing={2} direction="column" className="sceneSettingsWrapper">
              <Grid item>
                <Grid container spacing={2}>
                  <Grid item xs>
                    Top View
                  </Grid>
                  <Grid item>
                    <Grid component="label" container alignItems="center" spacing={1}>
                      <Grid item> off </Grid>
                      <Grid item>
                        <AntSwitch checked={topView === true} onChange={toggleTopView} />
                      </Grid>
                      <Grid item> on </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item>
                <Grid container spacing={2}>
                  <Grid item xs>
                    Grid
                  </Grid>
                  <Grid item>
                    <Grid component="label" container alignItems="center" spacing={1}>
                      <Grid item> off </Grid>
                      <Grid item>
                        <AntSwitch checked={grid === true} onChange={toggleGrid} />
                      </Grid>
                      <Grid item> on </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item>
                <Grid container spacing={2}>
                  <Grid item xs>
                    Shadows
                  </Grid>
                  <Grid item>
                    <Grid component="label" container alignItems="center" spacing={1}>
                      <Grid item> off </Grid>
                      <Grid item>
                        <AntSwitch checked={directionalLight === true} onChange={toggleDirectionalLight} />
                      </Grid>
                      <Grid item> on </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item>
                <Grid container spacing={2}>
                  <Grid item xs>
                    Controls
                  </Grid>
                  <Grid item>
                    <Grid component="label" container alignItems="center" spacing={1}>
                      <Grid item> {controlPossibleValues.controls[0]} </Grid>
                      <Grid item>
                        <AntSwitch checked={controlsType === controlDefaultState.type} onChange={toggleControlType} />
                      </Grid>
                      <Grid item> {controlPossibleValues.controls[1]} </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item>
                <Grid container spacing={2}>
                  <Grid item>
                    <Tooltip placement="bottom" title="Car Scale">
                      <span>
                        <FontAwesomeIcon icon={faCar} />
                      </span>
                    </Tooltip>
                  </Grid>
                  <Grid item xs>
                    <Slider
                      className="slider"
                      ValueLabelComponent={TooltipValueLabel}
                      value={carScale}
                      valueLabelDisplay="auto"
                      min={possibleValues.carScale[0]}
                      max={possibleValues.carScale[1]}
                      step={possibleValues.carScale[2]}
                      onChange={this.changeCarScale}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item>
                <Grid container spacing={2}>
                  <Grid item xs>
                    Cameras
                  </Grid>
                  <Grid item>
                    <Grid component="label" container alignItems="center" spacing={1}>
                      <Grid item> off </Grid>
                      <Grid item>
                        <AntSwitch checked={showCameras === true} onChange={toggleCameras} />
                      </Grid>
                      <Grid item> on </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item>
                <Grid container spacing={2}>
                  <Grid item xs>
                    Point Cloud
                  </Grid>
                  <Grid item>
                    <Grid component="label" container alignItems="center" spacing={1}>
                      <Grid item> off </Grid>
                      <Grid item>
                        <AntSwitch checked={showPointCloud === true} onChange={togglePointCloud} />
                      </Grid>
                      <Grid item> on </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item>
                <Grid container spacing={2}>
                  <Grid item>
                    <Tooltip placement="bottom" title="Point Cloud Size">
                      <span>
                        <FontAwesomeIcon icon={faBraille} />
                      </span>
                    </Tooltip>
                  </Grid>
                  <Grid item xs>
                    <Slider
                      className="slider"
                      ValueLabelComponent={TooltipValueLabel}
                      value={pointSize}
                      valueLabelDisplay="auto"
                      min={possibleValues.pointSize[0]}
                      max={possibleValues.pointSize[1]}
                      step={possibleValues.pointSize[2]}
                      onChange={this.changePointCloudSize}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item>
                <Grid container spacing={2}>
                  <Grid item>
                    <Tooltip placement="bottom" title="Highlight Point Cloud Size">
                      <span>
                        <span className="fa-layers fa-fw">
                          <FontAwesomeIcon icon={faBraille} />
                          <FontAwesomeIcon icon={faMousePointer} transform="shrink-2 right-5 down-4" />
                        </span>
                      </span>
                    </Tooltip>
                  </Grid>
                  <Grid item xs>
                    <Slider
                      className="slider"
                      ValueLabelComponent={TooltipValueLabel}
                      value={highlightPointSize}
                      valueLabelDisplay="auto"
                      min={possibleValues.highlightPointSize[0]}
                      max={possibleValues.highlightPointSize[1]}
                      step={possibleValues.highlightPointSize[2]}
                      onChange={this.changeHighlightPointCloudSize}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item>
                <Grid container spacing={2}>
                  <Grid item xs>
                    Animate
                  </Grid>
                  <Grid item>
                    <Grid component="label" container alignItems="center" spacing={1}>
                      <Grid item> {'off'} </Grid>
                      <Grid item>
                        <AntSwitch checked={animate === true} onChange={toggleAnimate} />
                      </Grid>
                      <Grid item> {'on'} </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item>
                <Grid container spacing={2}>
                  <Grid item>
                    <Tooltip placement="bottom" title="Animation Duration per car">
                      <span>
                        <FontAwesomeIcon icon={faStopwatch} />
                      </span>
                    </Tooltip>
                  </Grid>
                  <Grid item xs>
                    <Slider
                      className="slider"
                      ValueLabelComponent={TooltipValueLabel}
                      value={animationDuration}
                      valueLabelDisplay="auto"
                      min={possibleValues.animationDuration[0]}
                      max={possibleValues.animationDuration[1]}
                      step={possibleValues.animationDuration[2]}
                      onChange={this.changeAnimationDuration}
                    />
                  </Grid>
                </Grid>
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
    const {
      carScale,
      pointSize,
      highlightPointSize,
      showCameras,
      showPointCloud,
      animate,
      animationDuration,
      topView,
      grid,
      directionalLight,
    } = store.settings.scene;
    const { object: controls, type: controlsType } = store.env.controls;
    const { scene, camera, renderer } = store.env;
    return {
      scene,
      renderer,
      camera,
      carScale,
      pointSize,
      highlightPointSize,
      showCameras,
      showPointCloud,
      controlsType,
      controls,
      animate,
      animationDuration,
      topView,
      grid,
      directionalLight,
    };
  },
  {
    setControlsObject,
    setAnimationDuration,
    setCarScale,
    setPointSize,
    setShowPointCloud,
    setShowCameras,
    setHighlightPointSize,
    setControlsType,
    setSceneAnimate,
    setTopView,
    setGrid,
    setDirectionalLight,
  }
)(SceneSettings);
