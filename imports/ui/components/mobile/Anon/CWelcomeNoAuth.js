import React from "react";
import classNames from "classnames";
import { Accounts, STATES } from 'meteor/std:accounts-ui';
import Popup from "react-popup";
import { CPublic } from '../../shared/AuthorizeComponents';
import _Layout from '../_Layout';
import ReactFitText from '../../shared/ReactFitText';

export default class CWelcomeNoAuth extends React.Component {
    constructor(props) {
        super(props);
    }
    handleRedirect_toLogin(event) {
        console.log("to: Login");
        event.preventDefault();
        this.props.history.push('/login');
        return false;
    }
    handleRedirect_toRegister() {
        console.log("to: Register");
        event.preventDefault();
        this.props.history.push('/register');
        return false;
    }
    handleRedirect_toForgot() {
        console.log("to: Forgot");
        event.preventDefault();
        this.props.history.push('/forgot');
        return false;
    }
    handlePopup_PrivacyPolicy(event) {
        event.preventDefault();
        Popup.alert('lorem ipsum','Privacy Policy');
    }
    handlePopup_Terms(event) {
        event.preventDefault();
        Popup.alert('You must order 1 taco, at least.','Terms & Conditions');
    }
    render() {
        const buttons = [];
        buttons.push({
            id: 'signIn',
            label: 'Sign Up',
            type: 'submit',
            className: classNames('active'),
            onClick: this.handleRedirect_toRegister.bind(this)
        });
        buttons.push({
            id: 'signIn',
            label: 'Login',
            type: 'submit',
            href: '/login',
            className: classNames('basic-clear'),
            onClick: this.handleRedirect_toLogin.bind(this)
        });
        buttons.push({
            id: 'switchToPasswordReset',
            className: 'switchToPasswordReset',
            label: 'Forgot your password?',
            type: 'link',
            onClick: this.handleRedirect_toForgot.bind(this)
        });
        return (
            <CPublic layoutContainer={<_Layout />}>
                <section className={classNames('main','login-form')}>
                    <div className={classNames('row')}>
                        <ReactFitText minFontSize={16} compressor={0.5} maxFontSize={28} tryFitActual={false} >
                            <h1 className={classNames('standard','tcenter')}>Anything, Delivered</h1>
                        </ReactFitText>
                    </div>
                    <div className={classNames('row')}>
                        <p className={classNames('')}>
                            (well, almost anything)
                        </p>
                    </div>
                    <div className={classNames('row')}>
                        <Accounts.ui.Buttons buttons={buttons}/>
                    </div>
                    <div className={classNames('row')}>
                        <p className={classNames('c-grey')}>
                            I agree to&nbsp;
                            <a className={classNames('c-secondary')} href={"/policy"} onClick={this.handlePopup_PrivacyPolicy}>Privacy Policy</a>
                            &nbsp;and&nbsp;
                            <a className={classNames('c-secondary')} href={"/terms"} onClick={this.handlePopup_Terms}>Terms</a>.
                        </p>
                    </div>
                </section>
            </CPublic>
        );
    }
}
