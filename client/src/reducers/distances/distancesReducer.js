const defaultState = {
  dataFile: null,
  dataJson: null,
  distancesFiles: [],
  distancesNpzs: [],
  currentDistancesIndex: 0,
  topKToDisplay: 5,
  skip0thMatch: true,
};

const distancesActions = {
  setDataJson: 'SET_DISTANCES_DATA_JSON',
  setDistancesNpzs: 'SET_DISTANCES_NPZS',
  setTopKToDisplay: 'SET_TOP_K_TO_DISPLAY',
  setSkip0thMatch: 'SET_SKIP_0TH_MATCH',
  setCurrentDistancesIndex: 'SET_CURRENT_DISTANCES_INDEX',
};

function distancesReducer(state = defaultState, action) {
  switch (action.type) {
    case distancesActions.setDataJson:
      return { ...state, dataJson: action.payload.dataJson, dataFile: action.payload.dataFile };
    case distancesActions.setDistancesNpzs:
      return { ...state, distancesNpzs: action.payload.distancesNpzs, distancesFiles: action.payload.distancesFiles };
    case distancesActions.setTopKToDisplay:
      return { ...state, topKToDisplay: action.payload.topKToDisplay };
    case distancesActions.setSkip0thMatch:
      return { ...state, skip0thMatch: action.payload.skip0thMatch };
    case distancesActions.setCurrentDistancesIndex:
      return { ...state, currentDistancesIndex: action.payload.currentDistancesIndex };
    default:
      return state;
  }
}

export { distancesReducer, distancesActions };
