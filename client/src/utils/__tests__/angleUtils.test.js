import { getAngularDifferenceDegrees, getAngularDifferenceRadians } from 'utils/angleUtils';
import 'utils/numberUtils';

test('Get Smallest Angle between two headings in radians', () => {
  expect(getAngularDifferenceRadians(0.1, 0.2).round(1)).toBe(0.1);
  expect(getAngularDifferenceRadians(0.1, 0.2 + Math.PI * 2).round(1)).toBe(0.1);
  expect(getAngularDifferenceRadians(0.1, 0.2 - Math.PI * 2).round(1)).toBe(0.1);
  expect(getAngularDifferenceRadians(0.1 + Math.PI * 2, 0.2).round(1)).toBe(0.1);
  expect(getAngularDifferenceRadians(0.1 - Math.PI * 2, 0.2).round(1)).toBe(0.1);
  expect(getAngularDifferenceRadians(0.2, 0.1).round(1)).toBe(-0.1);
  expect(getAngularDifferenceRadians(0.2, 0.1 - Math.PI * 2).round(1)).toBe(-0.1);
  expect(getAngularDifferenceRadians(0.2, 0.1 + Math.PI * 2).round(1)).toBe(-0.1);
  expect(getAngularDifferenceRadians(0.2 + Math.PI * 2, 0.1).round(1)).toBe(-0.1);
  expect(getAngularDifferenceRadians(0.2 - Math.PI * 2, 0.1).round(1)).toBe(-0.1);

  expect(getAngularDifferenceDegrees(0.1, 0.2).round(1)).toBe(0.1);
  expect(getAngularDifferenceDegrees(0.1, 0.2 + 180 * 2).round(1)).toBe(0.1);
  expect(getAngularDifferenceDegrees(0.1, 0.2 - 180 * 2).round(1)).toBe(0.1);
  expect(getAngularDifferenceDegrees(0.1 + 180 * 2, 0.2).round(1)).toBe(0.1);
  expect(getAngularDifferenceDegrees(0.1 - 180 * 2, 0.2).round(1)).toBe(0.1);
  expect(getAngularDifferenceDegrees(0.2, 0.1).round(1)).toBe(-0.1);
  expect(getAngularDifferenceDegrees(0.2, 0.1 - 180 * 2).round(1)).toBe(-0.1);
  expect(getAngularDifferenceDegrees(0.2, 0.1 + 180 * 2).round(1)).toBe(-0.1);
  expect(getAngularDifferenceDegrees(0.2 + 180 * 2, 0.1).round(1)).toBe(-0.1);
  expect(getAngularDifferenceDegrees(0.2 - 180 * 2, 0.1).round(1)).toBe(-0.1);
});
