import oxfordRobotcarParser from '../parsers/oxfordRobotcarParser';
import { addDeltaToCars, getDistancesAndDeltaAngles } from '../threedView/scripts/sample';
import { indexOfMin } from '../utils/arrayUtils';
import { downloadJson } from '../utils/downloadUtils';
import { getValue } from '../utils/parseUtils';

const { getImgPath, parseFn } = oxfordRobotcarParser;

async function matchPosesFn(matchFilePath, queryCameras, updateProgressCallback) {
  const file = await fetch(`/files/${matchFilePath}`);
  const data = await file.text();
  const { cameras } = await parseFn(data, matchFilePath);

  // Check if radians are between 0 and 2 * Math.PI
  // let angles = queryCameras.map(camera => camera.rotation.z);
  // console.debug('Min and max angles', Math.min(...angles), Math.max(...angles));

  let refCameras = [];

  const alpha = 1;
  const beta = 12;
  const lossThreshold = 10;
  const adaptiveBetaDistanceThreshold = 10;
  const adaptiveBetaAngleThreshold = 15;
  let validMatchIndex = 0;

  for (let i = 0; i < queryCameras.length; i++) {
    // Update Progress
    const progressFraction = (i + 1) / queryCameras.length;
    updateProgressCallback(progressFraction);

    const queryCamera = queryCameras[i];
    const distanceLosses = [];
    const headingLosses = [];
    const losses = [];
    const adaptiveBetas = [];

    for (let j = 0; j < cameras.length; j++) {
      const camera = cameras[j];
      const distanceLoss = Math.abs(camera.gps.distanceTo(queryCamera.gps));
      const headingLoss = Math.abs(camera.rotation.z - queryCamera.rotation.z) / Math.PI;
      distanceLosses.push(distanceLoss);
      headingLosses.push(headingLoss);

      // for performance reasons,
      // push large number for loss
      // for any pose > 300m distance
      // add || camera.hasOwnProperty("samplingIndex") to if
      // to make loss of already selected indices to be higher
      if (distanceLoss > 300) {
        adaptiveBetas.push(beta);
        losses.push(999999);
        continue;
      }

      // use adaptive beta
      // when the car is moving fast set lower beta
      // otherwise stricter beta, i.e, angles are important
      let adaptiveBeta = beta;

      // // adaptiveBeta based only on next distance
      // // adaptiveBeta linearly drops down to 1 until adaptiveBetaDistanceThreshold
      // let nextDistance = getValue(queryCamera, ["delta", "next", "distance"]);
      // if(nextDistance < adaptiveBetaDistanceThreshold) adaptiveBeta = ((beta - 1) * (1 - (nextDistance / adaptiveBetaDistanceThreshold))) + 1;
      // if(nextDistance > adaptiveBetaDistanceThreshold) adaptiveBeta = 1;
      // adaptiveBetas.push(adaptiveBeta);

      // adaptiveBeta based on sum of angles over a certain distance adaptiveBetaDistanceThreshold
      const nextAngle = deltaAngleUntilDistance(i, adaptiveBetaDistanceThreshold, queryCameras);
      if (nextAngle < adaptiveBetaDistanceThreshold)
        adaptiveBeta = (beta - 0.2) * (nextAngle / adaptiveBetaAngleThreshold) + 0.2;
      if (nextAngle > adaptiveBetaAngleThreshold) adaptiveBeta = beta;
      adaptiveBetas.push(adaptiveBeta);

      const currentLoss = alpha * distanceLoss + adaptiveBeta * headingLoss;
      losses.push(currentLoss);
    }

    // find index of car with least loss
    const minIndex = indexOfMin(losses);
    const currentLoss = losses[minIndex];

    // pick if loss is less than the threshold
    if (currentLoss <= lossThreshold) {
      const chosenCamera = cameras[minIndex];
      const chosenCameraHasBeenSelected = chosenCamera.hasOwnProperty('samplingIndex');
      if (chosenCameraHasBeenSelected) {
        console.log(
          `${chosenCamera.samplingIndex} has already selected ${cameras[minIndex].index}, but ${i} matched the same`
        );
        console.log(
          `For ${chosenCamera.samplingIndex}  ${chosenCamera.matchingLoss.loss}; For ${i}, loss is ${currentLoss}`
        );
        if (chosenCamera.matchingLoss.loss < currentLoss) continue;
      }

      chosenCamera.matchingForSamplingIndex = i;
      chosenCamera.matchingLoss = {
        distance: distanceLosses[minIndex],
        heading: headingLosses[minIndex],
        alpha: alpha,
        beta: adaptiveBetas[minIndex],
        loss: currentLoss,
        valid: currentLoss <= lossThreshold,
      };

      chosenCamera.validMatchIndex = validMatchIndex++;
      if (!chosenCameraHasBeenSelected) refCameras.push(chosenCamera);
    }
  }

  // Add delta to matched cars
  const { distances, deltaAngles } = getDistancesAndDeltaAngles(refCameras);
  refCameras = addDeltaToCars(refCameras, distances, deltaAngles);

  return refCameras;
}

function exportPoses(queryCars, matchedCarsArray) {
  const classes = {};

  // add all query cars
  for (let i = 0; i < queryCars.length; i++) classes[i] = [queryCars[i]];

  // loop though matchedCarsArray
  for (let matchedCarIndex = 0; matchedCarIndex < matchedCarsArray.length; matchedCarIndex++) {
    const matchedCars = matchedCarsArray[matchedCarIndex];

    // loop through all ref cars
    // and add them based on query index inside
    for (let i = 0; i < matchedCars.length; i++) {
      const matchedCar = matchedCars[i];
      classes[matchedCar.data.matchingForSamplingIndex].push(matchedCar);
    }
  }

  const classesWithPath = {};
  Object.entries(classes).forEach(([key, values]) => {
    classesWithPath[key] = [];
    values.forEach((car) => {
      const imagePath = getImgPath(car.data.image.stereo_centre, car.parent.name);
      classesWithPath[key].push(imagePath);
    });
  });

  downloadJson(classesWithPath, 'classes_and_imagePaths');
}

function deltaAngleUntilDistance(index, distanceThreshold, cars) {
  let distanceAccumulated = 0;
  let deltaAngleAccumulated = 0;
  for (let i = index; i < cars.length - 1 && distanceAccumulated <= distanceThreshold; i++) {
    const car = cars[i];
    const { distance, angle } = getValue(car, ['delta', 'next']);
    distanceAccumulated += distance;
    deltaAngleAccumulated += angle;
  }
  return deltaAngleAccumulated;
}

export { matchPosesFn, exportPoses };
