import React from "react";
import classNames from "classnames";
import { Accounts, STATES } from 'meteor/std:accounts-ui';

import { CPublic } from '../shared/AuthorizeComponents';
import _Layout from '../mobile/_Layout';




export default class CLoginSystem extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            currentHeaderText:'Welcome back!',
            initialFormState: STATES.SIGN_IN
        };
        if (this.props.location.pathname === ("/register")) {

        } else if (this.props.location.pathname === ("/forgot")) {
            this.state.initialFormState= STATES.PASSWORD_RESET;
        } else if (this.props.location.pathname === ("/recover")) {
            this.state.initialFormState= STATES.PASSWORD_CHANGE;
        }

    }
    onAccountsUIStateChange(form_state) {
        console.log(form_state);

    }
    translateMap() {
        return {
            signIn: function(form_state) {
                if (form_state == STATES.SIGN_UP)
                    return 'Login Instead';
                else if (form_state == STATES.PASSWORD_RESET)
                    return 'Login Instead';

                return 'Login';
            },
            signUp: function(form_state) {
                if (form_state == STATES.SIGN_IN)
                    return 'Signup Instead';
                else if (form_state == STATES.SIGN_UP)
                    return 'Next';

                return 'Signup Instead';
            }
        };
    }
    render() {
        return (
            <CPublic layoutContainer={<_Layout />}>
                <section className={classNames('main')}>
                    <div className={classNames('row')}>
                        <h1>Please authenticate.</h1>
                    </div>
                    <div className={classNames('row')}>
                        <Accounts.ui.LoginForm
                            notifyStateChange={this.onAccountsUIStateChange.bind(this)}
                            profilePath={"/account"}
                            disableStateChange={true}
                            translateMap={this.translateMap()}
                            formState={this.state.initialFormState}
                        />
                    </div>
                </section>
            </CPublic>
        );
    }
}
