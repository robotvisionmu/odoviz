const defaultState = {
  object: null,
  isPinned: false,
};

const selectedActions = {
  setSelectedObject: 'SET_SELECTED_OBJECT',
  setIsPinned: 'SET_SELECTED_IS_PINNED',
};

function selectedReducer(state = defaultState, action) {
  switch (action.type) {
    case selectedActions.setSelectedObject:
      return { ...state, object: action.payload.object };
    case selectedActions.setIsPinned:
      return { ...state, isPinned: action.payload.isPinned };
    default:
      return state;
  }
}

export { selectedReducer, selectedActions, defaultState };
