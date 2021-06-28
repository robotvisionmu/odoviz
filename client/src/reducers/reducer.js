import { combineReducers } from 'redux';

import { assetsReducer } from './assets/assetsReducer';
import { distancesReducer } from './distances/distancesReducer';
import { envReducer } from './env/envReducer';
import { explorerReducer } from './explorer/explorerReducer';
import { filesReducer } from './files/filesReducer';
import { locationsReducer } from './locations/locationsReducer';
import { matchingReducer } from './matching/matchingReducer';
import { parserReducer } from './parser/parserReducer';
import { samplingReducer } from './sampling/samplingReducer';
import { settingsReducer } from './settings/settingsReducer';

export default combineReducers({
  files: filesReducer,
  sampling: samplingReducer,
  env: envReducer,
  settings: settingsReducer,
  explorer: explorerReducer,
  assets: assetsReducer,
  parser: parserReducer,
  matching: matchingReducer,
  distances: distancesReducer,
  locations: locationsReducer,
});
