import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import classNames from "classnames";

const TransitionableComponent = Page => {
    determineTransitionType=function() {
        return true;
    }
    return props =>
        <div className={classNames("page",'rel')}>
            <ReactCSSTransitionGroup
                transitionAppear={true}
                transitionAppearTimeout={600}
                transitionEnterTimeout={600}
                transitionLeaveTimeout={200}
                transitionName={'SlideIn'}//{this.determineTransitionType((props.match.path === '/') ? 'SlideOut' : 'SlideIn')}
            >
                <Page {...props} />
            </ReactCSSTransitionGroup>
        </div>;
};
export default TransitionableComponent;