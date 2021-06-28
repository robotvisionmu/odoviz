const initialValue = {
  loading: false,
  type: null,
  getImage: null,
  parse: null,
  manual: false,
};

const parserActions = {
  setParserType: 'SET_PARSER_TYPE',
  setGetImage: 'SET_PARSER_GET_IMAGE',
  setParse: 'SET_PARSER_FUNCTION',
  setManualSelectParser: 'SET_MANUAL_SELECT_PARSER',
  setLoading: 'SET_LOADING_PARSER',
};

function parserReducer(state = initialValue, action) {
  switch (action.type) {
    case parserActions.setLoading:
      return { ...state, loading: action.payload.loading };
    case parserActions.setParserType:
      return { ...state, type: action.payload.type };
    case parserActions.setGetImage:
      return { ...state, getImage: action.payload.getImage };
    case parserActions.setParse:
      return { ...state, parse: action.payload.parse };
    case parserActions.setManualSelectParser:
      return { ...state, manual: action.payload.manual };
    default:
      return state;
  }
}

export { parserActions, parserReducer };
