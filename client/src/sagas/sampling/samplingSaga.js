import { takeLatest } from 'redux-saga/effects';

import { refreshSampling } from 'reducers/sampling/samplingActions';
import { samplingActions } from 'reducers/sampling/samplingReducer';
import { settingsSagaActions } from 'sagas/settings/settingsSaga';

function* samplingSagaActions() {
  yield refreshSampling();
  yield settingsSagaActions();
}

function* samplingSettingsWatcher() {
  yield takeLatest([...Object.values(samplingActions)], samplingSagaActions);
}

export { samplingSettingsWatcher, samplingSagaActions };
