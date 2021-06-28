function handleClickLink(e) {
  const url = e.currentTarget.getAttribute('url');
  window.open(url, '_blank');
}

function getGmapsLink(latitude, longitude) {
  // Reference https://stackoverflow.com/a/44477650/3125070
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
}

function getGmapsStreetViewLink(latitude, longitude, heading) {
  // Reference https://stackoverflow.com/a/56870166/3125070
  if (heading)
    return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${latitude},${longitude}&heading=${heading}&pitch=0&fov=90}`;
  else return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${latitude},${longitude}&pitch=0&fov=90}`;
}

export { handleClickLink, getGmapsLink, getGmapsStreetViewLink };
