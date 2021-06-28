import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  faArrowsAltH,
  faCar,
  faCog,
  faExpandArrowsAlt,
  faFolder,
  faImage,
  faImages,
  faInfoCircle,
  faMapMarkerAlt,
  faQuestionCircle,
  faRandom,
  faRulerHorizontal,
  faSave,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import About from './about/about';
import Distances from './distances/distances';
import Explorer from './explorer/explorer';
import ImageViewer from './imageViewer/imageViewer';
import Info from './info/info';
import Locations from './locations/locations';
import Matching from './matching/matching';
import Sampling from './sampling/sampling';
import Save from './save/save';
import OffsetSettings from './settings/offset/offsetSettings';
import SceneSettings from './settings/scene/sceneSettings';

import './extensions.scss';

class Extensions extends Component {
  constructor(props) {
    super(props);
    this.extensionStrings = {
      explorer: 'explorer',
      sceneSettings: 'sceneSettings',
      offsetSettings: 'offsetSettings',
      info: 'info',
      sampling: 'sampling',
      save: 'save',
      imageViewer: 'imageViewer',
      matching: 'matching',
      distances: 'distances',
      locations: 'locations',
      about: 'about',
    };
    this.state = {
      activeExtension: null,
    };
  }

  toggleExtension = (e) => {
    const { activeExtension } = this.state;
    const requiredExtension = e.currentTarget.getAttribute('ename');
    if (activeExtension === requiredExtension) this.setState({ activeExtension: null });
    else this.setState({ activeExtension: requiredExtension });
  };

