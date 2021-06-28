import { put, takeLatest } from 'redux-saga/effects';

import { assetsActions } from 'reducers/assets/assetsReducer';
import { refreshControls, setControlsObject } from 'reducers/env/controls/controlsActions';
import { controlsActions } from 'reducers/env/controls/controlsReducer';
import { addCars, addPointCloud } from 'reducers/env/envActions';
import { envActions } from 'reducers/env/envReducer';
import { samplingSagaActions } from 'sagas/sampling/samplingSaga';
import store from 'store';

function* refreshControlsGen() {
  const controls = yield refreshControls();
  yield put(setControlsObject(controls));
}

function* envSagaActions() {
  const { scene } = store.getState().env;
  if (scene == null) return;
  yield addCars();
  yield addPointCloud();
  yield samplingSagaActions();
}

function* envWatcher() {
  yield takeLatest([controlsActions.setControlType], refreshControlsGen);
  yield takeLatest([envActions.setCars, envActions.setPoints, assetsActions.setCar], envSagaActions);
}

export { envWatcher };
