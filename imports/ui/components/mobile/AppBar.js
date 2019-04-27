import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import {checkUserLoggedIn} from '../../../startup/client/Utility.js';

import { NavLink } from 'react-router-dom';

function handleTouchTap() {
    alert('onClick triggered on the title component');
}

const styles = {
    title: {
        cursor: 'pointer',
    },
};



class CLogged extends React.Component {
    constructor(props) {
        super(props);
    };
    render() {
        return (
            <IconMenu
                iconButtonElement={
                    <IconButton><MoreVertIcon /></IconButton>
                }
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
            >
                <MenuItem primaryText="[Dev] Toggle This Bar" onClick={this.props.mobileBarHandler} />
                <MenuItem primaryText="[Dev] Refresh" onClick={this.props.refreshStateHandler} />
                <MenuItem primaryText="[Dev] Toggle FE Display" onClick={this.props.devModeHandler} />
                <MenuItem primaryText="Help" />
                <MenuItem primaryText="Sign out" onClick={this.props.signOutHandler} />
            </IconMenu>
        );
    }
}
class CMobileAppBar extends React.Component {
    constructor(props) {
        super(props);
    };
    render() {
        return (
            <AppBar
                title={<span style={styles.title}>Mobile Area</span>}
                iconElementLeft={<IconButton><NavigationClose /></IconButton>}
                iconElementRight={
                    (checkUserLoggedIn()) ?
                        <CLogged signOutHandler={this.props.signOutHandler} mobileBarHandler={this.props.mobileBarHandler} devModeHandler={this.props.devModeHandler} refreshStateHandler={this.props.refreshStateHandler} />
                        :
                        <span>Please login</span>
                }
            />
        );
    }
};

export default CMobileAppBar;