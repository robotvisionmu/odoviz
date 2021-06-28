import * as THREE from 'three';

import { getAngularDifferenceDegrees, getAngularDifferenceRadians } from '../../utils/angleUtils';

function sample(cars, everyUnit = 0, everyDeg = Infinity) {
  if (cars == null || cars.length === 0) return cars;
  if (everyUnit === 0 && everyDeg === Infinity) return cars;

  const indices = getSampledIndices(cars, everyUnit, everyDeg);
  let carsSampled = cars.filter((car, i) => indices.includes(i));

  carsSampled = carsSampled.map((car, i) => {
    car.samplingIndex = i;
    return car;
  });
  const { distances, deltaAngles } = getDistancesAndDeltaAngles(carsSampled);
  carsSampled = addDeltaToCars(carsSampled, distances, deltaAngles);

  console.debug('Before/After Sampling: ', cars.length, carsSampled.length);
  return carsSampled;
}

function getSampledIndices(cars, everyUnit = 0, everyDeg = Infinity) {
  const indices = [];
  let distanceAccumulated = 0;
  let deltaAngleAccumulated = 0;

  indices.push(0);
  const { distances, deltaAngles } = getDistancesAndDeltaAngles(cars);
  for (let i = 0; i < distances.length; i++) {
    const distance = distances[i];
    const deltaAngle = deltaAngles[i];

    deltaAngleAccumulated += deltaAngle;
    distanceAccumulated += distance;

    // for recursive solution check commit 4b9a0f461ff4e337253a2823bb7853e1eb4544e7
    if (distanceAccumulated >= everyUnit || deltaAngleAccumulated > everyDeg) {
      // Add i+1 not i // if distance[0] > everyUnit, add cars[1]
      indices.push(i + 1);

      deltaAngleAccumulated = 0;
      distanceAccumulated = 0;
    }
  }

  return indices;
}

function getDistancesAndDeltaAngles(cars) {
  const distances = [];
  const deltaAngles = [];
  for (let i = 0; i < cars.length - 1; i++) {
    const car = cars[i];
    const carNext = cars[i + 1];
    if (car.hasOwnProperty('gps')) {
      distances.push(car.gps.distanceTo(carNext.gps));
      deltaAngles.push(Math.abs(getAngularDifferenceDegrees(car.gps.heading, carNext.gps.heading)));
    } else {
      distances.push(car.position.distanceTo(carNext.position));
      if (car.hasOwnProperty('rotation'))
        deltaAngles.push(
          Math.abs(THREE.Math.radToDeg(getAngularDifferenceRadians(car.rotation.z, carNext.rotation.z)))
        );
      else deltaAngles.push(0);
    }
  }
  return { distances, deltaAngles };
}

function addDeltaToCars(cars, distances, deltaAngles) {
  for (let i = 0; i < cars.length; i++) {
    const camera = cars[i];
    const delta = {};

    // fill delta previous except for first car
    if (i !== 0) {
      delta.previous = {
        distance: distances[i - 1],
        angle: deltaAngles[i - 1],
      };
    }

    // fill delta except for last car
    if (i !== cars.length - 1) {
      delta.next = {
        distance: distances[i],
        angle: deltaAngles[i],
      };
    }

    if (Object.keys(delta).length !== 0) camera.delta = delta;
  }
  return cars;
}

export { sample, getDistancesAndDeltaAngles, addDeltaToCars };
