import * as THREE from 'three';

import store from 'store';

import { locationsActions } from './locationsReducer';

function setLoopsData(loops, loopsTxtFile) {
  return { type: locationsActions.setLoopsData, payload: { loops, loopsTxtFile } };
}

function setLocationsData(imageIndexToLocation, locationsTxtFile) {
  return { type: locationsActions.setLocationsData, payload: { imageIndexToLocation, locationsTxtFile } };
}

function setLocationsApplied(locationsApplied) {
  return { type: locationsActions.setLocationsApplied, payload: { locationsApplied } };
}

function setColorApplied(colorApplied) {
  return { type: locationsActions.setColorApplied, payload: { colorApplied } };
}

function addLocationInfo() {
  const currentStore = store.getState();
  const scene = currentStore.env.scene;
  const filepath = currentStore.files.filePath;
  const { imageIndexToLocation, loops } = currentStore.locations;
  const carsGroup = scene.getObjectByName('cars');
  if (carsGroup == null || carsGroup.children.length === 0) return;

  let mainCars;
  for (const currentCarsGroup of carsGroup.children) {
    if (currentCarsGroup.name !== filepath) continue; // for loaded (main) traversal
    const cars = currentCarsGroup.children;
    mainCars = cars;
    for (const car of cars) {
      const carData = car.data;
      // note: use this if using unsampled version in htmap
      // carData.location = imageIndexToLocation[carData.imageIndex];
      // carData.imageLoops = loops[carData.imageIndex] || [];
      carData.location = imageIndexToLocation[carData.samplingIndex];
      carData.imageLoops = loops[carData.samplingIndex] || [];
      carData.locationLoops = carData.imageLoops
        .map((imageIndex) => imageIndexToLocation[imageIndex])
        .filter((e) => e !== carData.location);
    }
  }

  for (const currentCarsGroup of carsGroup.children) {
    const cars = currentCarsGroup.children;
    if (currentCarsGroup.name === filepath) continue; // for matched traversals
    for (const car of cars) {
      const carData = car.data;
      const mainCarData = mainCars[carData.matchingForSamplingIndex].data;
      carData.location = mainCarData.location;
      // carData.imageLoops = mainCarData.imageLoops;
      carData.locationLoops = mainCarData.locationLoops;
    }
  }
}

function removeLocationInfo() {
  const currentStore = store.getState();
  const scene = currentStore.env.scene;
  const carsGroup = scene.getObjectByName('cars');
  if (carsGroup == null || carsGroup.children.length === 0) return;

  for (const currentCarsGroup of carsGroup.children) {
    const cars = currentCarsGroup.children;
    for (const car of cars) {
      const carData = car.data;
      delete carData.location;
      delete carData.imageLoops;
      delete carData.locationLoops;
    }
  }

  removeLinesBetweenMatchingPoses();
}

function removeLinesBetweenMatchingPoses() {
  const currentStore = store.getState();
  const scene = currentStore.env.scene;
  const linesGroup = scene.getObjectByName('lines');
  if (linesGroup) scene.remove(linesGroup);
}

function addLinesBetweenMatchingPoses() {
  const currentStore = store.getState();
  if (!currentStore.locations.colorApplied) return;
  const scene = currentStore.env.scene;
  const carsGroup = scene.getObjectByName('cars');
  if (carsGroup == null || carsGroup.children.length === 0) return;

  let linesGroup = scene.getObjectByName('lines');
  if (!linesGroup) {
    linesGroup = new THREE.Group();
    linesGroup.name = 'lines';
    scene.add(linesGroup);
  }

  for (const currentCarsGroup of carsGroup.children) {
    const cars = currentCarsGroup.children;
    for (const car1 of cars) {
      for (const car2 of cars) {
        if (car1.data.imageLoops.includes(car2.data.samplingIndex)) linesGroup.add(getLine(car1, car2));
      }
    }
  }
}

function getLine(obj1, obj2) {
  const lineGeometry = new THREE.Geometry();
  lineGeometry.vertices.push(obj1.position, obj2.position);
  lineGeometry.computeLineDistances();
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0xcc0000 });
  const line = new THREE.Line(lineGeometry, lineMaterial);
  return line;
}

export {
  setLocationsData,
  setLoopsData,
  setLocationsApplied,
  setColorApplied,
  removeLocationInfo,
  addLocationInfo,
  addLinesBetweenMatchingPoses,
};
