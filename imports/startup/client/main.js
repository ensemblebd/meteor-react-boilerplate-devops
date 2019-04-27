import '../../api/connection.js';
import AccountsUISetup from '../shared/accounts.js';
import App from './app.jsx';

import React from 'react';
import ReactDOM from 'react-dom';
import Popup from 'react-popup';

import "/imports/ui/_scss/main.scss"; // on-the-fly compiled css

Meteor.startup(() => {
    // load any native javascript libs here. todo: find a package to help us maintain this automatically(preferably) or easier than manual code entries here..
    $.getScript('vendor/jQuery.easing.js', function(){
        //console.log('jquery-easing loaded.');
    });

    // render the main app!
    ReactDOM.render(
        <App accountsUISetupFunc={AccountsUISetup} />,
        document.getElementById('app')
    );
    ReactDOM.render(
        <Popup />,
        document.getElementById('popupContainer')
    );
});

