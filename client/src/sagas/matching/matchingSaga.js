import { put, takeLatest } from 'redux-saga/effects';

import { setMatchedCars } from 'reducers/matching/matchingActions';
import { defaultState, matchingActions } from 'reducers/matching/matchingReducer';

function* removeMatchingInfo() {
  yield put(setMatchedCars(defaultState.matchedCars));
}

function* matchingWatcher() {
  yield takeLatest(
    [matchingActions.setMatchOnlySampled, matchingActions.addMatchingPath, matchingActions.removeMatchingPath],
    removeMatchingInfo
  );
}

export { matchingWatcher };
