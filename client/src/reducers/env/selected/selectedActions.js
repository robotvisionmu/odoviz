import store from 'store';

import { selectedActions } from './selectedReducer';

function togglePinned() {
  return (dispatch) => dispatch(setIsPinned(!store.getState().env.selected.isPinned));
}

function setIsPinned(isPinned) {
  return { type: selectedActions.setIsPinned, payload: { isPinned } };
}

function setSelectedObject(object) {
  return { type: selectedActions.setSelectedObject, payload: { object } };
}

export { setIsPinned, setSelectedObject, togglePinned };
