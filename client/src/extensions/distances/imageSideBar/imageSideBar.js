import React, { Component } from 'react';

import { Grid } from '@material-ui/core';

import ImageView from './imageView';

import './imageSideBar.scss';

class ImageSideBar extends Component {
  getLabel = (index) => {
    return this.props.imagesToDisplay[index][1][0];
  };
  getIndex = (index) => {
    return this.props.imagesToDisplay[index][1][1];
  };
  getImagePath = (index) => {
    return this.props.imagesToDisplay[index][0];
  };

  getImageViewFor = (index, smallSize) => {
    const { compareIndex, setCompareIndex } = this.props;
    return (
      <ImageView
        setCompareIndex={setCompareIndex}
        key={index}
        imageDictIndex={index}
        groundTruth={index === 0}
        compare={index === compareIndex}
        smallSize={smallSize}
        label={this.getLabel(index)}
        index={this.getIndex(index)}
        imagePath={this.getImagePath(index)}
      />
    );
  };

  render() {
    const { imagesToDisplay, compareIndex } = this.props;
    return (
      <Grid container direction={'column'} className={'imageSideBar'}>
        <Grid item>
          <Grid container direction={'column'}>
            <Grid item>{this.getImageViewFor(0)}</Grid>
            {compareIndex !== 0 && <Grid item>{this.getImageViewFor(compareIndex)}</Grid>}
          </Grid>
        </Grid>
        <Grid item>
          <Grid container direction={'row'} wrap={'nowrap'} className={'smallSizeImageWrapper'}>
            {Object.keys(imagesToDisplay)
              .slice(1)
              .map((img, i) => {
                return (
                  <Grid item key={i}>
                    {this.getImageViewFor(parseInt(img), true)}
                  </Grid>
                );
              })}
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default ImageSideBar;
