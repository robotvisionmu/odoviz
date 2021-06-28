// Beware in many languages the modulo operation returns a value with
// the same sign as the dividend (like C, C++, C#, JavaScript, etc.
// We need this:
// 10 % 3 = 1
// -10 % 3 = 2
function unsignedMod(a, n) {
  return a - Math.floor(a / n) * n;
}

// returns smallest angle between source angle and target angle
// all angles are in radians
function getAngularDifferenceRadians(sourceAngle, targetAngle) {
  let diff = targetAngle - sourceAngle;
  diff = unsignedMod(diff + Math.PI, 2 * Math.PI) - Math.PI;
  return diff;
}

// returns smallest angle between source angle and target angle
// all angles are in degrees
function getAngularDifferenceDegrees(sourceAngle, targetAngle) {
  let diff = targetAngle - sourceAngle;
  diff = unsignedMod(diff + 180, 2 * 180) - 180;
  return diff;
}

export { getAngularDifferenceRadians, getAngularDifferenceDegrees };
