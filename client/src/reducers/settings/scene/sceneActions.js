import TWEEN from '@tweenjs/tween.js';
import deepEqual from 'deep-equal';
import * as THREE from 'three';

import { addLinesBetweenMatchingPoses } from 'reducers/locations/locationsActions';
import store from 'store';

import { sceneActions } from './sceneReducer';

function setCarScale(carScale) {
  return { type: sceneActions.setCarScale, payload: { carScale } };
}

function setShowCameras(showCameras) {
  return { type: sceneActions.setShowCameras, payload: { showCameras } };
}

function setSceneAnimate(animate) {
  return { type: sceneActions.setSceneAnimate, payload: { animate } };
}

function setShowPointCloud(showPointCloud) {
  return { type: sceneActions.setShowPointCloud, payload: { showPointCloud } };
}

function setTopView(topView) {
  return { type: sceneActions.setTopView, payload: { topView } };
}

function setGrid(grid) {
  return { type: sceneActions.setGrid, payload: { grid } };
}

function setDirectionalLight(directionalLight) {
  return { type: sceneActions.setDirectionalLight, payload: { directionalLight } };
}

function setAnimationDuration(animationDuration) {
  return { type: sceneActions.setAnimationDuration, payload: { animationDuration } };
}

function setPointSize(pointSize) {
  return { type: sceneActions.setPointSize, payload: { pointSize } };
}

function setHighlightPointSize(highlightPointSize) {
  return { type: sceneActions.setHighlightPointSize, payload: { highlightPointSize } };
}

function resetSceneSettings() {
  return { type: sceneActions.resetSceneSettings };
}

function applySceneSettings(settings) {
  return { type: sceneActions.applySceneSettings, payload: settings };
}

function compareSceneSettings(settings) {
  const currentStore = store.getState();
  return deepEqual(settings, currentStore.settings.scene, { strict: true });
}

function updateGrid() {
  const currentStore = store.getState();
  const { scene } = currentStore.env;
  const grid = scene.getObjectByName('gridHelper');
  const { grid: gridEnabled } = currentStore.settings.scene;
  grid.visible = gridEnabled;
}

function updateDirectionalLight() {
  const currentStore = store.getState();
  const { scene } = currentStore.env;
  const ambientLight = scene.getObjectByName('ambientLight');
  const directionalLight = scene.getObjectByName('directionalLight');
  const { directionalLight: directionalLightEnabled } = currentStore.settings.scene;
  if (directionalLightEnabled) {
    directionalLight.visible = true;
    ambientLight.intensity = 0.13;
  } else {
    directionalLight.visible = false;
    ambientLight.intensity = 0.8;
  }
}

function updateTopView() {
  const currentStore = store.getState();
  const { topView: topViewEnabled } = currentStore.settings.scene;
  const { controls } = currentStore.env;
  const controlsObject = controls.object;

  if (topViewEnabled) {
    // restrict to 2d view
    controlsObject.minPolarAngle = 0;
    // controlsObject.maxPolarAngle = 0;
    new TWEEN.Tween(controlsObject).to({ maxPolarAngle: 0 }, 1000).easing(TWEEN.Easing.Quadratic.InOut).start();
  } else {
    // remove restriction
    controlsObject.minPolarAngle = 0;
    controlsObject.maxPolarAngle = (75 * Math.PI) / 180;
  }
}

function updateCarColor() {
  const currentStore = store.getState();
  const scene = currentStore.env.scene;
  const carsGroup = scene.getObjectByName('cars');
  if (carsGroup == null || carsGroup.children.length === 0) return;

  const setCarColorHSL = (car, h, s, l) => {
    car.children.filter((e) => e.name === 'Body_Plane')[0].material = new THREE.MeshPhongMaterial({
      color: new THREE.Color().setHSL(h, s, l),
    });
  };
  for (let cg = 0; cg < carsGroup.children.length; cg++) {
    const currentCars = carsGroup.children[cg].children;
    for (let i = 0; i < currentCars.length; i++) {
      const currentCar = currentCars[i];
      const carData = currentCar.data;

      let hValue;
      const hueOffset = (cg * 0.3) % 1;
      if (currentStore.locations.colorApplied) hValue = (carData.location * 0.7) % 1;
      else hValue = i / (currentCars.length * 10) + hueOffset;
      setCarColorHSL(currentCar, hValue, 0.8, 0.7);
    }
  }

  addLinesBetweenMatchingPoses();
}

