const express = require('express');
const pino = require('express-pino-logger')();
const autoindexJson = require('autoindex-json');

// initiate express server
const app = express();
app.use(pino);

// constants
const PORT = process.env.ODOVIZ_PORT || 3000;
const DATA_DIR = process.env.ODOVIZ_DATA_DIR;

if (DATA_DIR == null) {
  console.error('Please specify ODOVIZ_DATA_DIR environment variable before initializing OdoViz');
  process.exit();
}

// autoindex json api at /files for DATA_DIR
app.use('/files', express.static(DATA_DIR), autoindexJson(DATA_DIR, { onErrorStatus4xx: false }));

// serve software at /
// make sure you build the client beforehand
app.use('/', express.static('client/build'));

// start server
app.listen(PORT, () => console.log(`Express server is running on http://localhost:${PORT}`));
