import React from 'react';
import { BrowserRouter as Router, Route, Switch, NavLink } from 'react-router-dom';
import classNames from "classnames";

import CLoginSystem from '../components/web/CLoginSystem';
import Dashboard from '../pages/web/Dashboard.jsx';
import Users from '../pages/web/Users.jsx';
import Orders from '../pages/web/Orders.jsx';
import CNotFound from '../pages/shared/NotFound';
import {AuthorizedPage} from "./shared/AuthorizeComponents";

export default class RoutesLayout_ForAdminWebServer extends React.Component {
    constructor(props) {
        super(props);

        this.routes = (
            <Switch>
                {/* Default accounting system. Notice that the registration is disabled. */}
                <Route path="/login" component={ CLoginSystem } />
                <Route path="/forgot" component={ CLoginSystem } />
                <Route path="/recover" component={ CLoginSystem } />

                {/* Add pages here. Notice the inclusion of AuthorizedPage() component page wrapper. */}
                <Route exact path="/" component={AuthorizedPage(Dashboard)} />
                <Route path="/Users" component={AuthorizedPage(Users)} />
                <Route path="/Orders" component={AuthorizedPage(Orders)} />
                {/* Don't delete the 404 */}
                <Route path="/*" component={AuthorizedPage(CNotFound)} />
            </Switch>
        );
    }
    render() {
        return (
            <Router>
                <div>
                    {((typeof(this.props.componentAppBar)!=='undefined') && this.props.doShowAppBar)?
                        this.props.componentAppBar
                        :<div className={"hidden"}/>
                    }
                    <div className={this.props.intendedContainerClassNames}>
                        <div className={classNames('row')}>
                            { this.routes }
                        </div>
                    </div>
                </div>
            </Router>
        );
    }
}
