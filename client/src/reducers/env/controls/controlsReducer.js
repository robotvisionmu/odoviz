const possibleValues = {
  controls: ['map', 'orbit'],
  object: null,
};

const defaultState = {
  type: possibleValues.controls[1],
  object: null,
};

const controlsActions = {
  setControlType: 'SET_CONTROL_TYPE',
  setControlObject: 'SET_CONTROL_OBJECT',
};

function controlsReducer(state = defaultState, action) {
  switch (action.type) {
    case controlsActions.setControlType:
      return { ...state, type: action.payload.type };
    case controlsActions.setControlObject:
      return { ...state, object: action.payload.object };
    default:
      return state;
  }
}

export { controlsReducer, controlsActions, defaultState, possibleValues };
