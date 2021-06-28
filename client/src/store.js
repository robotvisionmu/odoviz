import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';

import rootReducer from './reducers/reducer';
import rootSaga from './sagas/saga';

const sagaMiddleware = createSagaMiddleware();

// Centralized application state
// For more information visit http://redux.js.org/
const middleware = [
  sagaMiddleware,
  thunk,
  process.env.NODE_ENV !== 'production' && logger, // logger is disabled in production
].filter(Boolean);
const store = createStore(rootReducer, applyMiddleware(...middleware));

sagaMiddleware.run(rootSaga);

export default store;
