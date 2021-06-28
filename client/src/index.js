import React from 'react';
import { Provider } from 'react-redux';

import ReactDOM from 'react-dom';

import 'utils/arrayUtils';
import 'utils/numberUtils';
import 'utils/stringUtils';

import App from './app/app';
import * as serviceWorker from './serviceWorker';
import store from './store';

import './index.scss';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
