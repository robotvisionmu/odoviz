import deepEqual from 'deep-equal';

import { addCars } from 'reducers/env/envActions';
import store from 'store';
import { sample } from 'threedView/scripts/sample';

import { samplingActions } from './samplingReducer';

function changeEveryM(everyM) {
  return { type: samplingActions.changeEveryM, payload: { everyM } };
}

function changeEveryDeg(everyDeg) {
  return { type: samplingActions.changeEveryDeg, payload: { everyDeg } };
}

function setUnitToM(unitToM) {
  return { type: samplingActions.setUnitToM, payload: { unitToM } };
}

function applySamplingSettings(samplingSettings) {
  return { type: samplingActions.applySamplingSettings, payload: samplingSettings };
}

function compareSamplingSettings(samplingSettings) {
  const currentStore = store.getState();
  return deepEqual(samplingSettings, currentStore.sampling, { strict: true });
}

function resetSamplingSettings() {
  return { type: samplingActions.resetSampling };
}

function refreshSampling() {
  const currentStore = store.getState();
  const scene = currentStore.env.scene;

  const everyM = currentStore.sampling.everyM;
  const everyDeg = currentStore.sampling.everyDeg;
  const unitToM = currentStore.sampling.unitToM;
  const everyUnit = everyM / unitToM;

  const carsGroup = scene.getObjectByName('cars');
  if (carsGroup) carsGroup.children = [];

  const filepath = currentStore.files.filePath;
  const originalCars = currentStore.env.cars;
  const sampledCars = sample(originalCars, everyUnit, everyDeg);
  addCars(sampledCars, filepath);
}

function getSampledCarsJson() {
  const currentStore = store.getState();
  const scene = currentStore.env.scene;

  let cars = [];
  const carsGroup = scene.getObjectByName('cars');
  if (carsGroup) cars = carsGroup.children[0].children;

  const carsJson = [];
  for (const car of cars) carsJson.push(car.data);

  return carsJson;
}

export {
  changeEveryM,
  setUnitToM,
  changeEveryDeg,
  resetSamplingSettings,
  applySamplingSettings,
  compareSamplingSettings,
  refreshSampling,
  getSampledCarsJson,
};