function updateCarScale() {
  const currentStore = store.getState();
  const scene = currentStore.env.scene;
  const carScale = currentStore.settings.scene.carScale;
  const carsGroup = scene.getObjectByName('cars');
  if (carsGroup == null || carsGroup.children.length === 0) return;

  for (const currentCarsGroup of carsGroup.children) {
    const cars = currentCarsGroup.children;
    for (const car of cars) car.scale.setScalar(carScale);
  }
}

function updateCameras() {
  const currentStore = store.getState();
  const scene = currentStore.env.scene;
  const carsGroup = scene.getObjectByName('cars');
  if (carsGroup == null || carsGroup.children.length === 0) return;
  for (const currentCarsGroup of carsGroup.children) {
    const cars = currentCarsGroup.children;
    const showCamerasSetting = currentStore.settings.scene.showCameras;
    if (showCamerasSetting) showCameras(cars);
    else hideCameras(cars);
  }
}

function updateHighlightPointSize() {
  const currentStore = store.getState();
  const scene = currentStore.env.scene;
  const highlightPointClouds = scene.children.filter((child) => child.name === 'highlightedPoints');
  const highlightPointSize = currentStore.settings.scene.highlightPointSize;
  highlightPointClouds.forEach((pointCloud) => {
    if (pointCloud.material.type === 'PointsMaterial') pointCloud.material.size = highlightPointSize;
    else if (pointCloud.material.type === 'ShaderMaterial')
      pointCloud.material.uniforms['pointSize'].value = highlightPointSize;
  });
}

function updatePointSize() {
  const currentStore = store.getState();
  const scene = currentStore.env.scene;
  const pointsGroup = scene.getObjectByName('points');
  if (pointsGroup == null || pointsGroup.children.length === 0) return;

  const pointSize = currentStore.settings.scene.pointSize;
  for (const currentPointsGroup of pointsGroup.children) {
    const pointClouds = currentPointsGroup.children;
    for (const pointCloud of pointClouds) {
      if (pointCloud.material.type === 'PointsMaterial') pointCloud.material.size = pointSize;
      else if (pointCloud.material.type === 'ShaderMaterial')
        pointCloud.material.uniforms['pointSize'].value = pointSize;
    }
  }
}

function updateShowPointClouds() {
  const currentStore = store.getState();
  const scene = currentStore.env.scene;
  const pointsGroup = scene.getObjectByName('points');
  if (pointsGroup == null || pointsGroup.children.length === 0) return;

  const showPointCloud = currentStore.settings.scene.showPointCloud;
  for (const currentPointsGroup of pointsGroup.children) {
    const pointClouds = currentPointsGroup.children;
    for (const pointCloud of pointClouds) pointCloud.visible = showPointCloud;
  }
}

function showCameras(cars) {
  for (const car of cars) {
    const carCameraHelpers = car.children.filter((child) => child.name === 'carCameraHelper');
    if (carCameraHelpers.length === 0) {
      console.debug('adding new cam helpers');
      const camera = new THREE.PerspectiveCamera(10, 1, 10, 20);
      const cameraHelper = new THREE.CameraHelper(camera);
      cameraHelper.name = 'carCameraHelper';
      car.add(cameraHelper);
    } else {
      console.debug('showing existing cam helpers');
      for (const carCameraHelper of carCameraHelpers) carCameraHelper.visible = true;
    }
  }
}

function hideCameras(cars, remove = false) {
  for (const car of cars) {
    const carCameraHelpers = car.children.filter((child) => child.name === 'carCameraHelper');
    for (const e of carCameraHelpers)
      if (remove) {
        console.debug('removing existing cam helpers');
        car.remove(e);
      } else {
        console.debug('hiding existing cam helpers');
        e.visible = false;
      }
  }
}

function refreshScene() {
  updateCarScale();
  updateCarColor();
  updateCameras();

  updateShowPointClouds();
  updateHighlightPointSize();
  updatePointSize();
  updateGrid();
  updateDirectionalLight();
  updateTopView();
}

export {
  setCarScale,
  setHighlightPointSize,
  setPointSize,
  setAnimationDuration,
  setShowCameras,
  setShowPointCloud,
  refreshScene,
  setTopView,
  setGrid,
  setDirectionalLight,
  applySceneSettings,
  compareSceneSettings,
  resetSceneSettings,
  setSceneAnimate,
  updateCarScale,
  updateCarColor,
  updateCameras,
  updateTopView,
  updateGrid,
  updateDirectionalLight,
  updateShowPointClouds,
  updateHighlightPointSize,
  updatePointSize,
};
