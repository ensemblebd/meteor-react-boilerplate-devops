import React from 'react';
import classNames from "classnames";
import {Tabs, Tab} from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';
import MapsPersonPin from 'material-ui/svg-icons/maps/person-pin';
import RaisedButton from 'material-ui/RaisedButton';
import DialogCreateEdit from '../../components/web/user/DialogCreateEdit';
import _ from 'lodash';


import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import {Meteor} from "meteor/meteor";


class Users extends React.Component {
    constructor() {
        super();
        let handle=Meteor.connection.subscribe('customers');
        let results=Meteor.users.find();//Roles.getUsersInRole('place-orders');

        this.state = {
            results: {
                customers: results
            },
            subscriptions: {
                customers: handle
            },
            table_customers: {
                selected: [],
                dirtyKey: Math.random()
            },
            table_admins: {
                selected: [],
                dirtyKey: Math.random()
            }
        };
        this.rowClick=this.rowClick.bind(this);
    }
    componentWillUnmount() {
        this.state.subscriptions.customers.stop();
    }

    click_BlockCustomer(id) {
        this.updateUserBlockStatus_andRefresh(id, true);
    }
    click_UnblockCustomer(id) {
        this.updateUserBlockStatus_andRefresh(id, false);
    }
    updateUserBlockStatus_andRefresh(uid, status) {
        let self=this;
        Meteor.call('updateUser', uid, {
            'isBlocked': status,
        }, function(error, result) {
            let newcustomers=Meteor.users.find();
            self.setState({
                results: {
                    customers:  newcustomers
                }
            });
        });
    }

    // called from dialog post-op procedure when a user has been inserted or updated.
    // use this to refresh our view (the table listing)
    callback_DialogModifyDone(isDirty, dynamicTargetTable, closeDialogCallback) {
        let self = this;
        let newcustomers=Meteor.users.find();
        let newstate={
            results: {
                customers:  newcustomers
            },
        };
        if (isDirty && dynamicTargetTable!=="") {
            newstate[dynamicTargetTable]= {
                dirtyKey:  Math.random(), // force a refresh on dirty table body.
                selected: []
            };
        }
        self.setState(newstate, function() {
            if (typeof(closeDialogCallback)==='function') {
                setTimeout(closeDialogCallback,400);
            }
        });
    }

    // when a row is clicked in a table, highlight it and store the known selection in our state.
    rowClick(selectedRows, target_table) {
        let self = this;

        if (selectedRows.length > 0) {
            let currentRow=selectedRows.slice(0);
            if (self.state[target_table].selected.length>0) {
                let tr=$('table.'+target_table+' tbody tr:nth-child('+(self.state[target_table].selected[0]+1)+')');
                tr.removeClass('selected');
                tr.find(' .table-customers-row-action').css({display: 'none'});
            }
            let tr=$('table.'+target_table+' tbody tr:nth-child('+(currentRow[0]+1)+')');
            tr.find(' .table-customers-row-action').css({display: 'block'});
            tr.addClass('selected');

            let newState=_.merge(self.state[target_table],{
                selected: selectedRows.slice(0)
            });
            let resultState={};
            resultState[target_table] = newState;
            self.setState(resultState);
        }
    }

    // when user clicks Edit button, or Create button, attain the appropriate properties for the dialog prior to showing it ..
    getPropsForDialog(userId) {
        if (userId!==null) {
            // get user info..
            let customer=null;
            this.state.results.customers.map((c)=> {
                if (c._id===userId) {
                    customer=c;
                }
            });
            if (customer !==null) {
                var o= {
                    first: customer.profile.firstName,
                    last: customer.profile.lastName,
                    email: customer.emails[0].address,
                };
                if (typeof(customer.roles['admin-group'])!=='undefined' && customer.roles['admin-group'].length>0) {
                    o.role='Admin';
                } else if (typeof(customer.roles['__global_roles__'])!=='undefined' && customer.roles['__global_roles__'].length>0) {
                    o.role='SuperAdmin';
                } else {
                    o.role='Customer';
                }
                return o;
            }
        }
        return null;
    }

