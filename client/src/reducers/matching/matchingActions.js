import { matchingActions } from './matchingReducer';

function addMatchingPath(path) {
  return { type: matchingActions.addMatchingPath, payload: { path } };
}

function removeMatchingPath(path) {
  return { type: matchingActions.removeMatchingPath, payload: { path } };
}

function setMatchedCars(matchedCars) {
  return { type: matchingActions.setMatchedCars, payload: { matchedCars } };
}

function setMatchOnlySampled(matchOnlySampled) {
  return { type: matchingActions.setMatchOnlySampled, payload: { matchOnlySampled } };
}

export { addMatchingPath, removeMatchingPath, setMatchedCars, setMatchOnlySampled };
