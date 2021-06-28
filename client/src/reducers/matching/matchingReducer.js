const defaultState = {
  paths: [],
  matchedCars: {},
  matchOnlySampled: true,
};

const matchingActions = {
  addMatchingPath: 'ADD_MATCHING_PATH',
  removeMatchingPath: 'REMOVE_MATCHING_PATH',
  setMatchedCars: 'SET_MATCHED_CARS',
  setMatchOnlySampled: 'SET_MATCH_ONLY_SAMPLED',
};

function matchingReducer(state = defaultState, action) {
  switch (action.type) {
    case matchingActions.addMatchingPath:
      if (!state.paths.includes(action.payload.path)) return { ...state, paths: [...state.paths, action.payload.path] };
      else return state;
    case matchingActions.removeMatchingPath:
      return { ...state, paths: state.paths.filter((path) => path !== action.payload.path) };
    case matchingActions.setMatchedCars:
      return { ...state, matchedCars: action.payload.matchedCars };
    case matchingActions.setMatchOnlySampled:
      return { ...state, matchOnlySampled: action.payload.matchOnlySampled };
    default:
      return state;
  }
}

export { matchingReducer, matchingActions, defaultState };
