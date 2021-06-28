import TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';
import { Vector3 } from 'three';

import { update } from './raycast';

function startRender(props, parent) {
  const { scene, camera, renderer, controls } = props;
  const { setSelectedObject, setIsPinned } = props;

  let panStarted = false;
  let cars = [];
  const clock = new THREE.Clock();
  let toLookAt = new Vector3(0, 0, 0);
  let tween = null;

  function animate() {
    // if animate button is turned on
    if (parent.props.animate) {
      const animationDuration = parent.props.animationDuration;
      const controlsObject = parent.props.controls.object;
      const selectedObject = parent.props.selectedObject;

      const carsGroup = scene.getObjectByName('cars');
      if (carsGroup) cars = carsGroup.children[0].children;

      let currentIndex;
      if (selectedObject != null && selectedObject.data != null && selectedObject.data.samplingIndex != null)
        currentIndex = selectedObject.data.samplingIndex;
      else currentIndex = 0;

      if (!panStarted) {
        // execute first-time before loop
        lookAtCar(cars[currentIndex], cars[currentIndex + 1], clock, animationDuration);
        panStarted = true;
        setIsPinned(true);
      } else {
        // actual loop
        if (clock.getElapsedTime() > animationDuration / 1000 && currentIndex !== cars.length - 2) {
          currentIndex = currentIndex + 1;
          lookAtCar(cars[currentIndex], cars[currentIndex + 1], clock, animationDuration);
        }
      }

      // do NOT set this in onUpdate of tween
      // keep looking at the car in all animation frames
      // to enable smooth rotation while looking at the car
      // don't use camera.lookAt(toLookAt); use controls.target instead
      // refer to https://stackoverflow.com/a/37483235/3125070
      if (controlsObject) {
        controlsObject.target.set(toLookAt.x, toLookAt.y, toLookAt.z);
        controlsObject.update();
      }

      // if animate button is turned off
    } else {
      if (tween) tween.stop();
      if (panStarted) {
        panStarted = false;
        setIsPinned(false);
      }
    }

    // core animation cycle
    requestAnimationFrame(animate);
    controls.object.update();
    TWEEN.update();
    update(props, parent);
    renderer.render(scene, camera);
  }

  animate();

  function lookAtCar(car, nextCar, clock, animationDuration) {
    toLookAt = car.position.clone();
    if (tween) tween.stop();
    tween = new TWEEN.Tween(toLookAt).to(nextCar.position, animationDuration).start();
    clock.start();
    selectAndHighlightCar(car);
  }

  function selectAndHighlightCar(car) {
    const previouslySelectedCar = parent.props.selectedObject;
    if (previouslySelectedCar != null) removeHighlight(previouslySelectedCar);

    const selectedObject = car;
    highlightCar(selectedObject);
    setSelectedObject(selectedObject);
  }
}

function highlightCar(carObject) {
  carObject.currentHex = carObject.children[13].material.color.getHex();
  carObject.children[13].material.color.setHex(0x000000);
}

function removeHighlight(carObject) {
  if (carObject.currentHex != null) carObject.children[13].material.color.setHex(carObject.currentHex);
}

export default startRender;
