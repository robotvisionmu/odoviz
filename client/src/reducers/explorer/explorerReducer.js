const defaultState = {
  path: '.',
};

const explorerActions = {
  setPath: 'SET_EXPLORER_PATH',
  resetPath: 'RESET_EXPLORER_PATH',
};

function explorerReducer(state = defaultState, action) {
  switch (action.type) {
    case explorerActions.setPath:
      return { ...state, path: action.payload.path };
    case explorerActions.resetFile:
      return defaultState;
    default:
      return state;
  }
}

export { explorerReducer, explorerActions };
