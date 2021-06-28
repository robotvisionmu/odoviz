import React, { Component } from 'react';

import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faHeart, faCode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Link, Tooltip } from '@material-ui/core';

import { name, version, dependencies, license, repository } from '../../../package.json';
import allLicenses from './licenses.json';

import './about.scss';

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getFromLicenses = (libName, key) => {
    const matchedLibNames = Object.keys(allLicenses).filter((e) => e.slice(0, e.lastIndexOf('@')) === libName);
    if (matchedLibNames.length > 0) {
      const matchedLibName = matchedLibNames[matchedLibNames.length - 1];
      if (key === 'version') return matchedLibName.slice(matchedLibName.lastIndexOf('@') + 1);
      return allLicenses[matchedLibName][key];
    } else return 'unknown';
  };

  render() {
    return (
      <div className="about">
        <Grid container direction={'column'}>
          <Grid item className="topBar">
            <div className="title">About</div>
          </Grid>

          <Grid item xs>
            <Grid container spacing={1} direction="column" className="aboutWrapper">
              <Grid item>
                <p>This is an open-source and free to use software.</p>
              </Grid>

              <Grid item>
                <Grid container direction="row">
                  <Grid item xs>
                    {name}
                  </Grid>
                  <Grid item style={{ color: '#90CAF9' }}>
                    v{version}
                  </Grid>
                </Grid>
              </Grid>

              <Grid item>
                <Grid container direction="row">
                  <Grid item xs>
                    License
                  </Grid>
                  <Grid item>
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      color="inherit"
                      href="https://github.com/robotvisionmu/odoviz/tree/main/client/LICENSE"
                    >
                      {license}
                    </Link>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item>
                <Grid container direction="row">
                  <Grid item xs>
                    Source Code
                  </Grid>
                  <Grid item>
                    <Link href={repository} target="_blank" rel="noopener noreferrer" color="inherit" underline="none">
                      <FontAwesomeIcon icon={faGithub} />
                      <span className="link"> Github</span>
                    </Link>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item>
                <Grid container direction="row">
                  <Grid item xs>
                    Bugs, Feature Requests, Pull Requests
                  </Grid>
                  <Grid item>
                    <Link
                      href={'https://github.com/robotvisionmu/odoviz'}
                      target="_blank"
                      rel="noopener noreferrer"
                      color="inherit"
                      underline="none"
                    >
                      <FontAwesomeIcon icon={faGithub} />
                      <span className="link"> Repo</span>
                    </Link>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item>
                <p>
                  This software depends on the following {Object.keys(dependencies).length}
                  <Tooltip
                    title={`Each listed dependency can have it's own list of dependencies, each of which can have it's own list, and so on. This results in a recursive total of ${
                      Object.keys(allLicenses).length
                    } dependencies`}
                  >
                    <span>* </span>
                  </Tooltip>
                  open-source libraries:
                </p>
              </Grid>

              <Grid container spacing={1} direction="column" className="dependencies">
                {Object.keys(dependencies).map((k) => {
                  return (
                    <Grid item key={k}>
                      <Grid container direction="row" className="row">
                        <Grid item xs className="name">
                          <Link
                            target="_blank"
                            rel="noopener noreferrer"
                            color="inherit"
                            href={this.getFromLicenses(k, 'repository')}
                          >
                            {k}
                          </Link>
                          <span className="version"> {`v${this.getFromLicenses(k, 'version')}`} </span>
                        </Grid>
                        <Grid item className="license">
                          {this.getFromLicenses(k, 'licenses')}
                        </Grid>
                      </Grid>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          </Grid>

          <Grid item>
            <Grid container className="bottomBar">
              <Grid item>
                Made with <FontAwesomeIcon icon={faHeart} color={'#ff0000'} /> by
              </Grid>
              <Grid item xs className="loadedFileWrapper">
                <FontAwesomeIcon icon={faCode} />
                <span className="loadedFileName">
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://github.com/saravanabalagi"
                    color="inherit"
                  >
                    Saravanabalagi Ramachandran
                  </Link>
                </span>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default About;
