import React from "react";
import User from "../../../../api/Models/User";
import classNames from "classnames";
import Popup from "react-popup";
import { CRequireAuth } from '../../shared/AuthorizeComponents';
import _Layout from '../_Layout';

export default class CNewAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            firstname: "",
            lastname: ""
        };
    }
    handleRedirect_toRegisteredWelcome() {
        this.props.history.push('/welcome');
        $('body').addClass('is-logged-in');
        $('.background-image').addClass('hide-animatable');
    }
    handleChange(field, evt) {
        let value = evt.target.value;
        switch (field) {
            case 'password': break;
            default:
                value = value.trim();
                break;
        }
        this.setState({ [field]: value });
    }
    handleSubmit(event) {
        event.preventDefault();
        // this.state.firstname
        let user =User.findOne(Meteor.userId);
        user.profile={
            firstName: this.state.firstname,
            lastName: this.state.lastname,
            createdAt: new Date()
        };
        let self = this;
        user.validate({
            cast: true
        }, function(err) {
            if (err) {
                Popup.alert(err);
            } else {
                user.save();
                self.handleRedirect_toRegisteredWelcome();
            }
        });
    }
    componentWillMount() {
        let needs_info=true;
        try {
            let user = User.findOne(Meteor.userId());
            let first=user.profile.firstName;
            let last =user.profile.lastName;
            if (first.length >=2 && last.length >=2) {
                needs_info=false;
            }
        }catch(e) {}
        if (!needs_info) {
            this.handleRedirect_toRegisteredWelcome();
        }
    }
    render() {
        const buttons = [];
        buttons.push({
            id: 'finish',
            label: 'Finish (Here we go!)',
            type: 'submit',
            className: classNames('active'),
        });
        const fields=[];
        fields.push({
            id: 'firstname',
            hint: 'Enter First Name',
            label: 'First Name',
            type: 'text',
            required: true,
            defaultValue: this.state.firstname || "",
            onChange: this.handleChange.bind(this, 'firstname'),
            message: 'Please input a valid name',
        });
        fields.push({
            id: 'lastname',
            hint: 'Enter Last Name',
            label: 'Last Name',
            type: 'text',
            required: true,
            defaultValue: this.state.lastname || "",
            onChange: this.handleChange.bind(this, 'lastname'),
            message: 'Please input a valid name',
        });
        return (
            <CRequireAuth layoutContainer={<_Layout />}>
                <section className={classNames('main')}>
                    <div className={classNames('row')}>
                        <h1 className={''}>
                            Tell us about you.
                        </h1>
                    </div>
                    <div className={classNames('login-form')}>
                        <form onSubmit={this.handleSubmit.bind(this)} >
                            <div className={classNames('row','child-w100')}>
                                <Accounts.ui.Fields fields={fields}/>
                            </div>
                            <div className={classNames('row','child-w100')}>
                                <Accounts.ui.Buttons buttons={buttons}/>
                            </div>
                        </form>
                    </div>
                    <div>{/* add some spacing. The system centers the content in it's parent container (height of screen minus logo bar 96px), so larger inner contents = better vertical positioning per the design */}
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                    </div>
                </section>
                <div className={classNames("col-xs-6",'rel','center-xs','w100')} style={{alignSelf: 'flex-end', position: 'absolute', bottom: '20px'}}>
                    <p>Step 2 of 2</p>
                    <div className={"step-group"}>
                        <div className={classNames('step','step-done')} />
                        <div className={classNames('step','step-done')} />
                    </div>
                </div>
            </CRequireAuth>
        );
    }
}
