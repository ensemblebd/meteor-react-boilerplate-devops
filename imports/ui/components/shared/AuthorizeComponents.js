import React, {cloneElement, Component} from "react";
import PropTypes from "prop-types";
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Accounts, STATES } from 'meteor/std:accounts-ui';
import { Redirect } from 'react-router-dom';
import classNames from "classnames";
import TransitionableComponent from './TransitionableComponent';
//https://github.com/chenglou/react-motion

class DefaultLayout extends React.Component {
    render() {
        return (
            <div className={classNames('default-layout','flex-center-container','col-xs-11','col-sm-9','col-md-6','col-lg-4','margin-auto-x','full-height-force')}>
                {this.props.children}
            </div>
        );
    }
}

///
///  Elements contained by this element will redirect when user IS logged in.
///
export class CPublic extends TrackerReact(React.Component) {
    constructor(props) {
        super(props);
        this.state={
            loggedIn: Meteor.user()!=null
        };
    }
    IsUserLoggedIn() {
        let realStatus = Meteor.user()!=null;
        return realStatus;
    }
    render() {
        const { redirectTo, layoutContainer, children } = this.props;
        return (
            (!this.IsUserLoggedIn()) ?
                cloneElement(layoutContainer, {
                    ...layoutContainer.props,
                    children
                })
                :
                <Redirect push to={redirectTo}/>
        );
    }
}
CPublic.propTypes = {
    redirectTo: PropTypes.string.isRequired,
    layoutContainer: PropTypes.element.isRequired
};
CPublic.defaultProps = {
    redirectTo: "/",
    layoutContainer: <DefaultLayout/>
};

///
///  Elements contained by this element will redirect when user is NOT logged in.
///
export class CRequireAuth extends TrackerReact(React.Component) {
    constructor(props) {
        super(props);
        this.state={
            loggedIn: Meteor.user()!=null
        };
    }

    IsUserLoggedIn() {
        if (this.state.loggedIn != (Meteor.user()!=null)) {
            this.setState((state)=> ({loggedIn: !state.loggedIn}), function() {
                console.log('component tracker update for new user state');
            });
        }
        return this.state.loggedIn;
    }
    render() {
        let { redirectTo, layoutContainer, children } = this.props;
        const LContainer = layoutContainer.type;
        return (
            (this.IsUserLoggedIn()) ?
                <LContainer>
                    {children}
                </LContainer>
                :
                <Redirect push to={redirectTo}/>
        );
    }
}
CRequireAuth.defaultProps = {
    redirectTo: "/login",
    layoutContainer: <DefaultLayout/>
};
CRequireAuth.propTypes = {
    redirectTo: PropTypes.string.isRequired,
    layoutContainer: PropTypes.element.isRequired
};


export const AuthorizedPage = Page => {
    return props =>
        <CRequireAuth layoutContainer={<div className={'w100'} />}>
            <Page {...props} />
        </CRequireAuth>;
};