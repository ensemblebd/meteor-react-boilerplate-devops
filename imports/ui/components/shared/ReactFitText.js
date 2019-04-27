/*
 * React FitText
 * https://github.com/gianu/react-fittext
 *
 * A port of the jQuery plugin: http://github.com/davatron5000/FitText.js
 *
 * Released under the MIT license
 * http://gianu.mit-license.org
 */
'use strict';

import React from 'react';
import ReactPropTypes from 'prop-types';
import {CRequireAuth} from "./AuthorizeComponents";

// Map from node to options
const nodes = new Map();

function updateElementStyle(element, options, width) {
    let el = $(element);
    let current_text=el.text();
    let current_size=parseFloat(getComputedStyle(element).fontSize);
    let current_spacing=parseFloat(getComputedStyle(element).letterSpacing);
    let current_font = current_size+'px '+el.css('font-family');
    let actual_size=0;
    let magic = 10;
    if (options.tryFitActual && typeof(auto_font_box)!=='undefined') {
        actual_size = auto_font_box.css({
            'font': current_font,
            'letter-spacing': el.css('letter-spacing')
        }).text(current_text).width();
        let per_char_size = auto_font_box.text('W').width();
        let assumed_pixel_per_char = per_char_size+(current_spacing/2);
        magic += (actual_size/assumed_pixel_per_char);
    }
    let result = width / (options.compressor * magic);
    result = Math.min(Math.max(result, options.minFontSize), options.maxFontSize);

    element.style.fontSize = `${result}px`;
}

let updateQueued = false;

function onBodyResize() {
    updateQueued = true;
    const widths = [];
    nodes.forEach((options, element) => {
        widths.push(element.offsetWidth);
    });
    let i = 0;
    nodes.forEach((options, element) => {
        updateElementStyle(element, options, widths[i]);
        i += 1;
    });
}

window.addEventListener("resize", onBodyResize);
window.addEventListener("load", onBodyResize);

$(document).ready(function() {
    $('body').append('<div id="auto-font-container" style="visibility:hidden;position:fixed;top:0;left:0;white-space:nowrap"></div>');
    window.auto_font_box = $('#auto-font-container');
});



class ReactFitText extends React.Component {
    constructor(props) {
        super(props);
        this.displayName= 'ReactFitText';


    }

    componentWillMount() {
        if (!updateQueued) {
            window.requestAnimationFrame(onBodyResize);
        }
    }

    componentWillUnmount() {
        if (this._childRef) {
            nodes.delete(this._childRef);
        }
    }

    componentDidUpdate() {
        onBodyResize();
    }

    _renderChildren(){
        var _this = this;

        return React.Children.map(this.props.children, function (child) {
            return React.cloneElement(child, { ref: function ref(c) {
                    if (c) {
                        nodes.set(c, _this.props);
                    }
                    _this._childRef = c;
                } });
        });
    }
    render() {
        return this._renderChildren()[0];
    }
}


ReactFitText.defaultProps = {
    children: 1.0,
    minFontSize: Number.NEGATIVE_INFINITY,
    maxFontSize: Number.POSITIVE_INFINITY,
    tryFitActual: true
};
ReactFitText.propTypes = {
    children: ReactPropTypes.element.isRequired,
    compressor: ReactPropTypes.number,
    minFontSize: ReactPropTypes.number,
    maxFontSize: ReactPropTypes.number,
    tryFitActual: ReactPropTypes.bool
};

export default ReactFitText;