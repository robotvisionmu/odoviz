import React, { Component } from 'react';
import { connect } from 'react-redux';

import { faCar, faExpandArrowsAlt, faLevelUpAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Slider, Tooltip } from '@material-ui/core';

import { defaultState, possibleValues } from 'reducers/settings/offset/offsetReducer';
import AntSwitch from 'ui/AntSwitch';
import TooltipValueLabel from 'ui/TooltipValueLabel';

import {
  setShowAltitude,
  setInvertPositionX,
  setInvertPositionY,
  setInvertPositionZ,
  setInvertRotationX,
  setInvertRotationY,
  setInvertRotationZ,
  setOffsetRotationX,
  setOffsetRotationY,
  setOffsetRotationZ,
  setPositionScale,
  setTimeOnZAxis,
  setSwapPositionXY,
  setSwapPositionXZ,
  setSwapPositionYZ,
  setSwapRotationXY,
  setSwapRotationXZ,
  setSwapRotationYZ,
} from '../../../reducers/settings/offset/offsetActions';

import './offsetSettings.scss';

class OffsetSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      localPositionScale: defaultState.positionScale,
      localTimeOnZAxis: defaultState.timeOnZAxis,
      mouseOverSlider: null,
      snapAngles: true,
    };
  }

  componentDidMount() {
    this.setState({ localEveryM: this.props.positionScale });
  }

  handleFineTunePositionScale = (e, value) => {
    this.setState({ localPositionScale: value.round(2) });
  };

  changePositionScale = (e, value) => {
    this.props.setPositionScale(value.round(2));
  };

  handleFineTuneTimeOnZAxis = (e, value) => {
    this.setState({ localTimeOnZAxis: value.round(2) });
  };

  changeTimeOnZAxis = (e, value) => {
    this.props.setTimeOnZAxis(value.round(2));
  };

  changeRotationX = (e, value) => {
    this.props.setOffsetRotationX(value.round(2));
  };
  changeRotationY = (e, value) => {
    this.props.setOffsetRotationY(value.round(2));
  };
  changeRotationZ = (e, value) => {
    this.props.setOffsetRotationZ(value.round(2));
  };

  invertRotationX = (e, value) => {
    this.props.setInvertRotationX(value);
  };
  invertRotationY = (e, value) => {
    this.props.setInvertRotationY(value);
  };
  invertRotationZ = (e, value) => {
    this.props.setInvertRotationZ(value);
  };

  invertPositionX = (e, value) => {
    this.props.setInvertPositionX(value);
  };
  invertPositionY = (e, value) => {
    this.props.setInvertPositionY(value);
  };
  invertPositionZ = (e, value) => {
    this.props.setInvertPositionZ(value);
  };

  swapPositionXY = (e, value) => {
    this.props.setSwapPositionXY(value);
  };
  swapPositionYZ = (e, value) => {
    this.props.setSwapPositionYZ(value);
  };
  swapPositionXZ = (e, value) => {
    this.props.setSwapPositionXZ(value);
  };

  swapRotationXY = (e, value) => {
    this.props.setSwapRotationXY(value);
  };
  swapRotationYZ = (e, value) => {
    this.props.setSwapRotationYZ(value);
  };
  swapRotationXZ = (e, value) => {
    this.props.setSwapRotationXZ(value);
  };

  toggleAltitude = (e, value) => {
    this.props.setShowAltitude(value);
  };

  handleOnMouseOver = (e) => {
    const sliderName = e.currentTarget.getAttribute('slide-for');
    this.setState({ mouseOverSlider: sliderName });
  };

  handleMouseOutSlider = () => {
    this.setState({ mouseOverSlider: null });
  };

  handleSnapAngles = () => {
    this.setState((state) => ({ snapAngles: !state.snapAngles }));
  };

  render() {
    const { changeRotationX, changeRotationY, changeRotationZ } = this;
    const { toggleAltitude } = this;
    const { positionScale, timeOnZAxis } = this.props;
    const { offsetRotationX, offsetRotationY, offsetRotationZ } = this.props;
    const { invertRotationX, invertRotationY, invertRotationZ } = this.props;
    const { invertPositionX, invertPositionY, invertPositionZ } = this.props;
    const { swapPositionXY, swapPositionYZ, swapPositionXZ } = this.props;
    const { swapRotationXY, swapRotationYZ, swapRotationXZ } = this.props;
    const { showAltitude } = this.props;
    const { localPositionScale, localTimeOnZAxis, mouseOverSlider, snapAngles } = this.state;
    const marks = [-180, -135, -90, -45, 0, 45, 90, 135, 180].map((value) => ({ value, label: value }));

    return (
      <div className="offsetSettings">
        <Grid container direction={'column'}>
          <Grid item className="topBar">
            <div className="title">Offset Settings</div>
          </Grid>

          <Grid item>
            <Grid container spacing={2} direction="column" className="offsetSettingsWrapper">
              <Grid item>
                <Grid container spacing={2}>
                  <Grid item xs>
                    Angle Snap (UI)
                  </Grid>
                  <Grid item>
                    <Grid component="label" container alignItems="center" spacing={1}>
                      <Grid item> off </Grid>
                      <Grid item>
                        <AntSwitch checked={snapAngles === true} onChange={this.handleSnapAngles} />
                      </Grid>
                      <Grid item> on </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item>
                <Grid container spacing={2}>
                  <Grid item xs>
                    Altitude
                  </Grid>
                  <Grid item>
                    <Grid component="label" container alignItems="center" spacing={1}>
                      <Grid item> off </Grid>
                      <Grid item>
                        <AntSwitch checked={showAltitude === true} onChange={toggleAltitude} />
                      </Grid>
                      <Grid item> on </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item>
                <Grid container spacing={2}>
                  <Grid item>
                    <Tooltip placement="bottom" title="Time on Z-axis">
                      <span className="fa-layers fa-fw">
                        <FontAwesomeIcon icon={faCar} transform="shrink-2 up-5" />
                        <FontAwesomeIcon icon={faLevelUpAlt} transform="down-10" className="positionScaleArrows" />
                      </span>
                    </Tooltip>
                  </Grid>
                  <Grid item xs>
                    <Slider
                      className="slider"
                      ValueLabelComponent={TooltipValueLabel}
                      value={timeOnZAxis}
                      valueLabelDisplay="auto"
                      min={possibleValues.timeOnZAxis[0]}
                      max={possibleValues.timeOnZAxis[1]}
                      step={possibleValues.timeOnZAxis[2]}
                      onChangeCommitted={this.handleFineTuneTimeOnZAxis}
                      onChange={this.changeTimeOnZAxis}
                    />
                  </Grid>
                  <Grid item xs>
                    <Slider
                      className="slider"
                      ValueLabelComponent={TooltipValueLabel}
                      value={timeOnZAxis}
                      valueLabelDisplay="auto"
                      min={Math.max(localTimeOnZAxis - 2, possibleValues.timeOnZAxis[0])}
                      max={Math.min(localTimeOnZAxis + 2, possibleValues.timeOnZAxis[1])}
                      step={possibleValues.timeOnZAxis[2]}
                      onChangeCommitted={this.handleFineTuneTimeOnZAxis}
                      onChange={this.changeTimeOnZAxis}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item>
                <Grid container spacing={2}>
                  <Grid item>
                    <Tooltip placement="bottom" title="Position Scale">
                      <span className="fa-layers fa-fw">
                        <FontAwesomeIcon icon={faCar} transform="shrink-2 up-5" />
                        <FontAwesomeIcon icon={faExpandArrowsAlt} transform="down-10" className="positionScaleArrows" />
                      </span>
                    </Tooltip>
                  </Grid>
                  <Grid item xs>
                    <Slider
                      className="slider"
                      ValueLabelComponent={TooltipValueLabel}
                      value={positionScale}
                      valueLabelDisplay="auto"
                      min={possibleValues.positionScale[0]}
                      max={possibleValues.positionScale[1]}
                      step={possibleValues.positionScale[2]}
                      onChangeCommitted={this.handleFineTunePositionScale}
                      onChange={this.changePositionScale}
                    />
                  </Grid>
                  <Grid item xs>
                    <Slider
                      className="slider"
                      ValueLabelComponent={TooltipValueLabel}
                      value={positionScale}
                      valueLabelDisplay="auto"
                      min={Math.max(localPositionScale - 2, possibleValues.positionScale[0])}
                      max={Math.min(localPositionScale + 2, possibleValues.positionScale[1])}
                      step={possibleValues.positionScale[2]}
                      onChangeCommitted={this.handleFineTunePositionScale}
                      onChange={this.changePositionScale}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item>
                <Grid container spacing={2}>
                  <Grid item>
                    <Tooltip placement="bottom" title="Position X">
                      <span>
                        P<sub>x</sub>
                      </span>
                    </Tooltip>
                  </Grid>
                  <Grid item>
                    <Grid component="label" container alignItems="center" spacing={1}>
                      <Grid item> invert </Grid>
                      <Grid item>
                        <AntSwitch checked={invertPositionX === true} onChange={this.invertPositionX} />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container spacing={2}>
                  <Grid item>
                    <Tooltip placement="bottom" title="Position Y">
                      <span>
                        P<sub>y</sub>
                      </span>
                    </Tooltip>
                  </Grid>
                  <Grid item>
                    <Grid component="label" container alignItems="center" spacing={1}>
                      <Grid item> invert </Grid>
                      <Grid item>
                        <AntSwitch checked={invertPositionY === true} onChange={this.invertPositionY} />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container spacing={2}>
                  <Grid item>
                    <Tooltip placement="bottom" title="Position Z">
                      <span>
                        P<sub>z</sub>
                      </span>
                    </Tooltip>
                  </Grid>
                  <Grid item>
                    <Grid component="label" container alignItems="center" spacing={1}>
                      <Grid item> invert </Grid>
                      <Grid item>
                        <AntSwitch checked={invertPositionZ === true} onChange={this.invertPositionZ} />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item>
                <Grid container spacing={2}>
                  <Grid item>
                    <Grid component="label" container alignItems="center" spacing={1}>
                      <Grid item>
                        {' '}
                        swap P<sub>xy</sub>{' '}
                      </Grid>
                      <Grid item>
                        <AntSwitch checked={swapPositionXY === true} onChange={this.swapPositionXY} />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Grid component="label" container alignItems="center" spacing={1}>
                      <Grid item>
                        {' '}
                        swap P<sub>yz</sub>{' '}
                      </Grid>
                      <Grid item>
                        <AntSwitch checked={swapPositionYZ === true} onChange={this.swapPositionYZ} />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Grid component="label" container alignItems="center" spacing={1}>
                      <Grid item>
                        {' '}
                        swap P<sub>xz</sub>{' '}
                      </Grid>
                      <Grid item>
                        <AntSwitch checked={swapPositionXZ === true} onChange={this.swapPositionXZ} />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid
                item
                slide-for={'RotationX'}
                onMouseOver={this.handleOnMouseOver}
                onMouseOut={this.handleMouseOutSlider}
              >
                <Grid container spacing={2}>
                  <Grid item>
                    <Tooltip placement="bottom" title="Rotation X">
                      <span>
                        R<sub>x</sub>
                      </span>
                    </Tooltip>
                  </Grid>
                  <Grid item xs>
                    <Slider
                      className="slider"
                      ValueLabelComponent={TooltipValueLabel}
                      value={offsetRotationX}
                      valueLabelDisplay="auto"
                      marks={mouseOverSlider === 'RotationX' ? marks : null}
                      track={false}
                      min={possibleValues.offsetRotationX[0]}
                      max={possibleValues.offsetRotationX[1]}
                      step={snapAngles ? null : possibleValues.offsetRotationX[2]}
                      rotation-axis={'x'}
                      onChange={changeRotationX}
                    />
                  </Grid>
                  <Grid item>
                    <Grid component="label" container alignItems="center" spacing={1}>
                      <Grid item> invert </Grid>
                      <Grid item>
                        <AntSwitch checked={invertRotationX === true} onChange={this.invertRotationX} />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                item
                slide-for={'RotationY'}
                onMouseOver={this.handleOnMouseOver}
                onMouseOut={this.handleMouseOutSlider}
              >
                <Grid container spacing={2}>
                  <Grid item>
                    <Tooltip placement="bottom" title="Rotation Y">
                      <span>
                        R<sub>y</sub>
                      </span>
                    </Tooltip>
                  </Grid>
                  <Grid item xs>
                    <Slider
                      className="slider"
                      ValueLabelComponent={TooltipValueLabel}
                      value={offsetRotationY}
                      valueLabelDisplay="auto"
                      marks={mouseOverSlider === 'RotationY' ? marks : null}
                      track={false}
                      min={possibleValues.offsetRotationY[0]}
                      max={possibleValues.offsetRotationY[1]}
                      step={snapAngles ? null : possibleValues.offsetRotationY[2]}
                      rotation-axis={'y'}
                      onChange={changeRotationY}
                    />
                  </Grid>
                  <Grid item>
                    <Grid component="label" container alignItems="center" spacing={1}>
                      <Grid item> invert </Grid>
                      <Grid item>
                        <AntSwitch checked={invertRotationY === true} onChange={this.invertRotationY} />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                item
                slide-for={'RotationZ'}
                onMouseOver={this.handleOnMouseOver}
                onMouseOut={this.handleMouseOutSlider}
              >
                <Grid container spacing={2}>
                  <Grid item>
                    <Tooltip placement="bottom" title="Rotation Z">
                      <span>
                        R<sub>z</sub>
                      </span>
                    </Tooltip>
                  </Grid>
                  <Grid item xs>
                    <Slider
                      className="slider"
                      ValueLabelComponent={TooltipValueLabel}
                      value={offsetRotationZ}
                      valueLabelDisplay="auto"
                      marks={mouseOverSlider === 'RotationZ' ? marks : null}
                      track={false}
                      min={possibleValues.offsetRotationZ[0]}
                      max={possibleValues.offsetRotationZ[1]}
                      step={snapAngles ? null : possibleValues.offsetRotationZ[2]}
                      rotation-axis={'z'}
                      onChange={changeRotationZ}
                    />
                  </Grid>
                  <Grid item>
                    <Grid component="label" container alignItems="center" spacing={1}>
                      <Grid item> invert </Grid>
                      <Grid item>
                        <AntSwitch checked={invertRotationZ === true} onChange={this.invertRotationZ} />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item>
                <Grid container spacing={2}>
                  <Grid item>
                    <Grid component="label" container alignItems="center" spacing={1}>
                      <Grid item>
                        {' '}
                        swap R<sub>xy</sub>{' '}
                      </Grid>
                      <Grid item>
                        <AntSwitch checked={swapRotationXY === true} onChange={this.swapRotationXY} />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Grid component="label" container alignItems="center" spacing={1}>
                      <Grid item>
                        {' '}
                        swap R<sub>yz</sub>{' '}
                      </Grid>
                      <Grid item>
                        <AntSwitch checked={swapRotationYZ === true} onChange={this.swapRotationYZ} />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Grid component="label" container alignItems="center" spacing={1}>
                      <Grid item>
                        {' '}
                        swap R<sub>xz</sub>{' '}
                      </Grid>
                      <Grid item>
                        <AntSwitch checked={swapRotationXZ === true} onChange={this.swapRotationXZ} />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default connect(
  (store) => {
    const {
      positionScale,
      timeOnZAxis,
      offsetRotationX,
      offsetRotationY,
      offsetRotationZ,
      invertRotationX,
      invertRotationY,
      invertRotationZ,
      invertPositionX,
      invertPositionY,
      invertPositionZ,
      swapPositionXY,
      swapPositionYZ,
      swapPositionXZ,
      swapRotationXY,
      swapRotationYZ,
      swapRotationXZ,
      showAltitude,
    } = store.settings.offset;
    return {
      scene: store.env.scene,
      positionScale,
      timeOnZAxis,
      offsetRotationX,
      offsetRotationY,
      offsetRotationZ,
      invertRotationX,
      invertRotationY,
      invertRotationZ,
      invertPositionX,
      invertPositionY,
      invertPositionZ,
      swapPositionXY,
      swapPositionYZ,
      swapPositionXZ,
      swapRotationXY,
      swapRotationYZ,
      swapRotationXZ,
      showAltitude,
    };
  },
  {
    setPositionScale,
    setTimeOnZAxis,
    setOffsetRotationX,
    setOffsetRotationY,
    setOffsetRotationZ,
    setInvertRotationX,
    setInvertRotationY,
    setInvertRotationZ,
    setInvertPositionX,
    setInvertPositionY,
    setInvertPositionZ,
    setSwapPositionXY,
    setSwapPositionYZ,
    setSwapPositionXZ,
    setSwapRotationXY,
    setSwapRotationYZ,
    setSwapRotationXZ,
    setShowAltitude,
  }
)(OffsetSettings);
