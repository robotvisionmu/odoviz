<h1 align="center">OdoViz: A 3D Processing and Visualization Tool</h1>

<div align="center">

[![Node.js](https://img.shields.io/badge/-Node.js-gray?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/-React-gray?logo=react)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/-Three.js-gray?logo=three.js)](https://threejs.org/)
[![Licence](https://img.shields.io/badge/Licence-MIT-292)](LICENSE)
[![Website](https://img.shields.io/badge/Website-odoviz.cs.nuim.ie-blue)](https://odoviz.cs.nuim.ie/)

OdoViz is a reactive web-based tool for 3D visualization and processing of autonomous vehicle datasets designed to support common tasks in visual place recognition research. Comes with out of the box support for [popular driving datasets](client/src/parsers).
</div>

<br />

[![Screencast](https://user-images.githubusercontent.com/8567893/146551114-2f4b3e92-052c-45af-ae87-4407f0981a6b.gif)](https://www.youtube.com/playlist?list=PLKIavzsN4tuGi1SKDSPss0M8v4zswVEn9)

<br />

OdoViz has been published in 2021 IEEE International Intelligent Transportation Systems Conference ([ITSC 2021](https://2021.ieee-itsc.org/)) and is available on IEEE Xplore® [here](https://ieeexplore.ieee.org/document/9564712). If you use this software and/or its code, please cite using

```
@INPROCEEDINGS{9564712,
  author={Ramachandran, Saravanabalagi and McDonald, John},
  booktitle={2021 IEEE International Intelligent Transportation Systems Conference (ITSC)},
  title={OdoViz: A 3D Odometry Visualization and Processing Tool},
  year={2021},
  pages={1391-1398},
  doi={10.1109/ITSC48978.2021.9564712}}
```

The video presentation and tutorials have been made available on YouTube [here](https://www.youtube.com/playlist?list=PLKIavzsN4tuGi1SKDSPss0M8v4zswVEn9) to assist the user in getting to know the system better. OdoViz is open-sourced under the [MIT licence](LICENSE) for the benefit of the wider research community.

## Live Demo

You can access the hosted instance from the [official website](https://odoviz.cs.nuim.ie), which has been made available for demonstration purposes. You can host your own instance using the instructions given below.

## Quick Start

1. Clone the repo

   ```sh
   git clone https://github.com/robotvisionmu/odoviz.git
   cd odoviz
   ```

1. Setup and start the server in one of the following methods:

   <details>
     <summary>Docker</summary>

   ```sh
   # Build container
   docker build -t odoviz:latest .

   # Set ODOVIZ_DATA_DIR and execute container
   export ODOVIZ_PORT=3001 ODOVIZ_DATA_DIR=<datasets_dir>
   docker run --rm -d -v $ODOVIZ_DATA_DIR:/data -p $ODOVIZ_PORT:3001 odoviz:latest
   ```

   </details>

   <details>
     <summary>NPM or Yarn</summary>

   ```sh
   # Install dependencies and build client app
   cd client
   yarn install
   NODE_ENV=production yarn run build

   # Install dependencies for server
   cd ..
   yarn install

   # Set ODOVIZ_DATA_DIR and start server
   export ODOVIZ_PORT=3001 ODOVIZ_DATA_DIR=<datasets_dir>
   yarn start
   ```

   </details>

   Note that the `datasets_dir` is the parent directory containing various datasets.

1. Access the front-end

   Once the server is started (using Docker or yarn), you can open http://localhost:3001 and use it. For more details about the client, please refer to the [client README.md](client/README.md)

For general questions and queries, open a new thread in [discussions](https://github.com/robotvisionmu/odoviz/discussions). If the software does not work as intended, please check the existing [issues](https://github.com/robotvisionmu/odoviz/issues) before raising a new issue. [Pull requests](https://github.com/robotvisionmu/odoviz/pulls) are welcome.

## Similar Tools

Odoviz is very useful for visualizing whole trajectories and global level tasks such as visualizing loop closures, identifying and analyzing pose correspondences, etc. If you are rather interested in primarily processing and visualisation at the local level of the vehicle, i.e. targeting egocentric tasks such as real-time visualisation and playback of vehicle sensor data, 3D object detection, etc., please take a look at:

- Autonomous Visualization System by Uber: https://avs.auto
- Webviz by Cruise: https://webviz.io
- Open3D: https://open3d.org
     
## Acknowledgements

This work was supported by [Science Foundation Ireland](https://www.sfi.ie/) grant 13/RC/2094 to [Lero - the Irish Software Research Centre](https://lero.ie/) and grant 16/RI/3399 and [Maynooth University](https://www.maynoothuniversity.ie/). The website and the live instance is hosted by Department of Computer Science, Maynooth University.
