import React, { Component } from 'react';

import classnames from 'classnames';

import './label.scss';

class Label extends Component {
  render() {
    const { label, index, query } = this.props;
    return (
      <div className="labelWrapper">
        <div className={classnames('label', { query: query })}>
          {label}
          <sub className="index">{index}</sub>
        </div>
      </div>
    );
  }
}

export default Label;
