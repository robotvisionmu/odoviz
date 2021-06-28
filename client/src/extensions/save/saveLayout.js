import React, { Component } from 'react';

import { faDownload, faRetweet, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Tooltip } from '@material-ui/core';

class SaveLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSaveAndReRender = () => {
    const { save, reRender } = this.props;
    save();
    reRender();
  };

  handleLoadAndReRender = () => {
    const { load, reRender } = this.props;
    load();
    reRender();
  };

  handleResetAndReRender = () => {
    const { reset, reRender } = this.props;
    reset();
    reRender();
  };

  componentDidMount() {
    const { name } = this.props;
    if (name === 'View') this.interval = setInterval(() => this.forceUpdate(), 1000);
  }

  componentWillUnmount() {
    if (this.interval) clearInterval(this.interval);
  }

  render() {
    const { name, loaded, saved } = this.props;
    return (
      <Grid container spacing={1} className="saveLayout">
        <Grid item xs className="title">
          {name}
        </Grid>
        <Grid item>
          <Grid container spacing={1} className="wrapper">
            <Grid item>
              <Tooltip placement="bottom" title="Load">
                <div className="button" onClick={this.handleLoadAndReRender}>
                  <FontAwesomeIcon icon={faDownload} color={loaded() ? '#32c9ff' : '#ffffff'} />
                </div>
              </Tooltip>
            </Grid>

            <Grid item>
              <Tooltip placement="bottom" title="Save">
                <div className="button" onClick={this.handleSaveAndReRender}>
                  <FontAwesomeIcon icon={faSave} color={saved() ? '#32c9ff' : '#ffffff'} />
                </div>
              </Tooltip>
            </Grid>

            <Grid item>
              <Tooltip placement="bottom" title="Reset">
                <div className="button" onClick={this.handleResetAndReRender}>
                  <FontAwesomeIcon icon={faRetweet} color={'#ff4d4d'} />
                </div>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default SaveLayout;
