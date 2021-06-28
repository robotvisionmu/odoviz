import React, { Component } from 'react';

import { loadedFile, loadFile, resetFile, savedFile, saveFile } from 'reducers/save/saveFile/saveFileActions';
import {
  loadedSampling,
  loadSampling,
  resetSampling,
  savedSampling,
  saveSampling,
} from 'reducers/save/saveSampling/saveSamplingActions';
import {
  loadedSettings,
  loadSettings,
  resetSettings,
  savedSettings,
  saveSettings,
} from 'reducers/save/saveSettings/saveSettingsActions';
import { loadedView, loadView, resetView, savedView, saveView } from 'reducers/save/saveView/saveViewActions';

import SaveLayout from './saveLayout';

import './save.scss';

class Save extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  reRender = () => {
    this.forceUpdate();
  };

  render() {
    return (
      <div className="save">
        <SaveLayout
          name="View"
          save={saveView}
          load={loadView}
          reset={resetView}
          reRender={this.reRender}
          loaded={loadedView}
          saved={savedView}
        />
        <SaveLayout
          name="Settings"
          save={saveSettings}
          load={loadSettings}
          reset={resetSettings}
          reRender={this.reRender}
          loaded={loadedSettings}
          saved={savedSettings}
        />
        <SaveLayout
          name="Sampling"
          save={saveSampling}
          load={loadSampling}
          reset={resetSampling}
          reRender={this.reRender}
          loaded={loadedSampling}
          saved={savedSampling}
        />
        <SaveLayout
          name="Recent File"
          save={saveFile}
          load={loadFile}
          reset={resetFile}
          reRender={this.reRender}
          loaded={loadedFile}
          saved={savedFile}
        />
      </div>
    );
  }
}

export default Save;
