import React from 'react';

import ZyngaScroller from 'zynga/Scroller';
import TouchableArea from './TouchableArea';


const ScrollArea = React.createClass({
	componentWillMount : function () {
		this.reset(this.props.touchMode);
	},

	componentWillReceiveProps: function (nextProps) {
		if (nextProps.touchMode !== this.props.touchMode) {
			this.reset(nextProps.touchMode);
		}
	},

	componentWillUnmount() {
		clearTimeout(this._scrollTimer);
	},

	reset(touchMode) {
		this.scroller = new ZyngaScroller(touchMode ? this._handleScroll : this._doNothing);
		this._scrollTimer = null;
	},

	render : function () {
		if (!this.props.touchMode) {
			return this.props.children;
		}

		return (
			<TouchableArea scroller={this.scroller}>
				{this.props.children}
			</TouchableArea>
		);
	},

	_onContentDimensionsChange : function (tableWidth, tableHeight, contentWidth, contentHeight) {
		this.scroller.setDimensions(
			tableWidth,
			tableHeight,
			contentWidth,
			contentHeight
		);
	},

	_handleScroll : function (left, top) {
		if (this.props.onScrollStart && this._scrollTimer === null) {
			console.log('Touch scroll start, top: ' + top);
			this.props.onScrollStart(left, top);
		}

		if (this.props.onScrollEnd) {
			if (this._scrollTimer !== null) {
				clearTimeout(this._scrollTimer);
			}

			var self = this;
			this._scrollTimer = setTimeout(() => {
				if (!this.isMounted()) {
					return;
				}

				console.log('Touch scroll end, top: ' + top);
				self.props.onScrollEnd(left, top);
				this._scrollTimer = null;
			}, 200);
		}

		this.props.handleScroll(left, top);
	},

	_doNothing : function (left, top) {
		
	}
});

export default ScrollArea;
