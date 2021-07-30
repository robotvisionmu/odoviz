import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as pathUtils from 'path';

import {
  faChevronCircleUp,
  faCircleNotch,
  faExclamationTriangle,
  faFile,
  faFolder,
  faSyncAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Menu, TextField } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { Autocomplete } from '@material-ui/lab';
import classnames from 'classnames';

import { parsers } from 'parsers';
import { setExplorerPath } from 'reducers/explorer/explorerActions';
import { setFilePath } from 'reducers/files/filesActions';
import { setParserType, setManualParserFunction } from 'reducers/parser/parserActions';

import { addMatchingPath } from '../../reducers/matching/matchingActions';

import './explorer.scss';

class Explorer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      loading: false,
      rightClickElement: null,
      error: null,
    };
  }

  componentDidMount() {
    this.fetchDir(this.props.path);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.path !== this.props.path) this.fetchDir(this.props.path);
  }

  handleRightClick = (e) => {
    e.preventDefault();
    this.setState({ rightClickElement: e.currentTarget });
  };

  handleCloseRightClick = () => {
    this.setState({ rightClickElement: null });
  };

  handleAddMatchingDir = () => {
    const matchingPath = this.state.rightClickElement.getAttribute('fsname');
    this.setState({ rightClickElement: null });
    this.props.addMatchingPath(matchingPath);
  };

  handleSelectParser = (e, v) => {
    if (v == null) {
      this.props.setManualParserFunction(false);
      this.props.setParserType(null);
    } else {
      this.props.setManualParserFunction(true);
      this.props.setParserType(v.config.uid);
    }
  };

  showMsgForDeniedDirs = () => {
    this.setState({ error: 'Access Denied' }, () => {
      setTimeout(() => {
        this.setState({ error: null });
      }, 1000);
    });
  };

  fetchDir = async (path) => {
    this.setState({ loading: true });
    try {
      const response = await fetch(`/files/${path}`);
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      const data = await response.json();
      this.setState({ files: data || [], loading: false, error: data.error });
      if (!data.error) this.props.setExplorerPath(path);
    } catch (e) {
      const errorMsg = e && e.message;
      this.setState({ loading: false, error: errorMsg });
    }
  };

  fetchFile = (path) => {
    this.setState({ loading: true });
    this.props.setFilePath(path);
    this.setState({ loading: false });
  };

  refreshDir = () => {
    this.fetchDir(this.props.path);
  };

  handleUpdatePath = (e) => {
    const requiredPath = e.currentTarget.getAttribute('fsname');
    if (requiredPath === this.props.path) return;
    if (e.currentTarget.getAttribute('isdir') === true.toString()) this.fetchDir(requiredPath);
    else if (e.currentTarget.getAttribute('isfile') === true.toString()) this.fetchFile(requiredPath);
  };

  getAllPaths = (path) => {
    const allPaths = [];
    allPaths.push(path);
    while (pathUtils.dirname(path) !== path) {
      const parentDir = pathUtils.dirname(path);
      allPaths.push(parentDir);
      path = parentDir;
      if (allPaths.length > 3) break;
    }
    return allPaths.reverse();
  };

  render() {
    const { files, loading, rightClickElement, error } = this.state;
    const { loadedFile, path, parserType, parserManual, loadedFileLoading, loadedFileParsing } = this.props;
    return (
      <div className="explorer">
        <Menu
          className="folderContextMenu"
          keepMounted
          id="simple-menu"
          anchorEl={rightClickElement}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={Boolean(rightClickElement)}
          onClose={this.handleCloseRightClick}
        >
          <ul className="menu">
            <li className="menuItem" onClick={this.handleAddMatchingDir}>
              Add to Matching Paths
            </li>
          </ul>
        </Menu>
        <div className="topBar">
          {path !== '.' && (
            <div
              className="oneLevelUpButton"
              isdir={true.toString()}
              fsname={pathUtils.dirname(path)}
              onClick={this.handleUpdatePath}
            >
              <span className="fa-layers fa-fw">
                <FontAwesomeIcon icon={faFolder} />
                <FontAwesomeIcon icon={faChevronCircleUp} transform="shrink-4 left-5 down-4" color="#333" />
              </span>
            </div>
          )}
          <div className="refreshButton" onClick={this.refreshDir}>
            <FontAwesomeIcon icon={faSyncAlt} fixedWidth color={'#90CAF9'} />
          </div>
          <div className="breadcrumbs">
            {path === '.' && <div className="noHover">File Browser</div>}
            {path !== '.' &&
              this.getAllPaths(path).map((currentPath, index) => {
                return (
                  <div key={index} isdir={true.toString()} fsname={currentPath} onClick={this.handleUpdatePath}>
                    {pathUtils.basename(currentPath)}
                  </div>
                );
              })}
          </div>
          <div>{loading && <FontAwesomeIcon icon={faCircleNotch} spin />}</div>
        </div>

        {
          <ul className="fileSystem">
            {files.length > 0 &&
              files.map((file, index) => {
                const fsName = pathUtils.join(path, file.name);
                return (
                  <li
                    className="nameLi"
                    key={index}
                    fsname={fsName}
                    isdir={(file.type === 'directory').toString()}
                    isfile={(file.type === 'file').toString()}
                    onContextMenu={this.handleRightClick}
                    onClick={this.handleUpdatePath}
                  >
                    <Grid container direction="row" alignItems="center">
                      {file.type === 'directory' && (
                        <Grid item>
                          <FontAwesomeIcon icon={faFolder} fixedWidth />
                        </Grid>
                      )}
                      {file.type === 'file' && (
                        <Grid item>
                          <FontAwesomeIcon icon={faFile} fixedWidth />
                        </Grid>
                      )}
                      <Grid item xs className={classnames('name', { loaded: fsName === loadedFile })}>
                        {file.name}
                      </Grid>
                      {fsName === loadedFile && (loadedFileLoading || loadedFileParsing) && (
                        <Grid item className="loading-wrapper">
                          <FontAwesomeIcon icon={faCircleNotch} fixedWidth spin />
                          {loadedFileLoading && <span> Downloading </span>}
                          {loadedFileParsing && <span> Parsing </span>}
                        </Grid>
                      )}
                    </Grid>
                  </li>
                );
              })}
          </ul>
        }

        <div className="autocomplete-wrapper">
          <Grid container direction="row">
            <Grid item xs>
              Selected Parser
              {parserType != null && <span style={{ padding: '0 5px' }}>({parserManual ? 'Manual' : 'Auto'})</span>}
            </Grid>
            <Grid item>
              <Autocomplete
                size="small"
                onChange={this.handleSelectParser}
                options={parsers}
                value={parserType != null ? parsers.filter((p) => p.config.uid === parserType)[0] : null}
                getOptionLabel={(p) => p.config.name}
                style={{ width: 300 }}
                renderInput={(params) => <TextField {...params} placeholder="Auto Select" />}
              />
            </Grid>
          </Grid>
        </div>

        {error && (
          <Grid container className="bottomBar">
            <Grid item>Error</Grid>
            <Grid item xs className="errorMessageWrapper">
              <FontAwesomeIcon icon={faExclamationTriangle} color={'#ff342f'} />
              <span className="errorMessage"> {error.toTitleCase()} </span>
            </Grid>
          </Grid>
        )}
        {!error && loadedFile && pathUtils.dirname(loadedFile) !== path && (
          <Grid container className="bottomBar">
            <Grid item>Loaded</Grid>
            <Grid item xs className="loadedFileWrapper">
              <FontAwesomeIcon icon={faFile} />
              <span className="loadedFileName"> {loadedFile} </span>
            </Grid>
          </Grid>
        )}
      </div>
    );
  }
}

export default connect(
  (store) => ({
    loadedFileParsing: store.parser.loading,
    loadedFileLoading: store.files.loading,
    parserType: store.parser.type,
    parserManual: store.parser.manual,
    loadedFile: store.files.filePath,
    path: store.explorer.path,
  }),
  { setFilePath, setExplorerPath, addMatchingPath, setParserType, setManualParserFunction }
)(Explorer);
