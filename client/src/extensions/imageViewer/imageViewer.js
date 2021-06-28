import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as pathUtils from 'path';

import { faMapMarkedAlt, faStreetView, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid } from '@material-ui/core';
import Leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Map, Marker, TileLayer } from 'react-leaflet';

import mapMarker from 'assets/mapMarker.svg';
import { getGmapsLink, getGmapsStreetViewLink, handleClickLink } from 'utils/linkUtils';

import './imageViewer.scss';

// Set default icon again
// https://stackoverflow.com/a/51222271/3125070
Leaflet.Marker.prototype.options.icon = Leaflet.icon({
  iconUrl: mapMarker,
  iconSize: [15, 25],
});

class ImageViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageHeight: null,
      imageWidth: null,
    };
  }

  handleOnImageLoad = (event) => {
    const imageTag = event.currentTarget;
    const { naturalHeight, naturalWidth } = imageTag;
    this.setState({ imageHeight: naturalHeight, imageWidth: naturalWidth });
  };

  render() {
    const { image, isPinned, info, filePath, getImage } = this.props;
    const { imageHeight, imageWidth } = this.state;
    const { handleOnImageLoad } = this;

    if (info == null) return null;
    const imgPaths = {};
    if (typeof image === 'string' || image instanceof String) imgPaths['cam'] = `/files/${getImage(image, filePath)}`;
    else if (typeof image === 'object' && image !== null)
      Object.entries(image).forEach(([k, v]) => {
        if (['display', '_display'].includes(k)) return;
        const key = k === 'value' ? 'cam' : k;
        imgPaths[key] = `/files/${getImage(v, filePath, k)}`;
      });

    let gps = null,
      position = null,
      zoom = null;
    const isGpsPresent = info && Object.prototype.hasOwnProperty.call(info, 'gps');
    if (isGpsPresent) {
      gps = info.gps;
      position = [gps.latitude, gps.longitude];
      zoom = 15;
    }

    return (
      <div className="imageViewer">
        <Grid container direction={'column'} spacing={1} alignItems={'stretch'}>
          {isGpsPresent && (
            <Grid item className={'mapWrapper'}>
              <Map
                center={position}
                zoom={zoom}
                className={'map'}
                // fix map size, but reloads every time gps changes
                // ref={map => map && map.leafletElement.invalidateSize()}
              >
                <TileLayer
                  // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"                   // Default
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png" // Positron
                  // url="http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"            // Dark Matter
                  // url="http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png"      // Positron Lite
                  // url="http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png"       // Dark Matter Lite
                  // more on http://bl.ocks.org/Xatpy/raw/854297419bd7eb3421d0/
                />
                <Marker position={position} />
              </Map>

              <Grid container spacing={2} direction="row" className={'mapLinks'}>
                <Grid item className="link gmaps-link">
                  <FontAwesomeIcon
                    onClick={handleClickLink}
                    url={getGmapsLink(gps.latitude, gps.longitude)}
                    icon={faMapMarkedAlt}
                    fixedWidth
                  />
                </Grid>
                <Grid item className="link gmaps-sv-link">
                  <FontAwesomeIcon
                    onClick={handleClickLink}
                    url={getGmapsStreetViewLink(gps.latitude, gps.longitude, gps.heading)}
                    icon={faStreetView}
                    fixedWidth
                  />
                </Grid>
              </Grid>
            </Grid>
          )}

          {!isGpsPresent && (
            <Grid item>
              <div className="noGps">
                <div>No GPS values present</div>
                <div>
                  <FontAwesomeIcon icon={faTimesCircle} fixedWidth color={'#ff7c72'} />
                  <span> Map hidden</span>
                </div>
              </div>
            </Grid>
          )}

          {Object.entries(imgPaths).map(([k, v], i) => {
            return (
              <Grid item key={i} className="imageWrapper">
                <div className="image">
                  {v && <img src={v} alt={`${k}: ${v} not found`} onLoad={handleOnImageLoad} />}
                </div>
                <div className="caption">
                  <span className={'imageName'}>
                    {k.replace('_', ' ').toTitleCase()}: {pathUtils.basename(v)}
                  </span>
                  <span className={'imagePath'}>{filePath}</span>
                  <span className={'imageInfo'}>
                    Dimensions: {imageWidth || 'Unknown'} x {imageHeight || 'Unknown'}{' '}
                  </span>
                </div>
              </Grid>
            );
          })}
        </Grid>

        {isPinned && <div className="bottomBar">object locked, right click to release</div>}
      </div>
    );
  }
}

export default connect((store) => ({
  isPinned: store.env.selected.isPinned,
  getImage: store.parser.getImage,
}))(ImageViewer);
