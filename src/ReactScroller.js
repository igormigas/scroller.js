import React from 'react';
import PropTypes from 'prop-types';
import Scroller from './scroller';

class ReactScroller extends React.Component {

	constructor(props) {
		super(props);
		const { onMount, onUpdate, onScrollStart, onScrollEnd } = this.props;

		this.reference = React.createRef();
		this.scroller = Scroller(this.reference);
		this.scroller.registerCallbacks({
			mount: onMount,
			update: onUpdate,
			scrollStart: onScrollStart,
			scrollEnd: onScrollEnd,
		});
		this.scroller.allowMouseDrag();
	}

	componentDidMount() {
		this.scroller.mount();
	}

	componentDidUpdate() {
		this.scroller.update();
	}

	componentWillUnmount() {
		this.scroller.unmount();
	}

	render() {
		const children = this.props.children;
		return (
			<div ref={this.reference}>
				{ typeof children === 'function' ? children(this.scroller.api) : children }
			</div>
		);
	};
};

ReactScroller.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.element),
		PropTypes.element,
		PropTypes.func
	]).isRequired,
	onMount: PropTypes.func,
	onUpdate: PropTypes.func,
	onScrollStart: PropTypes.func,
	onScrollEnd: PropTypes.func
};

export default ReactScroller;
