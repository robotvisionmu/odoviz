import { toast } from 'react-toastify';

import { setFilePath } from 'reducers/files/filesActions';
import store from 'store';
import { isStashPresent, loadJsonFromStash, saveJsonInStash } from 'utils/storageUtils';

const filesStashName = 'files';

function saveFile() {
  saveJsonInStash(store.getState().files.filePath, filesStashName);
}

function loadFile() {
  if (isStashPresent(filesStashName)) {
    const filePath = loadJsonFromStash(filesStashName);
    if (filePath == null) return;
    store.dispatch(setFilePath(filePath));
    toast.success(`Loading last saved file ${filePath}`);
  }
}

function resetFile() {
  window.localStorage.removeItem(filesStashName);
}

function savedFile() {
  return isStashPresent(filesStashName);
}

function loadedFile() {
  if (isStashPresent(filesStashName)) {
    const filePath = loadJsonFromStash(filesStashName, false);
    if (filePath == null) return false;
    const currentStore = store.getState();
    if (filePath === currentStore.files.filePath) return true;
  }
  return false;
}

export { saveFile, loadFile, resetFile, savedFile, loadedFile };
