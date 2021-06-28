import { combineReducers } from 'redux';

import { offsetReducer } from './offset/offsetReducer';
import { sceneReducer } from './scene/sceneReducer';

const settingsReducer = combineReducers({
  scene: sceneReducer,
  offset: offsetReducer,
});

export { settingsReducer };
