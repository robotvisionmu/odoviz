import { getGeoDistance } from '../distanceUtils';

class Location {
  constructor(latitude = null, longitude = null, altitude = null, heading = null) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.altitude = altitude;
    this.heading = heading;
  }

  distanceTo = (location) => {
    return getGeoDistance(this, location);
  };
}

export default Location;
