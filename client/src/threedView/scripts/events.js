function addEventListeners(renderer, variables, functions) {
  // include all variables inside variables object
  // pass objects to pass by reference
  // functions can update original values
  // do NOT do let { someVar } = variables
  // which will alter only the local copy

  const { togglePinned } = functions;

  // right click to pin, but not during right click and drag
  // https://stackoverflow.com/a/45098107/3125070
  renderer.domElement.addEventListener(
    'mousemove',
    mouseMoveListener.bind(this, variables.mousePosition, renderer.domElement),
    false
  );
  renderer.domElement.addEventListener('mousedown', (e) => {
    if (e.button === 2)
      // if right clicked
      renderer.domElement.addEventListener('mousemove', rightClickAndDragged.bind(this, variables));
  });

  renderer.domElement.addEventListener('mouseup', (e) => {
    if (e.button === 2) {
      if (variables.isRightClickAndDragged) e.target.addEventListener('contextmenu', preventClick);
      else {
        e.target.removeEventListener('contextmenu', preventClick);
        togglePinned();
      }
      variables.isRightClickAndDragged = false;
      renderer.domElement.removeEventListener('mousemove', rightClickAndDragged.bind(this, variables));
    } else renderer.domElement.removeEventListener('mousemove', rightClickAndDragged.bind(this, variables));
  });
}

function rightClickAndDragged(variables, e) {
  // for some reason, e.button does not appear as two
  // when right click and dragged, use e.buttons
  variables.isRightClickAndDragged = e.buttons === 2;
}

function preventClick(e) {
  e.preventDefault();
  e.stopImmediatePropagation();
}

function mouseMoveListener(mousePosition, domElement, event) {
  const topOffset = domElement.getBoundingClientRect().top;
  const leftOffset = domElement.getBoundingClientRect().left;

  // update the mouse variable
  mousePosition.x = ((event.clientX - leftOffset) / domElement.width) * 2 - 1;
  mousePosition.y = -((event.clientY - topOffset) / domElement.height) * 2 + 1;
}

export { addEventListeners };
