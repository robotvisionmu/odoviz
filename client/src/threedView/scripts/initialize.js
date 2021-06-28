import TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';

import { addEventListeners } from './events';

function initialize(parent) {
  const { canvas, props } = parent;

  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  const { togglePinned } = props;
  const { isRightClickAndDragged, mousePosition } = parent;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(90, width / height, 1, 100000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });

  const startPosition = new THREE.Vector3(35, 50, 45);
  camera.position.set(15, 25, 15);
  new TWEEN.Tween(camera.position).to(startPosition, 2000).easing(TWEEN.Easing.Quadratic.InOut).start();

  scene.background = new THREE.Color(0xcccccc);

  renderer.setSize(width, height);
  addEventListeners(renderer, { isRightClickAndDragged, mousePosition }, { togglePinned });
  canvas.appendChild(renderer.domElement);

  return { scene, camera, renderer };
}

export default initialize;
