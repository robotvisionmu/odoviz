import * as path from 'path';

import { Euler, Vector3, Math as ThreeMath } from 'three';

import store from '../store';
import Location from '../utils/common/Location';

// Parse INS CSV files
// https://robotcar-dataset.robots.ox.ac.uk/documentation/#gpsins
async function parseFn(data, filePath) {
  // let points = [];
  const cameras = [];

  // Return if empty
  if (data && data.length <= 0) {
    console.error(`${config.name} Parser: File ${filePath} is empty`);
    return;
  }

  // Read line by line
  const dataLines = data.split(/\r\n|\n/);

  // First line should be
  if (
    dataLines.length < 2 ||
    !dataLines[0].startsWith(
      'timestamp,ins_status,latitude,longitude,altitude,northing,easting,down,utm_zone,velocity_north,velocity_east,velocity_down,roll,pitch,yaw'
    )
  ) {
    console.error(`Unsupported file ${filePath} given for ${config.name} parser`);
    return;
  }

  console.debug('Total INS timestamps', dataLines.length);

  const imageFolder = getImgPath(null, filePath);
  const response = await fetch(`/files?path=${imageFolder}`);
  const responseData = await response.json();
  const filenames = responseData
    .filter((f) => f.type === 'file')
    .map((file) => parseInt(file.name))
    .sort((a, b) => a - b);

  console.debug('Total images timestamps', filenames.length);

  const insData = dataLines
    .map((l) => {
      if (l.length === 0) return null;
      const entries = l.split(',');
      const timestamp = parseInt(entries[0]);
      const position = new Vector3(...entries.slice(5, 8).map((e) => parseFloat(e)));
      const rotation = new Euler(...entries.slice(12, 15).map((e) => parseFloat(e)), 'XYZ');
      const gps = new Location(
        parseFloat(entries[2]),
        parseFloat(entries[3]),
        parseFloat(entries[4]),
        ThreeMath.radToDeg(rotation.z)
      );
      return {
        timestamp,
        position,
        rotation,
        gps,
      };
    })
    .filter((e) => e != null && !isNaN(e.timestamp)) // filter null and NaN timestamp
    .sort((a, b) => a.timestamp - b.timestamp); // sort by timestamp

  let lastInsIndex = -1;
  filenames.forEach((f, i) => {
    for (let insIndex = lastInsIndex + 1; insIndex < insData.length; insIndex++) {
      if (insData[insIndex].timestamp > f) {
        lastInsIndex = insIndex;
        break;
      }
      if (insIndex === insData.length - 1) lastInsIndex = insIndex;
    }
    const interpolatedData = { ...insData[lastInsIndex] };
    interpolatedData.timestamp = interpolatedData.timestamp * 1e-6;
    interpolatedData.index = i;
    interpolatedData.image = {
      display: 'none',
      stereo_centre: f,
    };
    cameras.push(interpolatedData);
  });

  return { cameras };
}

// Fetch rectified jpg images (rather than bayer PNGs)
function getImgPath(imageFilename, filePath, variant = 'stereo_centre') {
  const loadedFilePath = store.getState().files.filePath;
  if (filePath == null) filePath = loadedFilePath;

  const oxfordRobotcarRoot = path.join(filePath, '../..');
  const imageDir = path.join(oxfordRobotcarRoot, ...variant.split('_'));
  if (imageFilename == null) return imageDir;
  return `${imageDir}/${imageFilename}.jpg`;
}

const config = {
  name: 'Oxford Robotcar',
  uid: 'oxfordRobotcar',
  triggerWord: 'oxford_robotcar',
  updateState: {
    sampling: {
      everyM: 12,
      everyDeg: 15,
    },
  },
};

export default { parseFn, getImgPath, config };
