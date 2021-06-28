const defaultState = {
  everyM: 0,
  unitToM: 1,
  everyDeg: 0,
};

const possibleValues = {
  everyM: [0, 100, 0.01],
  everyDeg: [0, 360, 0.01],
};

const samplingActions = {
  changeEveryM: 'CHANGE_EVERY_M',
  setUnitToM: 'SET_UNIT_TO_M',
  changeEveryDeg: 'CHANGE_EVERY_DEG',
  resetSampling: 'RESET_SAMPLING',
  applySamplingSettings: 'APPLY_SAMPLING_SETTINGS',
};

function samplingReducer(state = defaultState, action) {
  switch (action.type) {
    case samplingActions.changeEveryM:
      return { ...state, everyM: action.payload.everyM };
    case samplingActions.changeEveryDeg:
      return { ...state, everyDeg: action.payload.everyDeg };
    case samplingActions.setUnitToM:
      return { ...state, unitToM: action.payload.unitToM };
    case samplingActions.applySamplingSettings:
      return { ...state, ...action.payload };
    case samplingActions.resetSampling:
      return { ...defaultState };
    default:
      return state;
  }
}

export { samplingReducer, samplingActions, possibleValues, defaultState };
