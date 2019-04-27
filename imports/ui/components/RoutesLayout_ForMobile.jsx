import React from 'react';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import {AuthorizedPage} from './shared/AuthorizeComponents';
import TransitionableComponent from "./shared/TransitionableComponent";
import CLoginRegAuthSystem from './mobile/Anon/CLoginRegAuthSystem';
import CWelcomeNoAuth from './mobile/Anon/CWelcomeNoAuth';
import CNewAccount from './mobile/Authorized/CNewAccount';
import CWelcomeNewUser from './mobile/Authorized/CWelcomeNewUser';
import CHome from './mobile/Authorized/CHome';
import CAccount from '../pages/mobile/Account';
import CAbout from '../pages/mobile/About';
import CNotFound from '../pages/shared/NotFound';

export default class RoutesLayout_ForMobile extends React.Component {
    constructor(props) {
        super(props);

        this.routes = (
            <Switch location={this.props.location}>
                {/* Components that are available to anonymous */}
                <Route path="/na-welcome" component={ TransitionableComponent(CWelcomeNoAuth) } />
                <Route path="/login" component={ TransitionableComponent(CLoginRegAuthSystem) } />
                <Route path="/register" component={ TransitionableComponent(CLoginRegAuthSystem) } />
                <Route path="/forgot" component={ TransitionableComponent(CLoginRegAuthSystem) } />
                <Route path="/recover" component={ TransitionableComponent(CLoginRegAuthSystem) } />

                {/* Components that handle new accounts, and must be logged in. */}
                <Route exact path="/new-account" component={TransitionableComponent(CNewAccount)} />
                <Route exact path="/welcome" component={TransitionableComponent(CWelcomeNewUser)} />

                {/* Pages that require logged in user. Try and use this area for new pages. */}
                <Route exact path="/" component={TransitionableComponent(CHome)} />
                <Route path="/about" component={AuthorizedPage(TransitionableComponent(CAbout))} />
                <Route path="/account" component={AuthorizedPage(TransitionableComponent(CAccount))} />
                {/* add new pages above this line. Last one is catch-all for 404. */}
                <Route path="/*" component={AuthorizedPage(TransitionableComponent(CNotFound))} />
            </Switch>
        );
    }
    render() {
        return (
            <Router>
                <div className={this.props.intendedContainerClassNames}>
                    <div className={classNames("row","full-height-force")}>
                        { this.routes }
                    </div>
                </div>
            </Router>
        );
    }
}
