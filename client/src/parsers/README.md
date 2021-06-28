# Parsers

Dataset parsers are placed within this directory. The tool ships with parsers for

1. Oxford Robotcar
1. BDD100K
1. KITTI Odometry
1. New College
1. CMU Seasons
1. QU St Lucia

Parsers are fully customizable and you shall add a new parser for a new dataset or your own dataset by simply exporting the following:

1. parseFn(logFileData, logFilePath)
1. getImgPath(imgFilename, logFilePath, imgVariant)
1. config variable

and finally import your parser in [index.js](index.js). If you are running a [dev server](/client/README.md#dev-server) to serve the client files, the changes will be made as soon as you make changes and save the files. To finalize these changes to be served directly from the [server](/server.js) (i.e. without a dev server), build the client app using `yarn run build`.

## Parse Function

`parseFn` should return a set of

```js
{
  cameras: Array<pose_obj>,
  points: Array<point_obj>    // optional
}
```

Each pose object shall contain any information, but the following structure is recommended:

`pose` object

```js
{
  timestamp,    // in seconds
  position,     // THREE.Vector3
  rotation,     // THREE.Euler
  gps,          // Location class provided in utils/common
  image: {
    front_cam,        // string: e.g. 00001.jpg
    rear_cam,         // string: e.g. 00010.jpg
  },
  index        // int: pose index
}

```

`point` object

```js
{
  position,     // THREE.Vector3
  color: {
    r,          // int
    g,
    b
  },
  index         // int: index of the point
}
```

## Get Img Path

`getImgPath` should return a path to the img, given `img` from `pose` object

```js
getImgPath('0001', 'oxford_robotcar/2014-12-09-13-21-02/gps/ins.csv', 'stereo_center');

// expected output
('oxford_robotcar/2014-12-09-13-21-02/stereo/center/0001.jpg');
```

## Config variable

An example config variable is given below with all keys for updateState:

```js
const config = {
  name: 'Oxford Robotcar',         // Name displayed in the UI
  uid: 'oxfordRobotcar',           // unique ID used internally
  triggerWord: 'oxford_robotcar',  // used for parser auto select, searched within filePath, can be string or regex
  updateState: {                   // optional: settings to load after poses are loaded
    settings: {
      {
        scene: {
          animationDuration: 1000,
          carScale: 1,
          pointSize: 1.2,
          highlightPointSize: 2,
          showCameras: false,
          showPointCloud: true,
          animate: false,
          topView: false,
          grid: true,
          directionalLight: false
        },
        offset: {
          positionScale: 1,
          timeOnZAxis: 0,
          offsetRotationX: 0,
          offsetRotationY: -90,
          offsetRotationZ: 0,
          invertRotationX: false,
          invertRotationY: true,
          invertRotationZ: false,
          invertPositionX: false,
          invertPositionY: true,
          invertPositionZ: false,
          swapPositionXY: false,
          swapPositionYZ: true,
          swapPositionXZ: false,
          swapRotationXY: false,
          swapRotationYZ: true,
          swapRotationXZ: false,
          showAltitude: false
        }
    },
    sampling: {
      everyM: 12,
      everyDeg: 15,
      unitToM: 1
    }
  }
}
```
