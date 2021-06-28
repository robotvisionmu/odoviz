import { toast } from 'react-toastify';
import { put, call } from 'redux-saga/effects';

import { parsers } from 'parsers';
import { removeAllCars, removeHighlightedPoints, removePointClouds, setCars, setPoints } from 'reducers/env/envActions';
import { resetFileData } from 'reducers/files/filesActions';
import { setParseFunction, setParserGetImage, setParserLoading } from 'reducers/parser/parserActions';
import { applySamplingSettings, resetSamplingSettings } from 'reducers/sampling/samplingActions';
import { applyOffsetSettings, resetOffsetSettings } from 'reducers/settings/offset/offsetActions';
import { applySceneSettings, resetSceneSettings } from 'reducers/settings/scene/sceneActions';
import store from 'store';

const getParser = (uid) => {
  const matchedParsers = parsers.filter((p) => p.config.uid === uid);
  if (matchedParsers.length === 0) return null;
  else return matchedParsers[0];
};

function* setParserComponents() {
  const parserType = store.getState().parser.type;
  const parser = getParser(parserType);
  yield put(setParseFunction(parser.parseFn));
  yield put(setParserGetImage(parser.getImgPath));
}

function* removeOldData() {
  yield removeAllCars();
  yield removePointClouds();
  yield removeHighlightedPoints();
}

const sleep = async (ms) => await new Promise((r) => setTimeout(r, ms));

function* parseAndSetData() {
  const currentStore = store.getState();
  const { data, filePath } = currentStore.files;
  const parserFunction = currentStore.parser.parse;
  yield put(setParserLoading(true));
  yield call(sleep, 300);
  const parserResult = yield call(parserFunction, data, filePath);
  yield call(sleep, 300);

  if (parserResult == null) {
    toast.error(`Could not parse file ${filePath}`);
    yield put(resetFileData());
    yield put(setParserLoading(false));
    return;
  }

  yield removeOldData();

  // updateState
  const parserUid = currentStore.parser.type;
  const parser = getParser(parserUid);
  yield put(resetSceneSettings());
  yield put(resetOffsetSettings());
  yield put(resetSamplingSettings());
  if (Object.prototype.hasOwnProperty.call(parser.config, 'updateState')) {
    const updateState = parser.config.updateState;
    if (Object.prototype.hasOwnProperty.call(updateState, 'settings')) {
      if (Object.prototype.hasOwnProperty.call(updateState.settings, 'offset'))
        yield put(applyOffsetSettings(updateState.settings.offset));
      if (Object.prototype.hasOwnProperty.call(updateState.settings, 'scene'))
        yield put(applySceneSettings(updateState.settings.offset));
    }
    if (Object.prototype.hasOwnProperty.call(updateState, 'sampling'))
      yield put(applySamplingSettings(updateState.sampling));
  }

  const { cameras: cars, points } = parserResult;
  yield put(setCars(cars));
  if (points) yield put(setPoints(points));
  yield put(setParserLoading(false));
}

function* parserSagaActions() {
  yield setParserComponents();
  yield parseAndSetData();
}

// disable watcher
// activate only when filepath changes
function* parserWatcher() {
  // yield takeLatest([parserActions.setParserType], parserSagaActions);
}

export { parserWatcher, parserSagaActions };
