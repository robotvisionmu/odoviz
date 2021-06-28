// eslint-disable-next-line no-extend-native
String.prototype.toTitleCase = function () {
  return this.valueOf().replace(/([^\W_]+[^\s-]*) */g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};
