import easings from './utils/easings';
import touch from './gestures/touch';
import mouseDrag from './gestures/mouseDrag';

export default function(reference, calls) {

  const options = {
    scrollOverflowUp: true,
    scrollOverflowDown: true,
    scrollDuration: 500,
    scrollInterval: 18,
    scrollThrottle: 800,
  };

  const state = {
    totalElements: 0,
    lastElementPosition: 0,
    position: 0,
    prevPosition: 0,
    innerHeight: 0,
    scrollable: true,
  };

  const callbacks = {
    mount: null,
    update: null,
    scrollStart: null,
    scrollEnd: null,
  };

  const plugins = {
    touch: touch(scrollSmart),
  };

  ////////////////////////////////////////////////////
  //  LIFECYCLES
  ////////////////////////////////////////////////////

  const mount = function() {

    if (!reference.current.children.length) {
      console.warn('Scroller reference has no elements.');
      return false;
    }

    // Register elements
    registerElements();

    // Register listeners callbacks
    registerCallbacks(calls);

    // Update parameters
    updateInnerHeight();

    // Apply DOM modifications
    // Set overflow: hidden on body to hide scrollbar
    hideBodyOverflow();

    // Bind all necessary events
    addListeners();

    callEvent('mount');
  }

  const update = function() {
    const prevTotalElements = state.totalElements;
    registerElements();

    if (state.totalElements !== prevTotalElements) {
      scrollTop();
      callEvent('update');
    }
  }

  const unmount = function() {
    removeListeners();
  }

  ////////////////////////////////////////////////////
  //  EVENTS
  ////////////////////////////////////////////////////

  const addListeners = function() {
    window.addEventListener('resize', onResize);
    window.addEventListener('wheel', onWheel, {passive: true});
    console.log('Events binded!');
  }

  const removeListeners = function() {
    window.removeEventListener('resize', onResize);
    window.removeEventListener('wheel', onWheel);
    console.log('Events destroyed!');
  }

  ////////////////////////////////////////////////////
  //  LISTENERS
  ////////////////////////////////////////////////////

  const onWheel = function(e) {
    //e.preventDefault();

    if (!state.scrollable) { return; }
    state.scrollable = false;
    const timeout = setTimeout(clearState, options.scrollThrottle);

    const direction = getDirectionFromEvent(e);
    setDirection(direction);
    if (direction) {
      scrollDown();
    } else {
      scrollUp();
    }
  }

  const onResize = function(e) {
    updateInnerHeight();
    scroll(getPositionOffset());
  }

  const callEvent = function(name) {
    if (callbacks[name]) {
      callbacks[name](eventData());
    }
  }

  ////////////////////////////////////////////////////
  //  CORE SCROLLING FUNCTIONS
  ////////////////////////////////////////////////////

  function scrollSmart(offset) {
    const { position } = state;

    const prevOffset = getPositionOffset();
    const diff = offset - prevOffset;

    let targetPosition;
    if (Math.abs(diff) > 80) {
      targetPosition = offset > prevOffset ? position + 1 : position - 1;
    } else {
      targetPosition = position;
    };
    changePositionTo(targetPosition);
    scrollToNewPosition(offset);
  }

  function scrollToClosest(offset) {
    const targetPosition = Math.round(offset / getInnerHeight());
    changePositionTo(targetPosition);
    scrollToNewPosition(offset);
  }

  function scrollToNewPosition(offset) {
    const prevOffset = offset || getPositionOffset(state.prevPosition);
    const targetOffset = getPositionOffset();
    smoothScroll(prevOffset, targetOffset)
  }

  function smoothScroll(offsetFrom, offsetTo) {
    let increment = 0;
    const { scrollInterval, scrollDuration } = options;
    const length = offsetTo - offsetFrom;

    const scrollLoop = function() {
      increment += scrollInterval;
      const progression = increment / scrollDuration;
      const offset = offsetFrom + getEasingOffset('easeInOutCubic', progression, length);

      if (increment < scrollDuration) {
        setTimeout(scrollLoop, scrollInterval);
        scroll(offset);
      } else {
        scroll(offsetTo);
        callEvent('scrollEnd');
      }
    }

    callEvent('scrollStart');
    scrollLoop();
  }

  function scroll(value) {
    window.scrollTo(0, value);
  }

  const getEasingOffset = function(type, float, value) {
    if (easings && easings[type]) {
      const modificator = easings[type](float);
      return value * modificator;
    }
    return null;
  }

  ////////////////////////////////////////////////////
  //  SCROLL FUNCTIONS (API CALLBACKS)
  ////////////////////////////////////////////////////

  const scrollUp = () => {
    const { position } = state;
    if (position > 0) {
      changePositionTo(position - 1);
      scrollToNewPosition();
    } else if (position === 0 && options.scrollOverflowUp) {
      scrollBottom();
    }
  }

  const scrollDown = () => {
    const { position, lastElementPosition } = state;
    if (position < lastElementPosition) {
      changePositionTo(position + 1);
      scrollToNewPosition();
    } else if (position === lastElementPosition && options.scrollOverflowDown) {
      scrollTop();
    }
  }

  const scrollTop = () => {
    changePositionTo(0);
    scrollToNewPosition();
  }

  const scrollBottom = () => {
    changePositionTo(state.lastElementPosition);
    scrollToNewPosition();
  }

  ////////////////////////////////////////////////////
  //  STATE MANAGEMENTS
  ////////////////////////////////////////////////////

  const clearState = function() {
    state.scrollable = true;
    state.direction = null;
  }

  const setDirection = function(bool) {
    state.direction = bool ? 1 : 0;
  }

  ////////////////////////////////////////////////////
  //  OPTION SETTERS
  ////////////////////////////////////////////////////

  const setScrollDuration = function(int) {
    options.scrollDuration = int < 100 ? 100 : int > 5000 ? 5000 : int;
  }

  const allowMouseDrag = function() {
    plugins.mouseDrag = mouseDrag(scrollSmart);
  }

  ////////////////////////////////////////////////////
  //  MISC.
  ////////////////////////////////////////////////////

  const isInt = function(value) {
    let x;
    return isNaN(value) ? !1 : (x = parseFloat(value), (0 | x) === x);
  }

  const getPositionOffset = function(p) {
    const pos = isInt(p) ? p : state.position;
    return pos * state.innerHeight;
  }

  const registerElements = function() {
    const countElements = reference.current.children.length;
    state.totalElements = countElements;
    state.lastElementPosition = countElements - 1;
  }

  const registerCallbacks = function(obj) {
    for (let name in obj) {
      if (callbacks.hasOwnProperty(name) && typeof obj[name] === 'function') {
        callbacks[name] = obj[name];
      }
    }
  }

  const changePositionTo = function(int) {
    const lastElemPos = state.lastElementPosition;
    const p = int > lastElemPos ? lastElemPos : int;
    changePosition(p);
  }

  const changePositionBy = function(int) {
    const { position, lastElementPosition } = state;
    let p = position + int;

    if (p < 0) {
      p = options.scrollOverflowUp ? lastElementPosition : 0;
    } else if (p > lastElementPosition) {
      p = options.scrollOverflowDown ? 0 : lastElementPosition;
    }
    changePosition(p);
  }

  const changePosition = function (int) {
    if (int !== state.position) {
      state.prevPosition = state.position;
      state.position = int;
    }
  }

  const hideBodyOverflow = function() {
    document.body.style.overflow = "hidden";
  }

  const updateInnerHeight = function() {
    state.innerHeight = window.innerHeight;
  }

  const getInnerHeight = function() {
    return state.innerHeight;
  }

  const getDirectionFromEvent = function(e) {
    return e.deltaY >= 0;
  }

  const eventData = function() {
    const { position, prevPosition, innerHeight, totalElements } = state;
    return {
      options: {...options},
      api: apiFunctions,
      data: {
        position,
        prevPosition,
        innerHeight,
        totalElements,
        currentPageOffset: window.pageYOffset,
      }
    }
  }

  const apiFunctions = {
    scrollUp,
    scrollDown,
    scrollTop,
    scrollBottom,
  };

  ////////////////////////////////////////////////////
  //  START
  ////////////////////////////////////////////////////

  return {
    api: apiFunctions,
    mount,
    update,
    unmount,
    registerCallbacks,
    setScrollDuration,
    allowMouseDrag,
  }
}
