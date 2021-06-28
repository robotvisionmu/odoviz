import { toast } from 'react-toastify';

import store from 'store';

import { isStashPresent, loadJsonFromStash, saveJsonInStash } from '../../../utils/storageUtils';
import { applySamplingSettings, compareSamplingSettings, resetSamplingSettings } from '../../sampling/samplingActions';

const samplingStashName = 'sampling';

function saveSampling() {
  saveJsonInStash(store.getState().sampling, samplingStashName);
}

function loadSampling() {
  if (isStashPresent(samplingStashName)) {
    const sampling = loadJsonFromStash(samplingStashName);
    store.dispatch(applySamplingSettings(sampling));
    toast.success('Last saved sampling loaded');
  }
}

function resetSampling() {
  store.dispatch(resetSamplingSettings());
}

function savedSampling() {
  if (isStashPresent(samplingStashName)) return true;
  return false;
}

function loadedSampling() {
  if (isStashPresent(samplingStashName)) {
    const sampling = loadJsonFromStash(samplingStashName, false);
    return compareSamplingSettings(sampling);
  }
  return false;
}

export { saveSampling, loadSampling, resetSampling, savedSampling, loadedSampling };
