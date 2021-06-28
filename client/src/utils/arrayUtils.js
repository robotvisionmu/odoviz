// eslint-disable-next-line no-extend-native
Array.prototype.extend = function (other_array) {
  // You should include a test to check whether other_array really is an array
  // For more info, refer to https://stackoverflow.com/a/17368101/3125070
  other_array.forEach(function (v) {
    this.push(v);
  }, this);
};

function indexOfMin(arr) {
  if (arr.length === 0) {
    return -1;
  }

  let min = arr[0];
  let minIndex = 0;

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < min) {
      minIndex = i;
      min = arr[i];
    }
  }

  return minIndex;
}

export { indexOfMin };
