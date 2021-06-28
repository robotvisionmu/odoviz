import React, { Component } from 'react';
import { connect } from 'react-redux';

import getInfoTable from './infoTable';

import './info.scss';

class Info extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { info, isPinned } = this.props;
    return (
      <div className="info">
        {info && getInfoTable({ info })}
        {isPinned && <div className="bottomBar">object locked, right click to release</div>}
      </div>
    );
  }
}

export default connect((store) => ({ isPinned: store.env.selected.isPinned }), null)(Info);
