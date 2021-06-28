const possibleValues = {
  timeOnZAxis: [0, 100, 0.01],
  positionScale: [0.1, 30000.0, 0.01],
  offsetRotationX: [-180, 180, 0.01],
  offsetRotationY: [-180, 180, 0.01],
  offsetRotationZ: [-180, 180, 0.01],
};

const defaultState = {
  positionScale: 1,
  timeOnZAxis: 0,

  offsetRotationX: 0,
  offsetRotationY: -90,
  offsetRotationZ: 0,

  invertRotationX: false,
  invertRotationY: true,
  invertRotationZ: false,

  invertPositionX: false,
  invertPositionY: true,
  invertPositionZ: false,

  swapPositionXY: false,
  swapPositionYZ: true,
  swapPositionXZ: false,

  swapRotationXY: false,
  swapRotationYZ: true,
  swapRotationXZ: false,

  // show altitude doesn't fit in scene reducer
  // scene actions do not recompute the position of cars
  // by adding it inside offset actions
  // we get the ability to specify when altitude=0 should happen
  // hence can be applied even before swapping axes for example
  showAltitude: false,
};

const offsetActions = {
  setPositionScale: 'SET_POSITION_SCALE',
  setTimeOnZAxis: 'SET_TIME_ON_Z_AXIS',

  setOffsetRotationX: 'SET_OFFSET_ROTATION_X',
  setOffsetRotationY: 'SET_OFFSET_ROTATION_Y',
  setOffsetRotationZ: 'SET_OFFSET_ROTATION_Z',

  setInvertRotationX: 'SET_INVERT_ROTATION_X',
  setInvertRotationY: 'SET_INVERT_ROTATION_Y',
  setInvertRotationZ: 'SET_INVERT_ROTATION_Z',

  setInvertPositionX: 'SET_INVERT_POSITION_X',
  setInvertPositionY: 'SET_INVERT_POSITION_Y',
  setInvertPositionZ: 'SET_INVERT_POSITION_Z',

  setSwapPositionXY: 'SET_SWAP_POSITION_XY',
  setSwapPositionYZ: 'SET_SWAP_POSITION_YZ',
  setSwapPositionXZ: 'SET_SWAP_POSITION_XZ',

  setSwapRotationXY: 'SET_SWAP_ROTATION_XY',
  setSwapRotationYZ: 'SET_SWAP_ROTATION_YZ',
  setSwapRotationXZ: 'SET_SWAP_ROTATION_XZ',

  setShowAltitude: 'SET_SHOW_ALTITUDE',

  applyOffsetSettings: 'APPLY_OFFSET_SETTINGS',
  resetOffsetSettings: 'RESET_OFFSET_SETTINGS',
};

function offsetReducer(state = defaultState, action) {
  switch (action.type) {
    case offsetActions.setPositionScale:
      return { ...state, positionScale: action.payload.positionScale };
    case offsetActions.setTimeOnZAxis:
      return { ...state, timeOnZAxis: action.payload.timeOnZAxis };

    case offsetActions.setOffsetRotationX:
      return { ...state, offsetRotationX: action.payload.offsetRotationX };
    case offsetActions.setOffsetRotationY:
      return { ...state, offsetRotationY: action.payload.offsetRotationY };
    case offsetActions.setOffsetRotationZ:
      return { ...state, offsetRotationZ: action.payload.offsetRotationZ };

    case offsetActions.setInvertRotationX:
      return { ...state, invertRotationX: action.payload.invertRotationX };
    case offsetActions.setInvertRotationY:
      return { ...state, invertRotationY: action.payload.invertRotationY };
    case offsetActions.setInvertRotationZ:
      return { ...state, invertRotationZ: action.payload.invertRotationZ };

    case offsetActions.setInvertPositionX:
      return { ...state, invertPositionX: action.payload.invertPositionX };
    case offsetActions.setInvertPositionY:
      return { ...state, invertPositionY: action.payload.invertPositionY };
    case offsetActions.setInvertPositionZ:
      return { ...state, invertPositionZ: action.payload.invertPositionZ };

    case offsetActions.setSwapPositionXY:
      return { ...state, swapPositionXY: action.payload.swapPositionXY };
    case offsetActions.setSwapPositionYZ:
      return { ...state, swapPositionYZ: action.payload.swapPositionYZ };
    case offsetActions.setSwapPositionXZ:
      return { ...state, swapPositionXZ: action.payload.swapPositionXZ };

    case offsetActions.setSwapRotationXY:
      return { ...state, swapRotationXY: action.payload.swapRotationXY };
    case offsetActions.setSwapRotationYZ:
      return { ...state, swapRotationYZ: action.payload.swapRotationYZ };
    case offsetActions.setSwapRotationXZ:
      return { ...state, swapRotationXZ: action.payload.swapRotationXZ };

    case offsetActions.setShowAltitude:
      return { ...state, showAltitude: action.payload.showAltitude };

    case offsetActions.applyOffsetSettings:
      return { ...state, ...action.payload };
    case offsetActions.resetOffsetSettings:
      return { ...defaultState };

    default:
      break;
  }
  return state;
}

export { offsetReducer, possibleValues, defaultState, offsetActions };
