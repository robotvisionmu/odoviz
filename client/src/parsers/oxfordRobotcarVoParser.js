import * as path from 'path';

import { Euler, Matrix4, Vector3 } from 'three';

import store from '../store';

// Parse .vo files
// VO files are not accurate, use INS
// https://robotcar-dataset.robots.ox.ac.uk/documentation/#visual-odometry-vo
function parseFn(data, filePath) {
  // let points = [];
  const cameras = [];

  // Return if empty
  if (data && data.length <= 0) {
    console.error(`${config.name} Parser: File ${filePath} is empty`);
    return;
  }

  // Read line by line
  const dataLines = data.split(/\r\n|\n/);

  // First line should be NVM_V3
  if (dataLines.length < 2 || !dataLines[0].startsWith('source_timestamp,destination_timestamp,x,y,z,roll,pitch,yaw')) {
    console.error(`Unsupported file ${filePath} given for ${config.name} parser`);
    return;
  }

  console.debug('Total poses', dataLines.length);

  let absolutePose = new Matrix4();
  for (let i = 1; i < dataLines.length; i++) {
    const dataLine = dataLines[i];
    const entries = dataLine.split(',');

    const image = entries[1];

    const relativePosition = new Vector3(...entries.slice(2, 5).map((e) => parseFloat(e)));
    const relativeRotation = new Euler(...entries.slice(5, 8).map((e) => parseFloat(e)), 'XYZ');

    const relativePose = new Matrix4();
    relativePose.makeRotationFromEuler(relativeRotation);
    relativePose.setPosition(relativePosition);
    absolutePose = absolutePose.multiply(relativePose);

    const position = new Vector3().setFromMatrixPosition(absolutePose);
    const rotation = new Euler().setFromRotationMatrix(absolutePose);

    const timestamp = parseInt(entries[0]);
    const timestamp_end = parseInt(entries[1]);

    cameras.push({
      timestamp: timestamp * 1e-6,
      timestamp_end: timestamp_end * 1e-6,
      position,
      rotation,
      index: i,
      image: {
        display: 'none',
        value: image,
      },
    });

    // if (i > 5000) break;
  }

  return { cameras };
}

// Fetch rectified jpg images (rather than bayer PNGs)
function getImgPath(imageFilename, filePath) {
  const loadedFilePath = store.getState().files.filePath;
  if (filePath == null) filePath = loadedFilePath;

  const oxfordRobotcarRoot = path.join(filePath, '../..');
  const imageDir = path.join(oxfordRobotcarRoot, 'stereo', 'centre');
  if (imageFilename == null) return imageDir;
  return `${imageDir}/${imageFilename}.jpg`;
}

const config = {
  name: 'Oxford Robotcar VO',
  uid: 'oxfordRobotcarVo',
  triggerWord: 'oxford_robotcar',
  updateState: {
    sampling: {
      everyM: 12,
      everyDeg: 15,
    },
  },
};

export default { parseFn, getImgPath, config };
