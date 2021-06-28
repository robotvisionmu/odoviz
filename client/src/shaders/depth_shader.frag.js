/* eslint import/no-webpack-loader-syntax: off */
export default `
uniform sampler2D map;
varying vec2 vUv;

void main() {
  vec4 color = texture2D( map, vUv );
  gl_FragColor = vec4( color.r, color.g, color.b, 1.0 );

  // // for debugging, show in pixels in red
  // if(vUv[0] < -1.0 || vUv[0] > 1.0) {
  //   gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
  // }

}
`;
