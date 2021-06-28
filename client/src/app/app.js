import React, { Component } from 'react';

import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import Extensions from 'extensions/extensions';
import ThreedView from 'threedView/threedView';

import './app.scss';

class App extends Component {
  render() {
    return (
      <div className="app">
        <Extensions />
        <div className="mainView">
          <ThreedView />
        </div>
        <ToastContainer
          autoClose={5000}
          toastClassName="myToastContainer"
          transition={Slide}
          newestOnTop
          pauseOnFocusLoss
          pauseOnHover
          hideProgressBar={true}
        />
      </div>
    );
  }
}

export default App;
