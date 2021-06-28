<h1 align="center">OdoViz: React Client</h1>

<div align="center">
This repo contains the reactive web-based OdoViz rich client front-end operated alongside a thin server that serves the dataset files. It's loosely coupled design allows you to easily use it with your own server.
</div>

## Quick Start

The instructions given in the parent directory already includes as part of it building the client front-end app into [build](build) directory.

However, if you want to build and run the client separately

```
cd <to_this_dir>
yarn install
yarn run build
```

The app is fully functional offline after the initial page load, except for the features that inherently require internet e.g. maps. The build process creates static files that can be accessed by directly opening [build/index.html](build/index.html) in the browser. The app will still require dataset files to be served.

## Serving dataset files

The web-client expect the dataset files to be downloadable at `/files`, with an [autoindex JSON API](https://www.npmjs.com/package/autoindex-json) conforming to [NGINX JSON autoindex](http://nginx.org/en/docs/http/ngx_http_autoindex_module.html#autoindex_format) output standards for browsing the data directories at `/files?path=<path>`.

## Setting up with a Custom Server

1. Build the app
1. Make the dataset files [browsable and downloadable](#serving-dataset-files)
1. Static-serve [build](build) directory containing the app from your server.

## Setting up a Custom Parser

OdoViz supports customizing existing parsers and allows adding parsers for new datasets with ease. For more details, please refer to the [parsers](src/parsers) page.

<h1 align="center">Developer Instructions</h1>

## Dev Server

```sh
# keep the server running in another terminal / background
cd <to_this_dir>
yarn install
yarn start
```

This should start a [HMR](https://webpack.js.org/guides/hot-module-replacement/) dev server on http://localhost:3000. File requests will be proxied to the server running at http://localhost:3001, check [package.json](package.json) to edit this setting.

The changes made to the client code will now reflect on the dev server on-the-go.

If you would like the changes to be made public on this repo, please follow the instructions given in [CONTRIBUTING.md](/docs/CONTRIBUTING.md). Contributions are very welcome!

## Extensions

More information about extensions such as [Analyze Distances Extension](src/extensions/distances) and [Analyze Locations Extension](src/extensions/locations) are provided in the respective extension source code directories.
You can add new extensions to [src/extensions/extensions.js](src/extensions/extensions.js) copying the same structure of the existing extensions.
