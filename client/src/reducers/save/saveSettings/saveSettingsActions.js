import { toast } from 'react-toastify';

import store from 'store';

import { isStashPresent, loadJsonFromStash, saveJsonInStash } from '../../../utils/storageUtils';
import { applyOffsetSettings, compareOffsetSettings, resetOffsetSettings } from '../../settings/offset/offsetActions';
import { applySceneSettings, compareSceneSettings, resetSceneSettings } from '../../settings/scene/sceneActions';

const settingsStashName = 'settings';

function saveSettings() {
  saveJsonInStash(store.getState().settings, settingsStashName);
}

function loadSettings() {
  if (isStashPresent(settingsStashName)) {
    const settings = loadJsonFromStash(settingsStashName);
    const { scene, offset } = settings;
    store.dispatch(applyOffsetSettings(offset));
    store.dispatch(applySceneSettings(scene));
    toast.success('Last saved settings loaded');
  }
}

function resetSettings() {
  store.dispatch(resetOffsetSettings());
  store.dispatch(resetSceneSettings());
}

function savedSettings() {
  if (isStashPresent(settingsStashName)) return true;
  return false;
}

function loadedSettings() {
  if (isStashPresent(settingsStashName)) {
    const settings = loadJsonFromStash(settingsStashName, false);
    if (!compareOffsetSettings(settings.offset)) return false;
    if (!compareSceneSettings(settings.scene)) return false;
    return true;
  }
  return false;
}

export { saveSettings, loadSettings, resetSettings, savedSettings, loadedSettings };
