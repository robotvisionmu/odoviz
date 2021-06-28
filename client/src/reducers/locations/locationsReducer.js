const defaultState = {
  locationsTxtFile: null,
  loopsTxtFile: null,
  imageIndexToLocation: null,
  loops: null,
  locationsApplied: false,
  colorApplied: false,
};

const locationsActions = {
  setLocationsData: 'SET_LOCATIONS_DATA',
  setLoopsData: 'SET_LOOPS_DATA',
  setLocationsApplied: 'SET_LOCATIONS_APPLIED',
  setColorApplied: 'SET_COLOR_APPLIED',
};

function locationsReducer(state = defaultState, action) {
  switch (action.type) {
    case locationsActions.setLocationsData:
      return {
        ...state,
        locationsTxtFile: action.payload.locationsTxtFile,
        imageIndexToLocation: action.payload.imageIndexToLocation,
      };
    case locationsActions.setLoopsData:
      return { ...state, loopsTxtFile: action.payload.loopsTxtFile, loops: action.payload.loops };
    case locationsActions.setLocationsApplied:
      return { ...state, locationsApplied: action.payload.locationsApplied };
    case locationsActions.setColorApplied:
      return { ...state, colorApplied: action.payload.colorApplied };
    default:
      return state;
  }
}

export { locationsReducer, locationsActions };
