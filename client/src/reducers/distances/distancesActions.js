import { distancesActions } from './distancesReducer';

function setDataJson(dataJson, dataFile) {
  return { type: distancesActions.setDataJson, payload: { dataJson, dataFile } };
}

function setDistancesNpzs(distancesNpzs, distancesFiles) {
  return { type: distancesActions.setDistancesNpzs, payload: { distancesNpzs, distancesFiles } };
}

function setSkip0thMatch(skip0thMatch) {
  return { type: distancesActions.setSkip0thMatch, payload: { skip0thMatch } };
}

function setTopKToDisplay(topKToDisplay) {
  return { type: distancesActions.setTopKToDisplay, payload: { topKToDisplay } };
}

function setCurrentDistancesIndex(currentDistancesIndex) {
  return { type: distancesActions.setCurrentDistancesIndex, payload: { currentDistancesIndex } };
}

export { setDataJson, setDistancesNpzs, setSkip0thMatch, setTopKToDisplay, setCurrentDistancesIndex };
