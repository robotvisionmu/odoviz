import deepEqual from 'deep-equal';
import * as THREE from 'three';

import store from 'store';

import { offsetActions } from './offsetReducer';

function setPositionScale(positionScale) {
  return { type: offsetActions.setPositionScale, payload: { positionScale } };
}

function setTimeOnZAxis(timeOnZAxis) {
  return { type: offsetActions.setTimeOnZAxis, payload: { timeOnZAxis } };
}

function setOffsetRotationX(offsetRotationX) {
  return { type: offsetActions.setOffsetRotationX, payload: { offsetRotationX } };
}

function setOffsetRotationY(offsetRotationY) {
  return { type: offsetActions.setOffsetRotationY, payload: { offsetRotationY } };
}

function setOffsetRotationZ(offsetRotationZ) {
  return { type: offsetActions.setOffsetRotationZ, payload: { offsetRotationZ } };
}

function setInvertRotationX(invertRotationX) {
  return { type: offsetActions.setInvertRotationX, payload: { invertRotationX } };
}

function setInvertRotationY(invertRotationY) {
  return { type: offsetActions.setInvertRotationY, payload: { invertRotationY } };
}

function setInvertRotationZ(invertRotationZ) {
  return { type: offsetActions.setInvertRotationZ, payload: { invertRotationZ } };
}

function setInvertPositionX(invertPositionX) {
  return { type: offsetActions.setInvertPositionX, payload: { invertPositionX } };
}

function setInvertPositionY(invertPositionY) {
  return { type: offsetActions.setInvertPositionY, payload: { invertPositionY } };
}

function setInvertPositionZ(invertPositionZ) {
  return { type: offsetActions.setInvertPositionZ, payload: { invertPositionZ } };
}

function setSwapPositionXY(swapPositionXY) {
  return { type: offsetActions.setSwapPositionXY, payload: { swapPositionXY } };
}

function setSwapPositionYZ(swapPositionYZ) {
  return { type: offsetActions.setSwapPositionYZ, payload: { swapPositionYZ } };
}

function setSwapPositionXZ(swapPositionXZ) {
  return { type: offsetActions.setSwapPositionXZ, payload: { swapPositionXZ } };
}

function setSwapRotationXY(swapRotationXY) {
  return { type: offsetActions.setSwapRotationXY, payload: { swapRotationXY } };
}

function setSwapRotationYZ(swapRotationYZ) {
  return { type: offsetActions.setSwapRotationYZ, payload: { swapRotationYZ } };
}

function setSwapRotationXZ(swapRotationXZ) {
  return { type: offsetActions.setSwapRotationXZ, payload: { swapRotationXZ } };
}

function setShowAltitude(showAltitude) {
  return { type: offsetActions.setShowAltitude, payload: { showAltitude } };
}

function resetOffsetSettings() {
  return { type: offsetActions.resetOffsetSettings };
}

function applyOffsetSettings(settings) {
  return { type: offsetActions.applyOffsetSettings, payload: settings };
}

function compareOffsetSettings(settings) {
  const currentStore = store.getState();
  return deepEqual(settings, currentStore.settings.offset, { strict: true });
}

function getInvertVector(invertX, invertY, invertZ) {
  return new THREE.Vector3(invertX ? -1 : 1, invertY ? -1 : 1, invertZ ? -1 : 1);
}

function getSwappedVector(vec, swapXY, swapYZ, swapXZ) {
  let { x, y, z } = vec;
  if (swapXY) [x, y] = [y, x];
  if (swapYZ) [y, z] = [z, y];
  if (swapXZ) [x, z] = [z, x];
  return new THREE.Vector3(x, y, z);
}

