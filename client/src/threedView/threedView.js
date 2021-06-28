import React, { Component } from 'react';
import { connect } from 'react-redux';

import { setCar } from 'reducers/assets/assetsActions';
import { setControlsObject } from 'reducers/env/controls/controlsActions';
import { defaultState as controlsDefaultState } from 'reducers/env/controls/controlsReducer';
import { setCamera, setCars, setPoints, setRenderer, setScene } from 'reducers/env/envActions';
import { setIsPinned, setSelectedObject, togglePinned } from 'reducers/env/selected/selectedActions';
import { loadFile } from 'reducers/save/saveFile/saveFileActions';
// import { loadSampling } from 'reducers/save/saveSampling/saveSamplingActions';
// import { loadSettings } from 'reducers/save/saveSettings/saveSettingsActions';
// import { loadView } from 'reducers/save/saveView/saveViewActions';

import { addAxis, addGrid, addGround, addLights, loadCarModel } from './scripts/add';
import setControls from './scripts/controls';
import initialize from './scripts/initialize';
import startRender from './scripts/render';

import './threedView.scss';

class ThreedView extends Component {
  constructor(props) {
    super(props);
    this.currentIntersectedObject = null;
    this.isRightClickAndDragged = false;
    this.mousePosition = { x: 0, y: 0 };
    this.highlightedPoints = null;
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      initiated: false,
      created: false,
      firstLoad: true,
    };
  }

  updateHighlightPoints = (highlightedPoints) => {
    this.highlightedPoints = highlightedPoints;
  };

  updateDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
    this.destroy();
    this.create();
  };

  create = () => {
    this.setState({ initiated: false });
    const { scene, camera, renderer } = initialize(this);
    this.props.setScene(scene);
    this.props.setCamera(camera);
    this.props.setRenderer(renderer);

    const controls = setControls({ scene, camera, renderer }, controlsDefaultState.type);
    this.props.setControlsObject(controls);
    this.setState({ created: true });
  };

  destroy = () => {
    while (this.canvas.firstChild) {
      this.canvas.firstChild.remove();
    }
    const { camera } = this.props;
    this.lastCameraPosition = camera.position.clone();
    this.lastCameraRotation = camera.rotation.clone();
    this.props.setScene(null);
    this.props.setCamera(null);
    this.props.setRenderer(null);
    this.props.setControlsObject(null);
    this.props.setCar(null);
    this.setState({ created: false, initiated: false });
  };

  componentDidMount() {
    // window.addEventListener('resize', this.updateDimensions);
    this.create();
  }

  componentWillUnmount() {
    // window.removeEventListener('resize', this.updateDimensions);
  }

  componentDidUpdate() {
    const { scene, camera, renderer, controls } = this.props;
    const { initiated, firstLoad } = this.state;

    if ([scene, camera, renderer, controls.object].some((e) => e === null)) return;
    if (!initiated) {
      addAxis(this.props);
      addGrid(this.props);
      addGround(this.props);
      addLights(this.props);

      startRender(this.props, this);
      loadCarModel(this.props.setCar); // triggers refresh view saga

      if (this.lastCameraPosition && this.lastCameraRotation) {
        const { x: px, y: py, z: pz } = this.lastCameraPosition;
        const { x: rx, y: ry, z: rz } = this.lastCameraPosition;
        camera.position.set(px, py, pz);
        camera.rotation.set(rx, ry, rz);
        controls.object.update();
        this.lastCameraPosition = null;
        this.lastCameraRotation = null;
      }

      this.setState({ initiated: true });
    }

    if (this.props.carModel != null && initiated && firstLoad) {
      loadFile();
      // loadView();
      // loadSettings();
      // loadSampling();
      this.setState({ firstLoad: false });
    }
  }

  render() {
    return (
      <div
        className="threedView"
        ref={(canvas) => {
          this.canvas = canvas;
        }}
      ></div>
    );
  }
}

export default connect(
  (store) => ({
    carModel: store.assets.car,
    scene: store.env.scene,
    camera: store.env.camera,
    controls: store.env.controls,
    renderer: store.env.renderer,
    data: store.files.data,
    selectedObject: store.env.selected.object,
    isPinned: store.env.selected.isPinned,
    highlightPointSize: store.settings.scene.highlightPointSize,
    points: store.env.points,
    animate: store.settings.scene.animate,
    animationDuration: store.settings.scene.animationDuration,
  }),
  {
    setScene,
    setCamera,
    setCars,
    setRenderer,
    setSelectedObject,
    togglePinned,
    setIsPinned,
    setControlsObject,
    setPoints,
    setCar,
  }
)(ThreedView);
