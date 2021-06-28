import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

import carModel from 'assets/car.obj';

function addGround({ scene }) {
  const groundSize = 100000;
  const ground = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(groundSize, groundSize),
    new THREE.MeshPhongMaterial({
      color: 0x999999,
      depthWrite: false,
    })
  );
  ground.name = 'ground';
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);
}

function addAxis({ scene }) {
  const axesHelper = new THREE.AxesHelper(5);
  axesHelper.name = 'axesHelper';
  scene.add(axesHelper);
}

function addGrid({ scene }) {
  const gridSize = 200000;
  const grid = new THREE.GridHelper(gridSize, gridSize / 100, 0x000000, 0x000000);
  grid.name = 'gridHelper';
  grid.material.opacity = 0.2;
  grid.material.transparent = true;
  scene.add(grid);
}

function addLights({ scene }) {
  const lightsGroup = new THREE.Group();
  lightsGroup.name = 'lights';
  scene.add(lightsGroup);

  const directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.name = 'directionalLight';
  directionalLight.position.set(1, 1, 1);
  lightsGroup.add(directionalLight);

  const ambientLight = new THREE.AmbientLight(0xffffff);
  ambientLight.name = 'ambientLight';
  ambientLight.intensity = 0.133;
  lightsGroup.add(ambientLight);
}

function loadCarModel(setCar) {
  const loader = new OBJLoader();
  loader.load(carModel, (obj) => setCar(obj));
}

function getBodyMaterial(carObject) {
  return carObject.children[0].material[0];
}

export { addAxis, addGrid, addGround, addLights, loadCarModel, getBodyMaterial };
