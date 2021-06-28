const possibleValues = {
  carScale: [0.1, 5.0, 0.01],
  pointSize: [1.0, 5.0, 0.01],
  highlightPointSize: [1.0, 5.0, 0.01],
  animationDuration: [100, 10000, 100],
};

const defaultState = {
  animationDuration: 1000,
  carScale: 1.0,
  pointSize: 1.2,
  highlightPointSize: 2.0,
  showCameras: false,
  showPointCloud: true,
  animate: false,
  topView: false,
  grid: true,
  directionalLight: false,
};

const sceneActions = {
  setCarScale: 'SET_CAR_SCALE',
  setPointSize: 'SET_POINT_SIZE',
  setHighlightPointSize: 'SET_HIGHLIGHT_POINT_SIZE',
  setShowPointCloud: 'SET_SHOW_POINT_CLOUD',
  setShowCameras: 'SET_SHOW_CAMERAS',
  applySceneSettings: 'APPLY_SCENE_SETTINGS',
  resetSceneSettings: 'RESET_SCENE_SETTINGS',
  setSceneAnimate: 'SET_SCENE_ANIMATE',
  setAnimationDuration: 'SET_ANIMATION_DURATION',
  setTopView: 'SET_TOP_VIEW',
  setGrid: 'SET_GRID',
  setDirectionalLight: 'SET_DIRECTIONAL_LIGHT',
};

function sceneReducer(state = defaultState, action) {
  switch (action.type) {
    case sceneActions.setAnimationDuration:
      return { ...state, animationDuration: action.payload.animationDuration };
    case sceneActions.setCarScale:
      return { ...state, carScale: action.payload.carScale };
    case sceneActions.setPointSize:
      return { ...state, pointSize: action.payload.pointSize };
    case sceneActions.setSceneAnimate:
      return { ...state, animate: action.payload.animate };
    case sceneActions.setHighlightPointSize:
      return { ...state, highlightPointSize: action.payload.highlightPointSize };
    case sceneActions.setShowPointCloud:
      return { ...state, showPointCloud: action.payload.showPointCloud };
    case sceneActions.setShowCameras:
      return { ...state, showCameras: action.payload.showCameras };
    case sceneActions.setTopView:
      return { ...state, topView: action.payload.topView };
    case sceneActions.setGrid:
      return { ...state, grid: action.payload.grid };
    case sceneActions.setDirectionalLight:
      return { ...state, directionalLight: action.payload.directionalLight };
    case sceneActions.applySceneSettings:
      return { ...state, ...action.payload };
    case sceneActions.resetSceneSettings:
      return { ...defaultState };
    default:
      break;
  }
  return state;
}

export { sceneReducer, defaultState, possibleValues, sceneActions };