    render() {
        let customers = this.state.results.customers;
        return (
            <div id='Users' className={'col-xs-12'}>
                <hr/>
                <h1>Current Accounts in sampleapp</h1>
                <div className={'row'}>
                    <div className={classNames('col-xs-6','col-md-9')}>
                        <p>Accounts presently within the database.</p>
                    </div>
                    <div className={classNames('col-xs-6','col-md-3')}>
                        <DialogCreateEdit ref={"dialog_user_modify"} callbackDoneModifying={this.callback_DialogModifyDone.bind(this)} />
                        <RaisedButton className={"RaisedButton"}
                           label={"Create User"}
                           onClick={
                               () => this.refs.dialog_user_modify.openDialogForm(null, this.getPropsForDialog(null))
                           }
                        />
                    </div>
                </div>
                <Tabs>
                    <Tab
                        icon={<FontIcon className="material-icons">face</FontIcon>}
                        label="Customers"
                    >
                        <Table className={"table_customers"} onRowSelection={(selectedRows)=> this.rowClick(selectedRows,'table_customers')} selectable={true}  key={this.state.table_customers.dirtyKey}>
                            <TableHeader>
                                <TableRow>
                                    <TableHeaderColumn>ID</TableHeaderColumn>
                                    <TableHeaderColumn>Name</TableHeaderColumn>
                                    <TableHeaderColumn>Email</TableHeaderColumn>
                                    <TableHeaderColumn>Status</TableHeaderColumn>
                                    <TableHeaderColumn>Action</TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
                            <TableBody stripedRows={true}>
                                {customers.collection.find({ // filter local collection to users who do NOT have super or admin roles. This is a standard mongo collection query.
                                    $or: [ // any of following
                                        {
                                            "roles.default-group":  'place-orders'
                                        }
                                    ],
                                    $nor: [ // not or. None of the following
                                        {
                                            "roles.admin-group": 'admin-users'
                                        },
                                        {
                                            "roles.__global_roles__": 'super-admin'
                                        },
                                    ]
                                }).map((customer, tbl_customers_rowcount)=> {
                                    return <TableRow key={customer._id} selected={this.state.table_customers.selected.indexOf(tbl_customers_rowcount) !== -1} >
                                        <TableRowColumn>{customer._id}</TableRowColumn>
                                        <TableRowColumn>{customer.profile.firstName} {customer.profile.lastName}</TableRowColumn>
                                        <TableRowColumn>{customer.emails[0].address}</TableRowColumn>
                                        <TableRowColumn>{(customer.isBlocked)?"Blocked":"Active"}</TableRowColumn>
                                        <TableRowColumn>
                                            <div className={'table-customers-row-action'} style={{display: 'none'}}>
                                                <RaisedButton className={"RaisedButton"}
                                                    label={"Edit"}
                                                    onClick={
                                                        () => this.refs.dialog_user_modify.openDialogForm(customer._id,this.getPropsForDialog(customer._id), 'table_customers')
                                                    }
                                                />
                                                <RaisedButton className={"RaisedButton"}
                                                    label={(customer.isBlocked)?"Unblock":"Block"}
                                                    onClick={(customer.isBlocked)?
                                                        () => this.click_UnblockCustomer(customer._id)
                                                        :() => this.click_BlockCustomer(customer._id)
                                                    }
                                                />
                                            </div>
                                        </TableRowColumn>
                                    </TableRow>;
                                    })
                                }
                            </TableBody>
                        </Table>
                    </Tab>
                    <Tab
                        icon={<FontIcon className="material-icons">flight_takeoff</FontIcon>}
                        label="Drivers"
                    />
                    <Tab
                        icon={<FontIcon className="material-icons">favorite</FontIcon>}
                        label="Admins"
                    >
                        <Table className={"table_admins"} onRowSelection={(selectedRows)=> this.rowClick(selectedRows,'table_admins')} selectable={true}  key={this.state.table_admins.dirtyKey}>
                            <TableHeader>
                                <TableRow>
                                    <TableHeaderColumn>ID</TableHeaderColumn>
                                    <TableHeaderColumn>Name</TableHeaderColumn>
                                    <TableHeaderColumn>Email</TableHeaderColumn>
                                    <TableHeaderColumn>Action</TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
                            <TableBody stripedRows={true}>
                                {customers.collection.find({ // filter the local collection to admins & super users only
                                    $or: [
                                        {
                                            "roles.admin-group": 'admin-users'
                                        },
                                        {
                                            "roles.__global_roles__": 'super-admin'
                                        },
                                    ]
                                }).map((customer, tbl_admins_rowcount)=> {
                                    return <TableRow key={customer._id}
                                                     selected={this.state.table_admins.selected.indexOf(tbl_admins_rowcount) !== -1}>
                                        <TableRowColumn>{customer._id}</TableRowColumn>
                                        <TableRowColumn>{customer.profile.firstName} {customer.profile.lastName}</TableRowColumn>
                                        <TableRowColumn>{customer.emails[0].address}</TableRowColumn>
                                        <TableRowColumn>
                                            <div className={'table-customers-row-action'} style={{display: 'none'}}>
                                                <RaisedButton className={"RaisedButton"}
                                                              label={"Edit"}
                                                              onClick={
                                                                  () => this.refs.dialog_user_modify.openDialogForm(customer._id, this.getPropsForDialog(customer._id), 'table_admins')
                                                              }
                                                />
                                            </div>
                                        </TableRowColumn>
                                    </TableRow>;
                                })
                                }
                            </TableBody>
                        </Table>
                    </Tab>
                </Tabs>
            </div>
        );
    }
}

export default Users;
