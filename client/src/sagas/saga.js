import { all } from 'redux-saga/effects';

import { envWatcher } from './env/envSaga';
import { filesWatcher } from './files/filesSaga';
import { locationsWatcher } from './locations/locationsSaga';
import { matchingWatcher } from './matching/matchingSaga';
import { parserWatcher } from './parser/parserSaga';
import { samplingSettingsWatcher } from './sampling/samplingSaga';
import { settingsWatcher } from './settings/settingsSaga';

export default function* rootSaga() {
  yield all([
    settingsWatcher(),
    samplingSettingsWatcher(),
    envWatcher(),
    filesWatcher(),
    parserWatcher(),
    locationsWatcher(),
    matchingWatcher(),
  ]);
}
