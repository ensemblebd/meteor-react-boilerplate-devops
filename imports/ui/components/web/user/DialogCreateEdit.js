import React from 'react';
import classNames from "classnames";
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import MenuItem from 'material-ui/MenuItem';
import { ValidatorForm } from 'react-form-validator-core';
import { TextValidator , SelectValidator } from 'react-material-ui-form-validator';
import User from '../../../../api/Models/User';
import _ from 'lodash';
import {Meteor} from "meteor/meteor";

const styles = {
    block: {
        maxWidth: 250,
    },
    toggle: {
        marginBottom: 16,
    },
    thumbOff: {
        backgroundColor: '#ffcccc',
    },
    trackOff: {
        backgroundColor: '#ff9d9d',
    },
    thumbSwitched: {
        backgroundColor: 'red',
    },
    trackSwitched: {
        backgroundColor: '#ff9d9d',
    },
    labelStyle: {
        color: 'red',
    },
};


class DialogCreateEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dialog_create: {
                open: false,
                formIsValid: false,
                roleValues: [],
                title: 'Create new User',
                formTarget: null,
                dynamicTargetTable: "",
                formData: {
                    first: "",
                    last: "",
                    email: "",
                    role: "",
                    verify: true
                },
                originalData: {},
                mode: 'create',
                submitted: false,
                submitting: false
            }
        };
        this.dlgCreate_handleChange=this.dlgCreate_handleChange.bind(this);
        this.openDialogForm=this.openDialogForm.bind(this);
    }
    componentWillMount() {
        ValidatorForm.addValidationRule('isTruthy', value => value);
    }


    openDialogForm(target_id, props_for_state, dynamicTargetTable) {
        let self=this;
        let formData={
            first: "",
            last: "",
            email: "",
            role: "",
            verify: true
        };
        let title="Create new User";
        let mode='create';
        if (props_for_state!==null) {
            formData=_.merge(formData,props_for_state);
            mode='update';
            formData.verify=false;
            title="Editing User";
        }
        let newDynamicTargetTable=(typeof(dynamicTargetTable)!=='undefined')?dynamicTargetTable:"";
        let newState=_.merge(self.state.dialog_create,{
            open: true,
            formTarget: target_id,
            formData: formData,
            mode: mode,
            title: title,
            submitting: false,
            originalData: formData,
            roleValues: formData.role,
            dynamicTargetTable: newDynamicTargetTable
        });
        self.setState({dialog_create: newState});
    }
    dlgCreate_Close() {
        let self=this;
        let newState=_.merge(self.state.dialog_create,{
            open: false
        });
        self.setState({dialog_create: newState});
    }
    dlgCreate_Submit() {
        let self=this;
        let newState=_.merge(self.state.dialog_create,{
            submitting: true
        });
        self.setState({
            dialog_create: newState,
        });
        try {
            var newUserData = {
                email: self.state.dialog_create.formData.email,
                password: Math.random().toString(36).substring(7),
                profile: {
                    firstName: self.state.dialog_create.formData.first,
                    lastName: self.state.dialog_create.formData.last,
                },
                isBlocked: false
            };
            if (self.state.dialog_create.mode==='create') {
                Meteor.call('insertUser', newUserData, function (error, result) {
                    if (error) {
                        console.log(error);
                        alert("Server denied creation request.");
                    } else {
                        Meteor.users.update({_id: result}, {
                            $set: {
                                'isBlocked': newUserData.isBlocked,
                                'profile': newUserData.profile
                            }
                        }, function () {
                            if (self.state.dialog_create.formData.role === "Admin") {
                                Meteor.call('addUserRole', result, ['admin-users'], 'admin-group');
                            } else if (self.state.dialog_create.formData.role === "SuperAdmin") {
                                Meteor.call('addUserRole', result, ['super-admin'], null);
                            }

                            if (self.state.dialog_create.formData.verify) {
                                Accounts.forgotPassword({email: self.state.dialog.formData.email});
                            }

                            let isDirty=false;
                            if (self.state.dialog_create.originalData.role !== self.state.dialog_create.formData.role) {
                                isDirty=true;
                            }
                            self.props.callbackDoneModifying(isDirty, self.state.dialog_create.dynamicTargetTable, function() {
                                newState = _.merge(self.state.dialog_create, {
                                    open: false
                                });
                                self.setState({
                                    dialog_create: newState
                                });
                            });
                        });
                    }
                });
            } else {
                Meteor.call('updateUser', self.state.dialog_create.formTarget, {
                    'isBlocked': newUserData.isBlocked,
                    'profile': newUserData.profile,
                    'emails': [
                        {
                            'address': newUserData.email
                        }
                    ]
                }, function (error, result) {
                    if (self.state.dialog_create.formData.role == "Admin") {
                        Meteor.call('addUserRole', self.state.dialog_create.formTarget, ['admin-users'], 'admin-group');
                    } else if (self.state.dialog_create.formData.role == "SuperAdmin") {
                        Meteor.call('addUserRole', self.state.dialog_create.formTarget, ['super-admin'], null);
                    } else {
                        //Meteor.call('addUserRole', self.state.dialog_create.formTarget, ['edit-account','place-orders','contact-driver'], 'default-group'); // all users are a customer by default.
                        // if they are changed to a customer, then we assume they should NOT be an admin..
                        Meteor.call('removeUserRole', self.state.dialog_create.formTarget, ['super-admin'], null);
                        Meteor.call('removeUserRole', self.state.dialog_create.formTarget, ['admin-users'], 'admin-group');
                    }

                    if (self.state.dialog_create.formData.verify) {
                        Accounts.forgotPassword({email: self.state.dialog_create.formData.email});
                    }

                    let isDirty=false;
                    if (self.state.dialog_create.originalData.role !== self.state.dialog_create.formData.role) {
                        isDirty=true;
                    }
                    self.props.callbackDoneModifying(isDirty, self.state.dialog_create.dynamicTargetTable, function() {
                        newState = _.merge(self.state.dialog_create, {
                            open: false
                        });
                        self.setState({
                            dialog_create: newState
                        });
                    });
                });
            }



        }catch(Ex) {
            alert("Failed to create user.");
        }

    }
    dlgCreate_handleRoleChange(event, index, values) {
        let self=this;
        let newState=_.merge(self.state.dialog_create,{
            roleValues: values
        });
        self.setState({dialog_create: newState});
        self.dlgCreate_handleChange(event, values, 'role');
    }
    dlgCreate_roleItems(values) {
        const roles = [
            'Customer',
            'Driver',
            'Admin',
            'SuperAdmin',
            'Developer'
        ];

        return roles.map((name) => (
            <MenuItem
                key={name}
                insetChildren={true}
                checked={values && values.indexOf(name) > -1}
                value={name}
                primaryText={name}
            />
        ));
    }
    dlgCreate_handleChange(event, forceValue, forceName) {
        let self = this;
        let formData = this.state.dialog_create.formData;
        let target_name = (typeof(forceName)!=='undefined')? forceName:event.target.name;
        let target_value = (typeof(forceValue)!=='undefined')?forceValue:event.target.value;
        formData[target_name] = target_value;
        let newState=_.merge(self.state.dialog_create,{
            formData: formData
        });
        self.setState({dialog_create: newState});
    }

    render() {
        return (
            <div>
                <Dialog
                    title={this.state.dialog_create.title}
                    actions={[
                        <FlatButton
                            label="Cancel"
                            primary={true}
                            onClick={this.dlgCreate_Close.bind(this)}
                        />,
                    ]}
                    modal={true}
                    open={this.state.dialog_create.open}
                >
                    Please specify details of the User Account below..
                    <div className={classNames('standard-form-container','row')}>
                        <ValidatorForm ref={'form'} onSubmit={this.dlgCreate_Submit.bind(this)} style={{height: '100%'}}>
                            <div className={'col-xs-12'}>
                                <TextValidator name={"new-first"}
                                   className={'textField'}
                                   hintText="First Name"
                                    //errorText="This field is required"
                                   floatingLabelText="First Name"
                                   onChange={this.dlgCreate_handleChange}
                                   name={"first"} value={this.state.dialog_create.formData.first}
                                   validators={['required']}
                                   errorMessages={['this field is required']}
                                />
                                <TextValidator name={"new-last"}
                                   className={'textField'}
                                   hintText="Last Name"
                                    //errorText="This field is required"
                                   floatingLabelText="Last Name"
                                   onChange={this.dlgCreate_handleChange}
                                   name={"last"} value={this.state.dialog_create.formData.last}
                                   validators={['required']}
                                   errorMessages={['this field is required']}
                                />
                                <TextValidator name={"new-email"}
                                   className={'textField'}
                                   hintText="email@example.com"
                                    //errorText="This field is required"
                                   floatingLabelText="Email Address"
                                   onChange={this.dlgCreate_handleChange}
                                   name={"email"} value={this.state.dialog_create.formData.email}
                                   validators={['required', 'isEmail']}
                                   errorMessages={['this field is required', 'email is not valid']}
                                   fullWidth={true}
                                />
                            </div>
                            <div className={classNames('row','col-xs-12')}>
                                <div className={classNames('col-xs-12','col-md-6')} style={{paddingTop: 16}}>
                                    Select User Group/Role:
                                </div>
                                <div className={classNames('col-xs-12','col-md-6')}>
                                    <SelectValidator
                                        multiple={false}
                                        hintText="Select role"
                                        value={this.state.dialog_create.roleValues}
                                        onChange={this.dlgCreate_handleRoleChange.bind(this)}
                                        name={"role"} value={this.state.dialog_create.formData.role}
                                        validators={['required']}
                                        errorMessages={['this field is required']}
                                    >
                                        {this.dlgCreate_roleItems(this.state.dialog_create.roleValues)}
                                    </SelectValidator>
                                </div>
                            </div>
                            <div className={classNames('row','col-xs-7')}>
                                <Toggle
                                    label="Email Password Reset/Confirm?"
                                    style={styles.toggle}
                                    name={"verify"}
                                    toggled={this.state.dialog_create.formData.verify}
                                    onToggle={this.dlgCreate_handleChange}
                                />
                            </div>
                            <RaisedButton
                                type={"submit"}
                                label="Submit"
                                disabled={this.state.dialog_create.submitting}
                                //disabled={!this.state.dialog_create.formIsValid}
                            />
                        </ValidatorForm>
                    </div>
                </Dialog>
            </div>
        );
    }


}


export default DialogCreateEdit;