import { toast } from 'react-toastify';

import store from 'store';

import { parserActions } from './parserReducer';

function setParserType(type) {
  return { type: parserActions.setParserType, payload: { type } };
}

let toastId;
function setParserLoading(loading) {
  const filePath = store.getState().files.filePath;
  if (loading === true) toastId = toast.info(`Parsing file ${filePath}`, { hideProgressBar: false });
  else if (toastId != null) {
    toast.dismiss(toastId);
  }
  return { type: parserActions.setLoading, payload: { loading } };
}

function setParserGetImage(getImage) {
  return { type: parserActions.setGetImage, payload: { getImage } };
}

function setParseFunction(parse) {
  return { type: parserActions.setParse, payload: { parse } };
}

function setManualParserFunction(manual) {
  return { type: parserActions.setManualSelectParser, payload: { manual } };
}

export { setParserType, setParseFunction, setParserGetImage, setManualParserFunction, setParserLoading };
