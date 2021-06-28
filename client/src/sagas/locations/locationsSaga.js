import { takeLatest } from 'redux-saga/effects';

import { removeLocationInfo } from 'reducers/locations/locationsActions';
import { locationsActions } from 'reducers/locations/locationsReducer';

import { updateCarColor } from '../../reducers/settings/scene/sceneActions';

function* locationsWatcher() {
  yield takeLatest([locationsActions.setLocationsData, locationsActions.setLoopsData], removeLocationInfo);
  yield takeLatest([locationsActions.setColorApplied], updateCarColor);
}

export { locationsWatcher };
