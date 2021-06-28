import { assetsActions } from './assetsReducer';

function setCar(car) {
  return { type: assetsActions.setCar, payload: { car } };
}

export { setCar };
