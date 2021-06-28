import React, { Component } from 'react';
import { connect } from 'react-redux';

import { faArrowsAltH, faDownload, faInfoCircle, faSync } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Slider, TextField, Tooltip } from '@material-ui/core';
import classNames from 'classnames';

import { changeEveryM, getSampledCarsJson, changeEveryDeg, setUnitToM } from 'reducers/sampling/samplingActions';
import { possibleValues } from 'reducers/sampling/samplingReducer';
import AntSwitch from 'ui/AntSwitch';
import TooltipValueLabel from 'ui/TooltipValueLabel';

import { downloadJson } from '../../utils/downloadUtils';

import './sampling.scss';

class Sampling extends Component {
  constructor(props) {
    super(props);
    this.state = {
      savedEveryM: null,
      savedEveryDeg: null,
    };
  }

  handleChangeEveryM = (e, value) => {
    this.props.changeEveryM(value.round(2));
  };

  handleTextUpdateEveryM = (e) => {
    try {
      let value = e.target.value;
      if (value.length === 0) return;
      value = parseFloat(e.target.value);
      this.props.changeEveryM(value.round(6));
    } catch (e) {
      console.error('everyM value should be float');
    }
  };

  handleTextUpdateEveryDeg = (e) => {
    try {
      let value = e.target.value;
      if (value.length === 0) return;
      value = parseFloat(e.target.value);
      this.props.changeEveryDeg(value.round(6));
    } catch (e) {
      console.error('everyDeg value should be float');
    }
  };

  handleChangeEveryDeg = (e, value) => {
    this.props.changeEveryDeg(value.round(2));
  };

  switchEveryM = (e, value) => {
    if (value === false) {
      this.setState({ savedEveryM: this.props.everyM });
      this.props.changeEveryM(0);
    } else {
      this.setState({ savedEveryM: null });
      this.props.changeEveryM(this.state.savedEveryM);
    }
  };

  switchEveryDeg = (e, value) => {
    if (value === false) {
      this.setState({ savedEveryDeg: this.props.everyDeg });
      this.props.changeEveryDeg(Infinity);
    } else {
      this.setState({ savedEveryDeg: null });
      this.props.changeEveryDeg(this.state.savedEveryDeg);
    }
  };

  handleSetUnitToM = (e) => {
    try {
      const value = parseFloat(e.currentTarget.value);
      this.props.setUnitToM(value.round(6));
    } catch (e) {
      console.error('unitToM value should be float');
    }
  };

  handleDownloadJson = () => {
    const sampledCarsJson = getSampledCarsJson();
    downloadJson(sampledCarsJson, 'sampledCars');
  };

  render() {
    const { everyM, everyDeg, scene, unitToM, parserType, allCars } = this.props;

    const showEveryM = everyM !== 0;
    const showEveryDeg = everyDeg !== Infinity;

    if (scene == null) return null;

    let cars = [];
    const carsGroup = scene.getObjectByName('cars');
    if (carsGroup) cars = carsGroup.children[0].children;
    const numberOfSampledCars = cars.length;
    const samplePercent = (numberOfSampledCars / allCars.length) * 100;
    const displayStatus = 'Real-time',
      displayMessage = `Sampled ${numberOfSampledCars} out of ${allCars.length} (${samplePercent.round(2)}%) `;

    const dontShowUnitConversionFor = ['bdd100k'];

    return (
      <div className="sampling">
        <Grid container direction={'column'}>
          <Grid item className="topBar">
            <div className="title">Sampling</div>
          </Grid>

          <Grid item xs>
            <Grid container spacing={2} direction="column" className="samplingWrapper">
              {!dontShowUnitConversionFor.includes(parserType) && (
                <Grid item>
                  <Grid container spacing={2} direction="row" alignItems="center">
                    <Grid item>1 unit =</Grid>
                    <Grid item xs>
                      <TextField className="number" value={unitToM} fullWidth onChange={this.handleSetUnitToM} />
                    </Grid>
                    <Grid item>metres</Grid>
                  </Grid>
                </Grid>
              )}

              <Grid item xs>
                <Grid item>
                  <Grid container direction="row" spacing={2} alignItems="center">
                    <Grid item>
                      <Grid container direction="row" spacing={2} className="row">
                        <Grid item>
                          <AntSwitch checked={showEveryM} onChange={this.switchEveryM} />
                        </Grid>
                        <Grid item className="icon">
                          <Tooltip placement="bottom" title="Sample every x metres">
                            <span>
                              <FontAwesomeIcon icon={faArrowsAltH} />
                            </span>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs>
                      <Grid container spacing={2} className={classNames('slidersWrapper', { hidden: !showEveryM })}>
                        <Grid item>
                          <TextField className="number" value={everyM} onChange={this.handleTextUpdateEveryM} />
                        </Grid>
                        <Grid item xs>
                          <Slider
                            className="slider"
                            ValueLabelComponent={TooltipValueLabel}
                            value={everyM}
                            valueLabelDisplay="auto"
                            min={possibleValues.everyM[0]}
                            max={possibleValues.everyM[1]}
                            step={possibleValues.everyM[2]}
                            onChangeCommitted={this.handleFineTuneEveryM}
                            onChange={this.handleChangeEveryM}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item>
                  <Grid container spacing={2} direction="row" alignItems="center">
                    <Grid item>
                      <Grid container spacing={2} direction="row" className="row">
                        <Grid item>
                          <AntSwitch checked={showEveryDeg} onChange={this.switchEveryDeg} />
                        </Grid>
                        <Grid item className="icon">
                          <Tooltip placement="bottom" title="Sample every x degrees">
                            <span>
                              <FontAwesomeIcon icon={faSync} style={{ transform: 'rotateX(50deg)' }} />
                            </span>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs>
                      <Grid container spacing={2} className={classNames('slidersWrapper', { hidden: !showEveryDeg })}>
                        <Grid item>
                          <TextField className="number" value={everyDeg} onChange={this.handleTextUpdateEveryDeg} />
                        </Grid>
                        <Grid item xs>
                          <Slider
                            className="slider"
                            ValueLabelComponent={TooltipValueLabel}
                            value={everyDeg}
                            valueLabelDisplay="auto"
                            min={possibleValues.everyDeg[0]}
                            max={possibleValues.everyDeg[1]}
                            step={possibleValues.everyDeg[2]}
                            onChangeCommitted={this.handleFineTuneEveryDeg}
                            onChange={this.handleChangeEveryDeg}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item>
                <div className="button" onClick={this.handleDownloadJson}>
                  <FontAwesomeIcon icon={faDownload} />
                  <div className="caption">
                    <span>Download Data</span>
                    <span>JSON Format</span>
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>

          <Grid item>
            <Grid container className="bottomBar">
              <Grid item>{displayStatus}</Grid>
              <Grid item xs className="loadedFileWrapper">
                <FontAwesomeIcon icon={faInfoCircle} />
                <span className="loadedFileName">{displayMessage}</span>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default connect(
  (store) => ({
    allCars: store.env.cars,
    parserType: store.parser.type,
    everyM: store.sampling.everyM,
    everyDeg: store.sampling.everyDeg,
    unitToM: store.sampling.unitToM,
    scene: store.env.scene,
  }),
  { changeEveryM, setUnitToM, changeEveryDeg }
)(Sampling);
