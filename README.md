<h1 align="center">OdoViz: A 3D Processing and Visualization Tool</h1>

<div align="center">
OdoViz is a reactive web-based tool for 3D visualization and processing of autonomous vehicle datasets designed to support common tasks in visual place recognition research.
</div>

## Live Demo

You can access the hosted demo [here](https://odoviz.cs.nuim.ie).

## Quick Start

### 1. Clone the repo

```sh
git clone https://github.com/robotvisionmu/odoviz.git
cd odoviz
```

You can then setup and start the server in one of the following methods:

- using docker
- using npm/yarn.

### 2a. Docker

```sh
# Build container
docker build -t odoviz:latest .

# Set DATA_DIR and execute container
export PORT=3001 DATA_DIR=<datasets_dir>
docker run --rm -d -v $DATA_DIR:/data -p $PORT:3001 odoviz:latest
```

### 2b. Without Docker

```sh
# Install dependencies and build client app
cd client
yarn install
NODE_ENV=production yarn run build

# Install dependencies for server
cd ..
yarn install

# Set DATA_DIR and start server
export PORT=3001 DATA_DIR=<datasets_dir>
yarn start
```

### 3. Accessing the front-end

Once the server is started (using Docker or yarn), you can open http://localhost:3001 and use it. Video tutorials have been made available on [YouTube](https://www.youtube.com/playlist?list=PLKIavzsN4tuGi1SKDSPss0M8v4zswVEn9) to assist the user in getting to know the system better. For more details about the client, please refer to the [client README.md](client/README.md)
