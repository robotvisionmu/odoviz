import * as path from 'path';

import * as THREE from 'three';
import { Euler, Vector3 } from 'three';

import store from '../store';
import Location from '../utils/common/Location';

const imgFps = 1;

function parseFn(data, filePath) {
  const cameras = [];

  // Return if empty
  if (data && data.length <= 0) {
    console.error(`${config.name} Parser: File ${filePath} is empty`);
    return;
  }

  // Parse JSON
  try {
    data = JSON.parse(data);
  } catch (e) {
    console.error(`Unsupported file ${filePath} given for ${config.name} parser; Could not parse as JSON`);
    return;
  }

  // Get locations
  const locations = data.locations;
  // console.log(locations[0], locations[locations.length - 1]);

  // return if locations array is empty
  if (locations == null || locations.length < 1) {
    console.error(`${config.name} Parser: File ${filePath} contains 0 locations`);
    return;
  }

  locations.forEach((location, i) => {
    const position = new Vector3(location.latitude, location.longitude, 0);
    const rotation = new Euler(0, 0, THREE.Math.degToRad(location.course), 'XYZ');
    const gps = new Location(location.latitude, location.longitude, 0, location.course);
    const imgIdx = parseInt((location.timestamp - locations[0].timestamp) * 1e-3 * imgFps);

    cameras.push({
      timestamp: location.timestamp * 1e-3,
      position,
      rotation,
      gps,
      index: i,
      image: {
        display: 'none',
        value: imgIdx.toString().padStart(5, '0'),
      },
    });
  });

  return { cameras };
}

function getImgPath(imageFilename, filePath) {
  const loadedFilePath = store.getState().files.filePath;
  if (filePath == null) filePath = loadedFilePath;

  const bdd100kRoot = path.join(filePath, '../../../..');
  const filePathTokens = filePath.split(path.sep);
  const bdd100kRootTokens = bdd100kRoot.split(path.sep);
  const trajectoryName = path.basename(filePath, path.extname(filePath));

  const imageDir = path.join(
    bdd100kRoot,
    'images',
    ...filePathTokens.slice(bdd100kRootTokens.length + 1, filePathTokens.length - 1),
    trajectoryName
  );
  if (imageFilename == null) return imageDir;
  return `${imageDir}/${imageFilename}.jpg`;
}

const config = {
  name: 'BDD100K',
  uid: 'bdd100k',
  triggerWord: 'bdd100k',
  updateState: {
    settings: {
      offset: {
        positionScale: 20000,
      },
    },
  },
};

export default { parseFn, getImgPath, config };
