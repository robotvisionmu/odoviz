import { explorerActions } from './explorerReducer';

function setExplorerPath(path) {
  return { type: explorerActions.setPath, payload: { path } };
}

function resetExplorerPath() {
  return { type: explorerActions.resetPath };
}

export { setExplorerPath, resetExplorerPath };
