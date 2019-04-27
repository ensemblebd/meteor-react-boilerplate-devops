import React from "react";
import classNames from "classnames";
import Popup from "react-popup";
import { Accounts, STATES } from 'meteor/std:accounts-ui';

import { CPublic } from '../../shared/AuthorizeComponents';
import {CStateful,CStateful_H1} from '../../shared/CStateful';
import _Layout from '../_Layout';




export default class CLoginRegAuthSystem extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            currentHeaderText:'Welcome back!',
            initialFormState: null
        };
        console.log(props);
        if (this.props.location.pathname === ("/register")) {
            this.state.initialFormState= STATES.SIGN_UP;
        } else if (this.props.location.pathname === ("/forgot")) {
            this.state.initialFormState= STATES.PASSWORD_RESET;
        } else if (this.props.location.pathname === ("/recover")) {
            this.state.initialFormState= STATES.PASSWORD_CHANGE;
        }

    }
    handlePopup_PrivacyPolicy(event) {
        event.preventDefault();
        Popup.alert('lorem ipsum','Privacy Policy');
    }
    handlePopup_Terms(event) {
        event.preventDefault();
        Popup.alert('You must order 1 taco, at least.','Terms & Conditions');
    }
    onAccountsUIStateChange(form_state) {
        console.log(form_state);
        let text="Welcome back!";
        if (form_state!=STATES.SIGN_UP) {
            this.c_stateful_policy.triggerChange(true);
            this.c_stateful_steps.triggerChange(false);
        } else {
            text="Tell us about you.";
            this.c_stateful_steps.triggerChange(true);
            this.c_stateful_policy.triggerChange(false);
        }
        this.c_stafeful_h1.triggerChange(text);
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
                        <CStateful_H1 className={'standard'} text={"Welcome back!"} onRef={ref => (this.c_stafeful_h1 = ref)} />
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
                    <CStateful toggle={true} onRef={ref => (this.c_stateful_policy = ref)} >
                        <div className={classNames('row')}>
                            <p className={classNames('c-grey')} style={{marginTop: '8px'}}>
                                I agree to&nbsp;
                                <a className={classNames('c-secondary')} href={"/policy"} onClick={this.handlePopup_PrivacyPolicy}>Privacy Policy</a>
                                &nbsp;and&nbsp;
                                <a className={classNames('c-secondary')} href={"/terms"} onClick={this.handlePopup_Terms}>Terms</a>.
                            </p>
                        </div>
                    </CStateful>
                </section>
                <CStateful toggle={false} onRef={ref => (this.c_stateful_steps = ref)} >
                    <div className={classNames("col-xs-6",'rel','center-xs','w100')} style={{alignSelf: 'flex-end', position: 'absolute'}}>
                        <p>Step 1 of 2</p>
                        <div className={"step-group"}>
                            <div className={classNames('step','step-done')} />
                            <div className={'step'} />
                        </div>
                    </div>
                </CStateful>
            </CPublic>
        );
    }
}
