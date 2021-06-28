import React from 'react';

import { faMapMarkedAlt, faStreetView } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Grid from '@material-ui/core/Grid';

import { LightTooltip } from 'ui/LightTooltip';
import Location from 'utils/common/Location';
import { getGmapsLink, getGmapsStreetViewLink, handleClickLink } from 'utils/linkUtils';

const getInfoTable = ({ info }) => {
  return (
    <Grid item className="infoTable">
      <Grid container spacing={0} direction="column">
        {Object.entries(info).map(([key, value], index) => {
          let displayValue;
          switch (typeof value) {
            case 'function':
              return '';
            case 'object':
              if (Array.isArray(value)) displayValue = value.length === 0 ? 'empty' : value;
              else if (!value) displayValue = 'null';
              else if ('display' in value && (value.display === false || value.display === 'none')) return '';
              else displayValue = getInfoTable({ info: value });
              break;
            case 'number':
              if (value % 1 !== 0) displayValue = value.round(6);
              // not an integer
              else displayValue = value; // is an integer
              break;
            case 'boolean':
              if (value === true) displayValue = 'true';
              else if (value === false) displayValue = 'false';
              break;
            default:
              displayValue = value;
          }
          return (
            <Grid item className="row" key={index}>
              <Grid container spacing={2} direction="row">
                <Grid item className="key">
                  <LightTooltip title={value != null ? value.constructor.name : 'null'}>
                    <span>{key}</span>
                  </LightTooltip>
                </Grid>
                {value != null && value.constructor.name === Location.prototype.constructor.name && (
                  <React.Fragment>
                    <Grid item className="link gmaps-link">
                      <FontAwesomeIcon
                        onClick={handleClickLink}
                        url={getGmapsLink(value.latitude, value.longitude)}
                        icon={faMapMarkedAlt}
                        fixedWidth
                      />
                    </Grid>
                    <Grid item className="link gmaps-sv-link">
                      <FontAwesomeIcon
                        onClick={handleClickLink}
                        url={getGmapsStreetViewLink(value.latitude, value.longitude, value.heading)}
                        icon={faStreetView}
                        fixedWidth
                      />
                    </Grid>
                  </React.Fragment>
                )}
                <Grid item className="value" xs>
                  {' '}
                  {displayValue}{' '}
                </Grid>
              </Grid>
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );
};

export default getInfoTable;
