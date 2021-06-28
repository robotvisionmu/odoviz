import * as path from 'path';

import { Euler, Vector3, Matrix4 } from 'three';

import store from '../store';
// import Location from "../utils/common/Location";

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
  console.debug('Total timestamps', dataLines.length);

  const seqNo = path.basename(filePath, path.extname(filePath));
  const timesFile = await fetch(`/files/${path.join(filePath, '../../sequences/', seqNo, 'times.txt')}`);
  const timesData = await timesFile.text();
  const timeDataLines = timesData.split(/\r\n|\n/);

  for (let i = 0; i < dataLines.length; i++) {
    const dataLine = dataLines[i];
    if (dataLine.length === 0) continue;
    const entries = dataLine.split(' ').map((e) => parseFloat(e));

    const m = new Matrix4();
    m.set(...entries, ...[0, 0, 0, 0]);

    const timestamp = parseFloat(timeDataLines[i]);
    const rotation = new Euler().setFromRotationMatrix(m);
    let position = new Vector3().setFromMatrixPosition(m);
    position = new Vector3(position.x, position.z, position.y);
    // const gps = new Location(parseFloat(entries[2]), parseFloat(entries[3]), parseFloat(entries[4]), ThreeMath.radToDeg(rotation.z))

    cameras.push({
      timestamp,
      position,
      rotation,
      index: i,
      // gps,
      image: {
        display: 'none',
        cam_2: i.toString().padStart(6, '0'),
        cam_3: i.toString().padStart(6, '0'),
      },
    });
  }

  return { cameras };
}

function getImgPath(imageFilename, filePath, variant = 'cam_2') {
  const loadedFilePath = store.getState().files.filePath;
  if (filePath == null) filePath = loadedFilePath;

  const seqNo = path.basename(filePath, path.extname(filePath));
  const kittiRoot = path.join(filePath, '../..');
  const imageDir = path.join(kittiRoot, 'sequences', seqNo, variant.replace('cam', 'image'));
  if (imageFilename == null) return imageDir;
  return `${imageDir}/${imageFilename}.png`;
}

const config = {
  name: 'Kitti Odometry',
  uid: 'kitti',
  triggerWord: 'kitti',
  updateState: {
    settings: {
      offset: {
        swapRotationXY: false,
        swapRotationXZ: false,
        swapRotationYZ: false,
        offsetRotationX: 0,
        offsetRotationY: -180,
        offsetRotationZ: 0,
        invertRotationX: false,
        invertRotationY: false,
        invertRotationZ: false,
      },
    },
    sampling: {
      everyM: 10,
      everyDeg: Infinity,
    },
  },
};

export default { parseFn, getImgPath, config };
