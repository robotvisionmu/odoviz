import store from 'store';

import setControls from '../../../threedView/scripts/controls';
import { controlsActions } from './controlsReducer';

function setControlsType(type) {
  return { type: controlsActions.setControlType, payload: { type } };
}

function setControlsObject(object) {
  return { type: controlsActions.setControlObject, payload: { object } };
}

function refreshControls() {
  const { scene, renderer, camera } = store.getState().env;
  const { object: controls, type: controlsType } = store.getState().env.controls;
  return setControls({ scene, renderer, camera, controls }, controlsType);
}

export { setControlsType, setControlsObject, refreshControls };
