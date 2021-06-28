function isStashPresent(name) {
  return localStorage.getItem(name) != null;
}

function saveJsonInStash(jsonObj, name) {
  window.localStorage.setItem(name, JSON.stringify(jsonObj));
  console.debug(`Save ${name} in stash successful`, jsonObj);
}

function loadJsonFromStash(name, printDebugInfo = true) {
  let loadedJsonObj = null;
  try {
    const loadedItem = window.localStorage.getItem(name);
    loadedJsonObj = JSON.parse(loadedItem);
  } catch (e) {
    console.error(e);
  }
  if (printDebugInfo) console.debug(`Load ${name} from stash successful`, loadedJsonObj);
  return loadedJsonObj;
}

export { saveJsonInStash, loadJsonFromStash, isStashPresent };
