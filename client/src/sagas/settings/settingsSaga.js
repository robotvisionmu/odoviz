import { takeLatest } from 'redux-saga/effects';

import { removeHighlightedPoints } from 'reducers/env/envActions';
import { refreshOffsets } from 'reducers/settings/offset/offsetActions';
import { offsetActions } from 'reducers/settings/offset/offsetReducer';
import {
  refreshScene,
  updateCameras,
  updateCarScale,
  updateDirectionalLight,
  updateGrid,
  updateHighlightPointSize,
  updatePointSize,
  updateShowPointClouds,
  updateTopView,
} from 'reducers/settings/scene/sceneActions';
import { sceneActions } from 'reducers/settings/scene/sceneReducer';

function* refreshOffsetsGen() {
  yield removeHighlightedPoints();
  yield refreshOffsets();
}

function* settingsSagaActions() {
  yield refreshScene();
  yield refreshOffsetsGen();
}

function* settingsWatcher() {
  yield takeLatest([...Object.values(offsetActions)], refreshOffsetsGen);
  yield takeLatest([sceneActions.applySceneSettings, sceneActions.resetSceneSettings], refreshScene);
  yield takeLatest([sceneActions.setCarScale], updateCarScale);
  yield takeLatest([sceneActions.setHighlightPointSize], updateHighlightPointSize);
  yield takeLatest([sceneActions.setPointSize], updatePointSize);
  yield takeLatest([sceneActions.setShowCameras], updateCameras);
  yield takeLatest([sceneActions.setShowPointCloud], updateShowPointClouds);
  yield takeLatest([sceneActions.setTopView], updateTopView);
  yield takeLatest([sceneActions.setGrid], updateGrid);
  yield takeLatest([sceneActions.setDirectionalLight], updateDirectionalLight);
}

export { settingsWatcher, settingsSagaActions };
