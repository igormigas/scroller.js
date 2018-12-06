export default function(scrollCallback) {
  const cords = {};

  addListeners();

  function onMouseDown(e) {
    registerTopOffset(getTopOffset());
    registerStartDelta(getDeltaFromEvent(e));
    listenMouseMovement();
  }

  function onMouseMove(e) {
    registerCurrentDelta(getDeltaFromEvent(e));
    activeScroll();
  }

  function onMouseUp(e) {
    unlistenMouseMovement();
    if (0 !== getDelta()) {
      scrollCallback(getCurrentOffset());
    };
  }

  function activeScroll() {
    window.scrollTo(0, getCurrentOffset());
  }

  function getTopOffset() {
    return window.pageYOffset;
  }

  function getDeltaFromEvent(e) {
    return e.clientY;
  }

  function registerTopOffset(i) {
    cords.topOffset = i;
  }

  function registerStartDelta(i) {
    cords.deltaStart = i;
    cords.deltaCurrent = i;
  }

  function registerCurrentDelta(i) {
    cords.deltaCurrent = i;
  }

  function getDelta() {
    return cords.deltaStart - cords.deltaCurrent;
  }

  function getCurrentOffset() {
    return cords.topOffset + getDelta();
  }

  function addListeners() {
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousedown', onMouseDown);
  }

  function removeListeners() {
    window.removeEventListener('mouseup', onMouseUp);
    window.removeEventListener('mousedown', onMouseDown);
  }

  function listenMouseMovement() {
    window.addEventListener('mousemove', onMouseMove);
  }

  function unlistenMouseMovement() {
    window.removeEventListener('mousemove', onMouseMove);
  }

  return {
    removeListeners,
  }
}