  render() {
    const { toggleExtension, extensionStrings } = this;
    const { activeExtension } = this.state;
    const { isPinned, info, filePath, selectedObject } = this.props;

    return (
      <div className="extensions-wrapper">
        <ul className="extensions">
          <li className="extension-wrapper">
            <div
              className={classnames('extension-icon', { active: activeExtension === extensionStrings.save })}
              ename={extensionStrings.save}
              onClick={toggleExtension}
            >
              <FontAwesomeIcon icon={faSave} fixedWidth />
            </div>
            {activeExtension === extensionStrings.save && (
              <div className={classnames('extension', { hidden: activeExtension !== extensionStrings.save })}>
                <Save />
              </div>
            )}
          </li>

          <li className="extension-wrapper">
            <div
              className={classnames('extension-icon', { active: activeExtension === extensionStrings.explorer })}
              ename={extensionStrings.explorer}
              onClick={toggleExtension}
            >
              <FontAwesomeIcon icon={faFolder} fixedWidth />
            </div>
            <div className={classnames('extension', { hidden: activeExtension !== extensionStrings.explorer })}>
              <Explorer />
            </div>
          </li>

          <li className="extension-wrapper">
            <div
              className={classnames('extension-icon', { active: activeExtension === extensionStrings.sceneSettings })}
              ename={extensionStrings.sceneSettings}
              onClick={toggleExtension}
            >
              <span className="fa-layers fa-fw">
                <FontAwesomeIcon icon={faImage} transform="up-5" />
                <FontAwesomeIcon icon={faCog} transform="down-3 right-5" />
              </span>
            </div>
            <div className={classnames('extension', { hidden: activeExtension !== extensionStrings.sceneSettings })}>
              <SceneSettings />
            </div>
          </li>

          <li className="extension-wrapper">
            <div
              className={classnames('extension-icon', { active: activeExtension === extensionStrings.offsetSettings })}
              ename={extensionStrings.offsetSettings}
              onClick={toggleExtension}
            >
              <span className="fa-layers fa-fw">
                <FontAwesomeIcon icon={faCar} transform="up-5" />
                <FontAwesomeIcon icon={faCog} transform="down-3 right-5" />
              </span>
            </div>
            <div className={classnames('extension', { hidden: activeExtension !== extensionStrings.offsetSettings })}>
              <OffsetSettings />
            </div>
          </li>

          <li className="extension-wrapper">
            <div
              className={classnames('extension-icon', { active: activeExtension === extensionStrings.sampling })}
              ename={extensionStrings.sampling}
              onClick={toggleExtension}
            >
              <span className="fa-layers fa-fw">
                <FontAwesomeIcon icon={faCar} transform="up-5" />
                <FontAwesomeIcon icon={faArrowsAltH} transform="down-10" />
              </span>
            </div>
            {activeExtension === extensionStrings.sampling && (
              <div className={classnames('extension', { hidden: activeExtension !== extensionStrings.sampling })}>
                <Sampling />
              </div>
            )}
          </li>

          <li className="extension-wrapper">
            <div
              className={classnames('extension-icon', { active: activeExtension === extensionStrings.distances })}
              ename={extensionStrings.distances}
              onClick={toggleExtension}
            >
              <span className="fa-layers fa-fw">
                <FontAwesomeIcon icon={faImages} transform="up-5" />
                <FontAwesomeIcon icon={faExpandArrowsAlt} transform="down-3 right-5" />
              </span>
            </div>
            <div className={classnames('extension', { hidden: activeExtension !== extensionStrings.distances })}>
              <Distances />
            </div>
          </li>

          <li className="extension-wrapper">
            <div
              className={classnames('extension-icon', { active: activeExtension === extensionStrings.locations })}
              ename={extensionStrings.locations}
              onClick={toggleExtension}
            >
              <span className="fa-layers fa-fw">
                <FontAwesomeIcon icon={faMapMarkerAlt} transform="up-5" />
                <FontAwesomeIcon icon={faRulerHorizontal} transform="down-12 shrink-2" />
              </span>
            </div>
            <div className={classnames('extension', { hidden: activeExtension !== extensionStrings.locations })}>
              <Locations />
            </div>
          </li>

          <li className={classnames('extension-wrapper', { hidden: filePath == null })}>
            <div
              className={classnames('extension-icon', { active: activeExtension === extensionStrings.matching })}
              ename={extensionStrings.matching}
              onClick={toggleExtension}
            >
              <FontAwesomeIcon icon={faRandom} fixedWidth />
            </div>
            <div className={classnames('extension', { hidden: activeExtension !== extensionStrings.matching })}>
              <Matching />
            </div>
          </li>

          <li className={classnames('extension-wrapper', { hidden: !info })}>
            <div
              className={classnames('extension-icon', { active: activeExtension === extensionStrings.info })}
              ename={extensionStrings.info}
              onClick={toggleExtension}
            >
              <FontAwesomeIcon icon={faInfoCircle} className={classnames({ pinned: isPinned })} fixedWidth />
            </div>
            <div className={classnames('extension', { hidden: activeExtension !== extensionStrings.info })}>
              <Info info={info} />
            </div>
          </li>

          <li className={classnames('extension-wrapper', { hidden: !(info && info.image != null) })}>
            <div
              className={classnames('extension-icon', { active: activeExtension === extensionStrings.imageViewer })}
              ename={extensionStrings.imageViewer}
              onClick={toggleExtension}
            >
              <FontAwesomeIcon icon={faImage} className={classnames({ pinned: isPinned })} fixedWidth />
            </div>
            {activeExtension === extensionStrings.imageViewer && (
              <div className={classnames('extension', { hidden: activeExtension !== extensionStrings.imageViewer })}>
                <ImageViewer
                  image={info && info.image}
                  filePath={selectedObject && selectedObject.parent.name}
                  info={info}
                />
              </div>
            )}
          </li>
        </ul>

        <ul className="extensions-extra">
          <li className="extension-wrapper">
            <div
              className={classnames('extension-icon', { active: activeExtension === extensionStrings.about })}
              ename={extensionStrings.about}
              onClick={toggleExtension}
            >
              <FontAwesomeIcon icon={faQuestionCircle} fixedWidth />
            </div>
            {activeExtension === extensionStrings.about && (
              <div className="extension">
                <About />
              </div>
            )}
          </li>
        </ul>
      </div>
    );
  }
}

export default connect((store) => {
  const isPinned = store.env.selected.isPinned;
  const selectedObject = store.env.selected.object;
  const filePath = store.files.filePath;
  let info = null;
  if (selectedObject && selectedObject.hasOwnProperty('data')) info = selectedObject.data;
  return { info, isPinned, filePath, selectedObject };
})(Extensions);
