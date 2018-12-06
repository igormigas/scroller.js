export default function(scrollCallback) {
	const cords = {};

  addListeners();

  function onTouchStart(e) {
    console.warn('onTouchStart');
    console.warn(e);
    registerTopOffset(getTopOffset());
    registerStartCord(getCordFromEvent(e));
  }

  function onTouchMove(e) {
  	e.preventDefault();
    registerCurrentCord(getCordFromEvent(e));
    activeScroll();
  }

  function onTouchEnd(e) {
    //unlistenMouseMovement();
    console.warn('onTouchEnd');
    console.warn(e);
    if (0 !== getDelta()) {
      scrollCallback(getCurrentOffset());
    };
  }

  function registerTopOffset(i) {
    cords.topOffset = i;
  }

  function registerStartCord(i) {
    cords.deltaStart = i;
    cords.deltaCurrent = i;
  }

  function registerCurrentCord(i) {
    cords.deltaCurrent = i;
  }

  function activeScroll() {
    window.scrollTo(0, getCurrentOffset());
  }

  function getTopOffset() {
    return window.pageYOffset;
  }

  function getCordFromEvent(e) {
    return e.changedTouches[0].clientY;
  }

  function getDelta() {
    return cords.deltaStart - cords.deltaCurrent;
  }

  function getCurrentOffset() {
    return cords.topOffset + getDelta();
  }

  function addListeners() {
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
  }

  function removeListeners() {
    window.removeEventListener('touchstart', onTouchStart);
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('touchend', onTouchEnd);
  }

  return {
    removeListeners,
  }
}


  /*
  window.addEventListener('touchstart', (e) => {
    console.log('touchstart', e);
  });
  window.addEventListener('touchmove', (e) => {
    console.log('touchmove', e);
  });
  window.addEventListener('touchend', (e) => {
    console.log('touchend', e);
  });
  window.addEventListener('touchcancel', (e) => {
    console.log('touchcancel', e);
  });
  window.addEventListener('click', (e) => {
    console.log('click', window.innerHeight, e);
  });
  */
