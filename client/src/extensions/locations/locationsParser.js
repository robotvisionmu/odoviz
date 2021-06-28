function getImageIndexToLocation(data) {
  // Return if empty
  if (data && data.length <= 0) {
    console.error('File is empty');
    return {};
  }

  // Read line by line
  const dataLines = data.split(/\r\n|\n/);
  console.debug('Total lines in locations file:', dataLines.length - 1);

  const imageIndexToLocation = {};
  for (let i = 0; i < dataLines.length - 1; i++) {
    const line = dataLines[i];
    if (line.length === 0) continue;
    const lineTokens = line.split('\t');
    const imageIndex = parseInt(lineTokens[0]);
    const locationIndex = parseInt(lineTokens[1]);
    imageIndexToLocation[imageIndex] = locationIndex;
  }

  return imageIndexToLocation;
}

function getLoops(data) {
  // Return if empty
  if (data && data.length <= 0) {
    console.error('File is empty');
    return {};
  }

  // Read line by line
  const dataLines = data.split(/\r\n|\n/);
  console.debug('Total lines in loops file:', dataLines.length - 1);

  const loops = {};
  for (let i = 0; i < dataLines.length - 1; i++) {
    const line = dataLines[i];
    let indices = [];
    if (line.length > 0) indices = line.split('\t');
    loops[i] = indices.map((e) => parseInt(e));
  }

  return loops;
}

export { getImageIndexToLocation, getLoops };
