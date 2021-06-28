import * as pathUtils from 'path';

import * as THREE from 'three';
import { Euler, Quaternion } from 'three';

import store from '../store';

function parseFn(data, filePath) {
  const points = [];
  const cameras = [];

  // Return if empty
  if (data && data.length <= 0) {
    console.error(`${config.name} Parser: File ${filePath} is empty`);
    return;
  }

  // Read line by line
  const dataLines = data.split('\n');

  // First line should be NVM_V3
  if (dataLines.length < 3 || dataLines[0] !== 'NVM_V3') {
    console.error(`Unsupported file ${filePath} given for ${config.name} parser`);
    return;
  }

  const numberOfCameras = parseInt(dataLines[1].split(' ')[0]);
  console.debug('Number of poses', numberOfCameras);

  const cameraIndex = 1 + 1;
  const camerasInFile = dataLines.slice(cameraIndex, cameraIndex + numberOfCameras);
  camerasInFile.forEach((cameraLine, i) => {
    const params = cameraLine.split(' ');

    const image = params[0];
    const fl = parseFloat(params[1]);

    const rw = parseFloat(params[2]);
    const rx = parseFloat(params[3]);
    const ry = parseFloat(params[4]);
    const rz = parseFloat(params[5]);
    const rotationQ = new Quaternion(rw, rx, ry, rz);
    const rotation = new Euler().setFromQuaternion(rotationQ, 'XYZ');

    const x = parseFloat(params[6]);
    const y = parseFloat(params[7]);
    const z = parseFloat(params[8]);
    const position = new THREE.Vector3(x, y, z);

    // Add to global cameras
    cameras.push({
      focalLength: fl,
      position,
      rotation,
      index: i,
      image: {
        display: 'none',
        value: image,
      },
    });
  });

  const numberOfPoints = parseInt(dataLines[cameraIndex + numberOfCameras].split(' ')[0]);

  const pointIndex = cameraIndex + numberOfCameras + 1;
  const pointsInFile = dataLines.slice(pointIndex, pointIndex + numberOfPoints);
  pointsInFile.forEach((pointLine, i) => {
    const params = pointLine.split(' ');

    // parse xyz
    const x = parseFloat(params[0]);
    const y = parseFloat(params[1]);
    const z = parseFloat(params[2]);
    const position = new THREE.Vector3(x, y, z);

    // parse rgb
    const r = parseFloat(params[3]);
    const g = parseFloat(params[4]);
    const b = parseFloat(params[5]);
    const color = { r, g, b };

    // parse number of measurements
    const numberOfMeasurements = params[6];
    const measurementsList = params.slice(7);

    // parse measurements
    const measurements = [];
    for (let i = 0; i < numberOfMeasurements; i++)
      measurements.push(measurementsList.slice(i * 4, i * 4 + 4).map((m) => parseFloat(m)));

    // Add to global points
    points.push({
      position,
      color,
      measurements,
      index: i,
    });
  });

  return { cameras, points };
}

function getImgPath(imageFilename, filePath) {
  const loadedFilePath = store.getState().files.filePath;
  if (filePath == null) filePath = loadedFilePath;

  const sliceName = pathUtils.basename(filePath, pathUtils.extname(filePath));
  const cmuRoot = pathUtils.dirname(pathUtils.dirname(pathUtils.dirname(filePath)));
  const imageRoot = pathUtils.join(cmuRoot, 'images');
  const imageDir = pathUtils.join(imageRoot, sliceName);
  return `${imageDir}/${imageFilename}`;
}

const config = {
  name: 'CMU Seasons',
  uid: 'cmuSeasons',
  triggerWord: 'cmu_seasons',
  updateState: {
    settings: {
      offset: {
        invertPositionX: true,
        invertPositionY: false,
        invertPositionZ: false,
        invertRotationX: false,
        invertRotationY: false,
        invertRotationZ: false,
        offsetRotationX: 0,
        offsetRotationY: 0,
        offsetRotationZ: 90,
        swapPositionXY: false,
        swapPositionXZ: false,
        swapPositionYZ: true,
        swapRotationXY: true,
        swapRotationXZ: false,
        swapRotationYZ: false,
      },
    },
  },
};

export default { parseFn, getImgPath, config };
