// eslint-disable-next-line no-extend-native
Number.prototype.round = function (digits = 0) {
  return +(Math.round(this.valueOf() + `e+${digits}`) + `e-${digits}`);
};

// p should be a value between 0 and 1
function percentile(arr, p) {
  // Dont remove the callback
  // https://stackoverflow.com/q/55523587/3125070
  arr.sort((a, b) => a - b);

  const pos = (arr.length - 1) * p;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (arr[base + 1] !== undefined) return arr[base] + rest * (arr[base + 1] - arr[base]);
  else return arr[base];
}

export { percentile };
