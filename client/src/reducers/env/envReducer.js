import { controlsActions, controlsReducer, defaultState as controlsDefaultState } from './controls/controlsReducer';
import { defaultState as selectedDefaultState, selectedActions, selectedReducer } from './selected/selectedReducer';

const defaultState = {
  scene: null,
  camera: null,
  renderer: null,
  selected: selectedDefaultState,
  controls: controlsDefaultState,
  cars: [],
  points: [],
};

const envActions = {
  setScene: 'SET_SCENE',
  setCamera: 'SET_CAMERA',
  setCars: 'SET_CARS',
  setPoints: 'SET_POINTS',
  setRenderer: 'SET_RENDERER',
  setSelected: 'SET_SELECTED',
  setControls: 'SET_CONTROLS',
};

function envReducer(state = defaultState, action) {
  switch (action.type) {
    case envActions.setCamera:
      return { ...state, camera: action.payload.camera };
    case envActions.setScene:
      return { ...state, scene: action.payload.scene };
    case envActions.setCars:
      return { ...state, cars: action.payload.cars };
    case envActions.setPoints:
      return { ...state, points: action.payload.points };
    case envActions.setRenderer:
      return { ...state, renderer: action.payload.renderer };
    default:
      break;
  }

  if (Object.values(controlsActions).includes(action.type))
    return {
      ...state,
      controls: controlsReducer(state.controls, action),
    };
  else if (Object.values(selectedActions).includes(action.type))
    return {
      ...state,
      selected: selectedReducer(state.selected, action),
    };

  return state;
}

export { envReducer, envActions };
