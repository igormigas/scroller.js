<div align="center">
<h1>Scroller.js</h1>
<em>A small JavaScript library for creating slide-like vertical scrolling effect in React environment.</em>
</div>

## Why
Why creating this script when Fullpage and similar exist?

Scroller.js was created as an additon to specific project and for self-education purposes. Developing it lets me better understand whole process and optimisation of written scripts.

Although being inspired by Fullpage, none of its code was ever directly used or rewritten.

## Possibilities
- slide-like scrolling effect (desktop only, currently slides can have only viewport height)
- callbacks for init, start and end of scrolling (listeners) with event data
- simple api with manual scrolling functions
- scroll speed adjustment

## Todo
- touch events for mobile support
- perspective and scale effects for elements' childs
- [API] scrolling to specific element
- tests

## Installation

**npm**

```shell
$ npm install scroller.js
```

**JS React script**

```javascript
// ES6 syntax
// Component name may have any name as it is default import
import ReactScroller from 'scroller.js';
```

## Usage
#### Basic
To see the effect of the scroller, all you need to do is wrap your elements with imported component. Scroller.js will treat them as slides and stretch them so each covers the viewport.

```jsx
import React from 'react';
import ReactScroller from 'scroller.js';

const Component = (props) => {
  return (
    <ReactScroller>
      <div>
        <section>
          Section 1
        </section>
        <section>
          Section 2
        </section>
        <section>
          Section 3
        </section>
        more sections...
      </div>
    </ReactScroller>
  );
}
```

#### Custom listeners

By passing custom callback functions, you can create simple listeners and use specific event data.

```jsx
import React from 'react';
import ReactScroller from 'scroller.js';

const Component = (props) => {

  const onScrollInit = (e) => {
    // Initial callback
    // Get initial settings if necessary
  }

  const onScrollStart = (e) => {
    // Example: get next element id and store it in Redux for further use.
    // const currentSlide = e.position;
  }

  const onScrollEnd = (e) => {
    // Make some other magic after scrolling is done
  }

  return (
    <ReactScroller
      onScrollInit={this.onScrollInit}
      onScrollStart={this.onScrollStart}
      onScrollEnd={this.onScrollEnd}
    >
      <div>
        // sections..
      </div>
    </ReactScroller>
  );
}
```
#### Controls
Wrapping your elements into arrow function gives you simple api with more possibilities.

```jsx
import React from 'react';
import ReactScroller from 'scroller.js';

const Component = (props) => {
  return (
    <ReactScroller>
      {api => (
        <div>
          <section>
            Section 1
            <button onClick={api.scrollBottom}>Scroll to the bottom!</button>
          </section>
          <section>
            Section 2
            <button onClick={api.scrollDown}>Scroll to the first slide!</button>
          </section>
          <section>
            Section 3
            <button onClick={api.scrollUp}>Scroll up!</button>
          </section>
          more sections...
        </div>
      )}
    </ReactScroller>
  );
}
```

## License
The code is available under the MIT License.
