import { toast } from 'react-toastify';

import store from 'store';

import { fileActions } from './filesReducer';

let toastId;

function setFilePath(filePath) {
  toastId = toast.info(`Downloading file ${filePath}`, { hideProgressBar: false });
  return { type: fileActions.setFile, payload: { filePath } };
}

function resetFileData() {
  if (toastId != null) toast.dismiss(toastId);
  return { type: fileActions.resetFile };
}

function setLoading(loading) {
  const filePath = store.getState().files.filePath;
  if (loading === true) toastId = toast.info(`Downloading file ${filePath}`, { hideProgressBar: false });
  else if (toastId != null) {
    toast.dismiss(toastId);
  }
  return { type: fileActions.setLoading, payload: { loading } };
}

function setData(data) {
  if (toastId != null) toast.dismiss(toastId);
  return { type: fileActions.setData, payload: { data } };
}

async function fetchFileData(filePath) {
  try {
    const fileContents = await fetch(`/files/${filePath}`);
    return await fileContents.text();
  } catch (e) {
    console.error(e);
  }
}

export { setFilePath, resetFileData, fetchFileData, setLoading, setData };
