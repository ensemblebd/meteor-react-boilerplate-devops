import React from 'react';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import Toggle from 'material-ui/Toggle';
import { Link, NavLink } from 'react-router-dom';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import {checkUserLoggedIn} from "../../../startup/client/Utility";
import {Meteor} from "meteor/meteor";
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
    title: {
        cursor: 'pointer',
    },
};
function handleTouchTap() {
    alert('onClick triggered on the title component');
}

class CLogged extends React.Component {
    constructor(props) {
        super(props);
    };
    render() {
        let button_style = {
            margin: "0px 12px",
        };
        return (
            <div>
                <NavLink activeClassName="active" exact to="/">
                    <RaisedButton label="Dashboard" primary={true} style={button_style} />
                </NavLink>
                <NavLink activeClassName="active" to="/Users">
                    <RaisedButton label="Customers" secondary={true} style={button_style} />
                </NavLink>
                <NavLink activeClassName="active" to="/Orders">
                    <RaisedButton label="Orders" style={button_style} />
                </NavLink>
                <IconMenu
                    iconButtonElement={
                        <IconButton><MoreVertIcon /></IconButton>
                    }
                    targetOrigin={{horizontal: 'right', vertical: 'top'}}
                    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                >
                    {
                        (Meteor.isDevelopment)?
                            <div>
                                <MenuItem primaryText="[Dev] Refresh" onClick={this.props.refreshStateHandler} />
                                <MenuItem primaryText="[Dev] Toggle FE Display" onClick={this.props.devModeHandler} />
                            </div>
                            : <span></span>
                    }
                    <MenuItem primaryText="Help" />
                    <MenuItem primaryText="Sign out" onClick={this.props.signOutHandler} />
                </IconMenu>
            </div>
        );
    }
}

class CAdminAppBar extends React.Component {
    constructor(props) {
        super(props);
    };
    render() {
        return (
            <AppBar className={'app-bar'}
                title={<span style={styles.title}>Sampleapp Admin Area</span>}
                iconElementLeft={<IconButton />}
                iconElementRight={
                    checkUserLoggedIn() ?
                        <CLogged signOutHandler={this.props.signOutHandler} devModeHandler={this.props.devModeHandler} refreshStateHandler={this.props.refreshStateHandler} />
                        :
                        <span>Please login</span>
                }
            />
        );
    }
}
export default CAdminAppBar;