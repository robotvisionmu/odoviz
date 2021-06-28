const defaultState = {
  car: null,
};

const assetsActions = {
  setCar: 'SET_ASSET_CAR',
};

function assetsReducer(state = defaultState, action) {
  switch (action.type) {
    case assetsActions.setCar:
      return { ...state, car: action.payload.car };
    default:
      return state;
  }
}

export { assetsReducer, assetsActions };
