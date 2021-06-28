import { MapControls } from 'three/examples/jsm/controls/MapControls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function setControls({ scene, camera, renderer, controls }, controlsString) {
  if (controls != null) controls.dispose();
  switch (controlsString) {
    case 'map':
      controls = new MapControls(camera, renderer.domElement);
      break;
    case 'orbit':
      controls = new OrbitControls(camera, renderer.domElement);
      break;
    default:
      controls = new OrbitControls(camera, renderer.domElement);
  }

  //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.25;
  controls.screenSpacePanning = false;
  controls.minDistance = camera.near;
  controls.maxDistance = camera.far;

  controls.addEventListener('change', onPositionChange.bind(this, scene, camera));

  return controls;
}

function onPositionChange(scene, camera) {
  const gridHelper = scene.children.filter((child) => child.name.startsWith('gridHelper'))[0];
  const height = camera.position.y;
  const heightThresholds = [0, 20, 100, 400, 1000, 4000, 10000];
  const scalesForHeights = [0.05, 0.2, 0.5, 2, 5, 20, 50, 200];
  for (const [i, heightThreshold] of heightThresholds.entries()) {
    if (height > heightThreshold) setScaleIfDifferent(gridHelper, scalesForHeights[i]);
  }
}

function setScaleIfDifferent(object, scaleXYZ) {
  if (object.scale.x === scaleXYZ) return;
  object.scale.x = scaleXYZ;
  object.scale.y = scaleXYZ;
  object.scale.z = scaleXYZ;
}

export default setControls;
