import React, { Component } from 'react';

import * as pathUtils from 'path';

import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Tooltip } from '@material-ui/core';
import classnames from 'classnames';

import Label from '../label/label';

import './imageView.scss';

class ImageView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageHeight: null,
      imageWidth: null,
      copied: null,
    };
  }

  handleOnImageLoad = (event) => {
    const imageTag = event.currentTarget;
    const { naturalHeight, naturalWidth } = imageTag;
    this.setState({ imageHeight: naturalHeight, imageWidth: naturalWidth });
  };

  copyToClipboard = () => {
    const textField = document.createElement('textarea');
    textField.innerText = this.props.imagePath;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    document.body.removeChild(textField);
    this.setState({ copied: 'Copied!' }, () => {
      setTimeout(() => {
        this.setState({ copied: null });
      }, 2000);
    });
  };

  handleSetCompareIndex = () => {
    const { setCompareIndex, imageDictIndex } = this.props;
    if (imageDictIndex === 0) return;
    setCompareIndex(imageDictIndex);
  };

  render() {
    const { imagePath, groundTruth, compare, smallSize, label, index } = this.props;
    const { copied } = this.state;

    const extension = pathUtils.extname(imagePath).slice(1);
    const filename = pathUtils.basename(imagePath, extension);

    return (
      <div
        className={classnames('imageView', {
          groundTruth: groundTruth,
          compare: compare,
          smallSize: smallSize,
        })}
        onClick={this.handleSetCompareIndex}
      >
        <div className={classnames('image', { smallSize: smallSize })}>
          {imagePath && <img src={`/files/${imagePath}`} alt="Loaded" onLoad={this.handleOnImageLoad} />}
        </div>
        {!smallSize && (
          <div className="caption">
            <Grid container>
              <Grid item xs>
                <span>
                  {filename}
                  {extension}
                </span>
              </Grid>
              <Grid item onClick={this.copyToClipboard} className="copyToClipboard">
                <Tooltip title={copied || 'Copy imagePath to clipboard'}>
                  <span>
                    <FontAwesomeIcon icon={faCopy} color={'#90CAF9'} />
                  </span>
                </Tooltip>
              </Grid>
            </Grid>
          </div>
        )}

        <div className={'labelTag'}>
          <Grid container direction="row">
            <Label label={label} index={index} />
            {smallSize && (
              <Grid item onClick={this.copyToClipboard} className="copyToClipboard">
                <Tooltip title={copied || 'Copy imagePath to clipboard'}>
                  <span>
                    <FontAwesomeIcon icon={faCopy} color={'#90CAF9'} />
                  </span>
                </Tooltip>
              </Grid>
            )}
          </Grid>
        </div>
      </div>
    );
  }
}

export default ImageView;
