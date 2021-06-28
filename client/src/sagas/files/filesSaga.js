import { call, put, takeLatest } from 'redux-saga/effects';

import { parsers } from 'parsers';
import { fetchFileData, setData, setLoading } from 'reducers/files/filesActions';
import { fileActions } from 'reducers/files/filesReducer';
import { setParserType } from 'reducers/parser/parserActions';
import { parserSagaActions } from 'sagas/parser/parserSaga';
import store from 'store';

const getMatchingParserUid = (dir) => {
  for (const parser of parsers) {
    const triggerWord = parser.config.triggerWord;
    const matched =
      (triggerWord instanceof RegExp && triggerWord.test(dir)) ||
      (typeof triggerWord === 'string' && dir.includes(triggerWord));

    if (matched) return parser.config.uid;
  }
};

function* filesSagaActions() {
  const currentStore = store.getState();
  const loadedFilePath = currentStore.files.filePath;
  const manualSelectedParser = currentStore.parser.manual;

  const data = yield call(fetchFileData, loadedFilePath);
  if (data == null) {
    yield put(setLoading(false));
    return;
  }
  yield put(setData(data));

  // if set to manual
  if (!manualSelectedParser) {
    const matchedParserUid = getMatchingParserUid(loadedFilePath);
    if (matchedParserUid == null) {
      console.error('no matching parsers found, please select a parser manually');
      return;
    } else yield put(setParserType(matchedParserUid));
  }

  yield parserSagaActions();
}

function* filesWatcher() {
  yield takeLatest([fileActions.setFile], filesSagaActions);
}

export { filesWatcher };
