import * as path from 'path';

import { Vector3 } from 'three';

import store from '../store';

function parseFn(data, filePath) {
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
  console.debug('Total timestamps', dataLines.length);

  for (let i = 0; i < dataLines.length; i++) {
    const dataLine = dataLines[i];
    if (dataLine.length === 0) continue;
    const entries = dataLine.split(' ');

    const position = new Vector3(parseFloat(entries[1]), parseFloat(entries[2]), 0);
    const img = entries[0];
    const cam = i % 2 === 1 ? 'left' : 'right';

    cameras.push({
      cam,
      position,
      index: i,
      image: {
        display: 'none',
        value: img,
      },
    });
  }

  return { cameras };
}

function getImgPath(imageFilename, filePath) {
  const loadedFilePath = store.getState().files.filePath;
  if (filePath == null) filePath = loadedFilePath;

  const newCollegeRoot = path.join(filePath, '..');
  const imageDir = path.join(newCollegeRoot, 'Images');
  if (imageFilename == null) return imageDir;
  return `${imageDir}/${imageFilename}`;
}

const config = {
  name: 'New College',
  uid: 'newCollege',
  triggerWord: 'new_college',
  updateState: {
    settings: {
      offset: {
        positionScale: 1,
      },
    },
    sampling: {
      everyM: 4,
      everyDeg: Infinity,
    },
  },
};

export default { parseFn, getImgPath, config };
