const defaultState = {
  loading: false,
  filePath: null,
  data: null,
};

const fileActions = {
  setLoading: 'SET_LOADING_FILE',
  setFile: 'SET_FILE',
  setData: 'SET_DATA',
  resetFile: 'RESET_FILE_DATA',
};

function filesReducer(state = defaultState, action) {
  switch (action.type) {
    case fileActions.setFile:
      return { ...state, filePath: action.payload.filePath, loading: true };
    case fileActions.setData:
      return { ...state, data: action.payload.data, loading: false };
    case fileActions.resetFile:
      return { ...defaultState };
    default:
      return state;
  }
}

export { filesReducer, fileActions };
