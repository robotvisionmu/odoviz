import * as THREE from 'three';

import { highlightPoints, resetHighlightedObject } from './highlight';

function update(props, parent) {
  const { camera, scene } = props;
  const { mousePosition } = parent;

  // props is an old snapshot, use only for camera, scene and renderer
  // use parent.props to get updated values
  const { isPinned } = parent.props;
  let currentIntersectedObject = parent.props.selectedObject;

  if (isPinned) return;

  const vector = new THREE.Vector3(mousePosition.x, mousePosition.y, 1);
  vector.unproject(camera);

  const ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

  // create an array containing all objects in the scene with which the ray intersects
  const intersects = ray.intersectObjects(scene.children, true);
  if (intersects.length > 0) {
    // Keep checking even behind the object in front
    for (let i = 0; i < intersects.length; i++) {
      if (intersects[i].object !== currentIntersectedObject) {
        if (intersects[i].object.type === 'Mesh' && intersects[i].object.parent.name === 'car') {
          // avoid repainting if it is the same object
          // or different part of the same object
          if (intersects[i].object.parent === currentIntersectedObject) break;

          // restore previous intersection object (if it exists) to its original color
          if (currentIntersectedObject) resetHighlightedObject(props, parent, currentIntersectedObject);

          // change color of highlighted object
          currentIntersectedObject = intersects[i].object.parent;
          currentIntersectedObject.currentHex = currentIntersectedObject.children[13].material.color.getHex();
          currentIntersectedObject.children[13].material.color.setHex(0x000000);

          highlightPoints(props, parent, currentIntersectedObject);
          break;
        }
      }
    }
  } else {
    if (currentIntersectedObject) resetHighlightedObject(props, parent, currentIntersectedObject);
    currentIntersectedObject = null;
  }
}

export { update };
