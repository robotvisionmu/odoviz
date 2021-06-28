import * as THREE from 'three';

import viridis from 'assets/viridis.png';
import { getUpdatedPosition } from 'reducers/settings/offset/offsetActions';
import frag from 'shaders/depth_shader.frag.js';
import vert from 'shaders/depth_shader.vert.js';

import { percentile } from '../../utils/numberUtils';

function highlightPoints(props, parent, selectedObject) {
  const { scene, renderer } = props;
  const { updateHighlightPoints } = parent;
  // props is an old snapshot, use only for camera, scene and renderer
  // use parent.props to get updated values
  const { highlightPointSize, setSelectedObject, points } = parent.props;
  const { data } = selectedObject;

  const texture = new THREE.TextureLoader().load(viridis);
  const dotGeometry = new THREE.Geometry();

  const selectedPoints = points.filter((point) =>
    point.measurements.some((measurement) => measurement[0] === data.index)
  );
  selectedPoints.map((point) => dotGeometry.vertices.push(getUpdatedPosition(point.position, true)));

  // calculate 90th percentile
  const pointsArray = { xPoints: [], yPoints: [], zPoints: [] };
  selectedPoints.forEach((point) => {
    const offsetAppliedPosition = getUpdatedPosition(point.position, true);
    pointsArray.xPoints.push(Math.abs(offsetAppliedPosition.x));
    pointsArray.yPoints.push(Math.abs(offsetAppliedPosition.y));
    pointsArray.zPoints.push(Math.abs(offsetAppliedPosition.z));
    // // does not work with scalePosition
    // pointsArray.xPoints.push(Math.abs(point.position.x));
    // pointsArray.yPoints.push(Math.abs(point.position.y));
    // pointsArray.zPoints.push(Math.abs(point.position.z));
  });
  const localMax = {
    x: percentile(pointsArray.xPoints, 0.9),
    y: percentile(pointsArray.yPoints, 0.9),
    z: percentile(pointsArray.zPoints, 0.9),
  };

  // let zMax = Math.max(...selectedPoints.map(point => Math.abs(point.displayPosition.z)));
  // console.log({localMax, zMax});

  // // check outlier ratio
  // outliers = selectedPoints.map(point => {
  //   if(Math.abs(point.displayPosition.z / localMax.z) > 1) return point;
  // }).filter(e => e!=null);
  // console.log(outliers.length, selectedPoints.length);

  const dotMaterial = new THREE.ShaderMaterial({
    uniforms: {
      map: { value: texture },
      width: { value: renderer.width },
      height: { value: renderer.width },
      normX: { value: localMax.x },
      normY: { value: localMax.y },
      normZ: { value: localMax.z },
      currentX: { value: selectedObject.position.x },
      currentY: { value: selectedObject.position.y },
      currentZ: { value: selectedObject.position.z },
      pointSize: { value: highlightPointSize },
    },
    vertexShader: vert,
    fragmentShader: frag,
  });

  const dot = new THREE.Points(dotGeometry, dotMaterial);
  dot.name = 'highlightedPoints';
  dot.data = selectedPoints;
  // applyOffsetsToPointCloud(dot);

  scene.add(dot);

  updateHighlightPoints(dot);
  setSelectedObject(selectedObject);

  return selectedPoints;
}

function removeHighlightedPoints({ scene }, { updateHighlightPoints, highlightedPoints }) {
  scene.remove(highlightedPoints);
  updateHighlightPoints(null);
}

function resetHighlightedObject({ scene }, { updateHighlightPoints, highlightedPoints }, highlightedObject) {
  highlightedObject.children[13].material.color.setHex(highlightedObject.currentHex);
  removeHighlightedPoints({ scene }, { updateHighlightPoints, highlightedPoints });
}

export { removeHighlightedPoints, highlightPoints, resetHighlightedObject };
