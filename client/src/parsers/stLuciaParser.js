import * as path from 'path';

import { Euler, Vector3, Math as ThreeMath } from 'three';

import store from '../store';
import Location from '../utils/common/Location';

async function parseFn(data, filePath) {
  const cameras = [];

  // Return if empty
  if (data && data.length <= 0) {
    console.error(`${config.name} Parser: File ${filePath} is empty`);
    return;
  }

  // Read line by line
  const dataLines = data.split(/\r\n|\n/);
  if (dataLines.length < 2) {
    console.error(
      `Unsupported file ${filePath} given for ${config.name} parser. File should contain more than 1 line.`
    );
    return;
  }

  console.debug('Total INS timestamps', dataLines.length);

  const img2TimestampCam0 = {};
  const img2TimestampCam1 = {};
  const img2TimestampFile = await fetch(`/files/${path.join(filePath, '../101215_153851_MultiCamera0.log')}`);
  const img2TimestampFileData = await img2TimestampFile.text();
  const img2TimestampLines = img2TimestampFileData.split(/\r\n|\n/);
  img2TimestampLines.forEach((l, i) => {
    if (i === 0) return;
    const entries = l.split(' ');
    const timestampCam0 = parseFloat(entries[0]) + parseFloat(entries[1]) * 1e-6;
    const timestampCam1 = parseFloat(entries[5]) + parseFloat(entries[6]) * 1e-6;
    const imgCam0 = path.basename(entries[10]);
    const imgCam1 = path.basename(entries[11]);
    img2TimestampCam0[imgCam0] = timestampCam0;
    img2TimestampCam1[imgCam1] = timestampCam1;
  });

  console.debug('Cam 0 images', img2TimestampLines.length);
  console.debug('Cam 1 images', img2TimestampLines.length);

  const insData = dataLines
    .map((l) => {
      if (l.length === 0) return null;
      const entries = l.split(' ');
      const timestamp = parseFloat(entries[0]) + parseFloat(entries[1]) * 1e-6;
      const rotation = new Euler(...entries.slice(9, 12).map((e) => parseFloat(e)), 'XYZ');
      const gps = new Location(
        parseFloat(entries[2]),
        parseFloat(entries[3]),
        parseFloat(entries[4]),
        ThreeMath.radToDeg(rotation.z)
      );
      const position = new Vector3(gps.latitude, gps.longitude, gps.altitude);
      return {
        timestamp,
        position,
        rotation,
        gps,
      };
    })
    .filter((e) => e != null) // filter null and NaN timestamp
    .sort((a, b) => a.timestamp - b.timestamp); // sort by timestamp

  let lastInsIndex = -1;
  Object.entries(img2TimestampCam0).forEach(([k, v], i) => {
    for (let insIndex = lastInsIndex + 1; insIndex < insData.length; insIndex++) {
      if (insData[insIndex].timestamp > v) {
        lastInsIndex = insIndex;
        break;
      }
      if (insIndex === insData.length - 1) lastInsIndex = insIndex;
    }
    const interpolatedData = { ...insData[lastInsIndex] };
    interpolatedData.index = i;
    interpolatedData.image = {
      display: 'none',
      cam_0: k,
    };
    cameras.push(interpolatedData);
  });

  lastInsIndex = -1;
  Object.entries(img2TimestampCam1).forEach(([k, v], j) => {
    for (let insIndex = lastInsIndex + 1; insIndex < insData.length; insIndex++) {
      if (insData[insIndex].timestamp > v) {
        lastInsIndex = insIndex;
        break;
      }
      if (insIndex === insData.length - 1) lastInsIndex = insIndex;
    }
    const interpolatedData = { ...insData[lastInsIndex] };
    interpolatedData.index = img2TimestampLines.length - 1 + j;
    interpolatedData.image = {
      display: 'none',
      cam_1: k,
    };
    cameras.push(interpolatedData);
  });

  return { cameras };
}

function getImgPath(imageFilename, filePath) {
  const loadedFilePath = store.getState().files.filePath;
  if (filePath == null) filePath = loadedFilePath;

  const stLuciaRoot = path.join(filePath, '..');
  const imageDir = path.join(stLuciaRoot, 'images');
  if (imageFilename == null) return imageDir;
  return `${imageDir}/${imageFilename}`;
}

const config = {
  name: 'St Lucia',
  uid: 'stLucia',
  triggerWord: 'st_lucia',
  updateState: {
    settings: {
      offset: {
        positionScale: 20000,
      },
    },
    sampling: {
      everyM: 50,
      everyDeg: 30,
    },
  },
};

export default { parseFn, getImgPath, config };
