import * as THREE from 'three';

import store from 'store';

import { envActions } from './envReducer';

function setCamera(camera) {
  return { type: envActions.setCamera, payload: { camera } };
}

function setScene(scene) {
  return { type: envActions.setScene, payload: { scene } };
}

function setCars(cars) {
  return { type: envActions.setCars, payload: { cars } };
}

function setPoints(points) {
  return { type: envActions.setPoints, payload: { points } };
}

function setRenderer(renderer) {
  return { type: envActions.setRenderer, payload: { renderer } };
}

function addCars(cars = null, filepath = null) {
  const currentStore = store.getState();
  const scene = currentStore.env.scene;
  if (cars == null) {
    if (currentStore.env.cars != null) {
      cars = currentStore.env.cars;
      if (cars.length === 0) return;
    } else return;
  }
  const carMesh = currentStore.assets.car;

  let carsGroup = scene.getObjectByName('cars');
  if (!carsGroup) {
    carsGroup = new THREE.Group();
    carsGroup.name = 'cars';
    scene.add(carsGroup);
  }

  if (filepath == null) filepath = currentStore.files.filePath;
  const currentCarsGroup = new THREE.Group();
  currentCarsGroup.name = filepath;
  for (const carData of cars) {
    const car = carMesh.clone();
    car.name = 'car';
    car.data = carData;
    currentCarsGroup.add(car);
  }

  carsGroup.add(currentCarsGroup);
}

function addPointCloud() {
  const currentStore = store.getState();
  const scene = currentStore.env.scene;
  const points = currentStore.env.points;
  if (points == null) return;

  let pointsGroup = scene.getObjectByName('points');
  if (!pointsGroup) {
    pointsGroup = new THREE.Group();
    pointsGroup.name = 'points';
    scene.add(pointsGroup);
  }

  const filepath = currentStore.files.filePath;
  const currentPointsGroup = new THREE.Group();
  currentPointsGroup.name = filepath;

  const pointCloudGeometry = new THREE.Geometry();
  for (const point of points) pointCloudGeometry.vertices.push(point.position.clone());

  const pointSize = store.getState().settings.scene.pointSize;
  const dotMaterial = new THREE.PointsMaterial({ size: pointSize, sizeAttenuation: false });
  const pointCloud = new THREE.Points(pointCloudGeometry, dotMaterial);
  pointCloud.name = 'pointCloud';
  pointCloud.data = points;
  currentPointsGroup.add(pointCloud);
}

function removeAllCars() {
  const scene = store.getState().env.scene;
  const carsGroup = scene.getObjectByName('cars');
  if (carsGroup) scene.remove(carsGroup);
}

function removeCars(path) {
  const scene = store.getState().env.scene;
  const carsGroup = scene.getObjectByName('cars');
  const carsSubGroup = carsGroup.children.filter((subGroup) => subGroup.name === path)[0];
  if (carsGroup) carsGroup.remove(carsSubGroup);
}

function showCars(path) {
  const scene = store.getState().env.scene;
  const carsGroup = scene.getObjectByName('cars');
  const carsSubGroup = carsGroup.children.filter((subGroup) => subGroup.name === path)[0];
  carsSubGroup.visible = true;
}

function hideCars(path) {
  const scene = store.getState().env.scene;
  const carsGroup = scene.getObjectByName('cars');
  const carsSubGroup = carsGroup.children.filter((subGroup) => subGroup.name === path)[0];
  carsSubGroup.visible = false;
  console.log(path);
}

function removePointClouds() {
  const scene = store.getState().env.scene;
  const pointsGroup = scene.getObjectByName('points');
  if (pointsGroup) scene.remove(pointsGroup);
}

function removeHighlightedPoints() {
  const scene = store.getState().env.scene;
  const highlightedPointCloud = scene.getObjectByName('highlightedPoints');
  if (highlightedPointCloud) scene.remove(highlightedPointCloud);
}

export {
  setCamera,
  setScene,
  setCars,
  setRenderer,
  setPoints,
  addCars,
  addPointCloud,
  removeAllCars,
  removePointClouds,
  removeCars,
  showCars,
  hideCars,
  removeHighlightedPoints,
};