function getUpdatedPosition(position, pointCloud = false, index = 0) {
  const currentStore = store.getState();
  const initialPosition = currentStore.env.cars[0].position;
  const {
    positionScale,
    timeOnZAxis,
    showAltitude,
    invertPositionX,
    invertPositionY,
    invertPositionZ,
    swapPositionXY,
    swapPositionYZ,
    swapPositionXZ,
  } = store.getState().settings.offset;

  let updatedPosition = position.clone();
  updatedPosition.sub(initialPosition);
  if (!showAltitude && !pointCloud) updatedPosition.z = 0;

  updatedPosition = getSwappedVector(updatedPosition, swapPositionXY, swapPositionYZ, swapPositionXZ);
  updatedPosition.multiply(getInvertVector(invertPositionX, invertPositionY, invertPositionZ));
  updatedPosition.multiplyScalar(positionScale);
  updatedPosition.add(new THREE.Vector3(0, index * timeOnZAxis * 0.01, 0));
  return updatedPosition;
}

function getUpdatedRotation(rotation) {
  const currentStore = store.getState();
  const {
    offsetRotationX,
    offsetRotationY,
    offsetRotationZ,
    invertRotationX,
    invertRotationY,
    invertRotationZ,
    swapRotationXY,
    swapRotationYZ,
    swapRotationXZ,
  } = currentStore.settings.offset;

  const offsetVector = new THREE.Vector3(offsetRotationX, offsetRotationY, offsetRotationZ);
  offsetVector.multiplyScalar(Math.PI / 180);

  let updatedRotation = rotation.toVector3();
  updatedRotation = getSwappedVector(updatedRotation, swapRotationXY, swapRotationYZ, swapRotationXZ);
  updatedRotation.multiply(getInvertVector(invertRotationX, invertRotationY, invertRotationZ));
  updatedRotation.add(offsetVector);

  const updatedRotationEuler = new THREE.Euler();
  updatedRotationEuler.setFromVector3(updatedRotation);
  return updatedRotationEuler;
}

function applyOffsetsToPointCloud(pointCloud) {
  const points = pointCloud.data;
  const vertices = [];
  for (const point of points) vertices.push(getUpdatedPosition(point.position, true));
  pointCloud.geometry.vertices = vertices;
  pointCloud.geometry.verticesNeedUpdate = true;
}

function refreshOffsets() {
  const currentStore = store.getState();
  const scene = currentStore.env.scene;
  const carsGroup = scene.getObjectByName('cars');
  if (carsGroup == null || carsGroup.children.length === 0) return;

  for (const currentCarsGroup of carsGroup.children) {
    const cars = currentCarsGroup.children;
    for (const [index, car] of cars.entries()) {
      if (car.data == null) continue;
      if (car.data.position == null) continue;
      car.position.copy(getUpdatedPosition(car.data.position, false, index));
      if (car.data.rotation == null) continue;
      car.rotation.copy(getUpdatedRotation(car.data.rotation));
    }
  }

  const pointsGroup = scene.getObjectByName('points');
  if (pointsGroup == null || pointsGroup.children.length === 0) return;

  for (const currentPointsGroup of pointsGroup.children) {
    const pointClouds = currentPointsGroup.children;
    for (const pointCloud of pointClouds) {
      if (pointCloud.data) applyOffsetsToPointCloud(pointCloud);
    }
  }
}

export {
  setPositionScale,
  setTimeOnZAxis,
  setOffsetRotationX,
  setOffsetRotationY,
  setOffsetRotationZ,
  setInvertRotationX,
  setInvertRotationY,
  setInvertRotationZ,
  setInvertPositionX,
  setInvertPositionY,
  setInvertPositionZ,
  setSwapPositionXY,
  setSwapPositionYZ,
  setSwapPositionXZ,
  setSwapRotationXY,
  setSwapRotationYZ,
  setSwapRotationXZ,
  resetOffsetSettings,
  refreshOffsets,
  applyOffsetSettings,
  setShowAltitude,
  compareOffsetSettings,
  applyOffsetsToPointCloud,
  getUpdatedPosition,
  getUpdatedRotation,
};
