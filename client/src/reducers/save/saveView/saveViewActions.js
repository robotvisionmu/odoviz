import { toast } from 'react-toastify';

import store from 'store';

import { saveJsonInStash, isStashPresent, loadJsonFromStash } from '../../../utils/storageUtils';

const controlsTargetLookAtStashName = 'controlsTargetLookAt';
const cameraPositionStashName = 'cameraPosition';

function resetView() {
  const camera = store.getState().env.camera;
  const controls = store.getState().env.controls.object;
  camera.position.set(60, 50, 60);
  camera.lookAt(0, 0, 0);
  controls.update();
  const { position } = camera;
  const { target: lookAt } = controls;
  console.debug('Reset View Successful', { position, lookAt });
}

function saveView() {
  const camera = store.getState().env.camera;
  const controls = store.getState().env.controls.object;
  const { position } = camera;
  const { target: lookAt } = controls;
  saveJsonInStash(lookAt, controlsTargetLookAtStashName);
  saveJsonInStash(position, cameraPositionStashName);
}

function loadView() {
  const camera = store.getState().env.camera;
  const controls = store.getState().env.controls.object;
  if (isStashPresent(controlsTargetLookAtStashName) && isStashPresent(cameraPositionStashName)) {
    const lookAt = loadJsonFromStash(controlsTargetLookAtStashName);
    const position = loadJsonFromStash(cameraPositionStashName);
    camera.position.copy(position);
    controls.target.copy(lookAt);
    controls.update();
    toast.success('Last saved view loaded');
  }
}

function savedView() {
  if (isStashPresent(controlsTargetLookAtStashName) && isStashPresent(cameraPositionStashName)) return true;
  return false;
}

function loadedView() {
  const camera = store.getState().env.camera;
  const controls = store.getState().env.controls.object;
  if (isStashPresent(controlsTargetLookAtStashName) && isStashPresent(cameraPositionStashName)) {
    const lookAt = loadJsonFromStash(controlsTargetLookAtStashName, false);
    const position = loadJsonFromStash(cameraPositionStashName, false);
    const { position: currentPosition } = camera;
    const { target: currentLookAt } = controls;
    const diffPosition = [
      currentPosition.x - position.x,
      currentPosition.y - position.y,
      currentPosition.z - position.z,
    ];
    const diffRotation = [currentLookAt.x - lookAt.x, currentLookAt.y - lookAt.y, currentLookAt.z - lookAt.z];
    if (diffPosition.some((e) => Math.abs(e) > 0.05)) return false;
    if (diffRotation.some((e) => Math.abs(e) > 0.05)) return false;
    return true;
  }
  return false;
}

export { resetView, saveView, loadView, savedView, loadedView };
