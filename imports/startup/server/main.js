import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

var mode = (Meteor.isDevelopment || !Meteor.isProduction)?"Development":"Production";
console.log("Starting server... ("+mode+" mode)");

import '../../api/connection.js';
import AccountsUISetup from '../shared/accounts.js';
// server too must configure the setup for accounts ui..


ServiceConfiguration.configurations.upsert(
    { service: "google" },
    { $set: { clientId: "1027639585471-tj8gp9levu2ijkegjis8ecicg6v7q91v.apps.googleusercontent.com", secret: "Cxw5DDFKV68ssy8xBPEAHrPF" } }
);
var facebookConfig = Meteor.settings.facebook;
ServiceConfiguration.configurations.upsert(
    { service: "facebook" },
    { $set: { appId: "379562779170957" /*facebookConfig.appId*/, secret: "ab1cc09d1c1f70aa1d2e18c9234f58e6" /*facebookConfig.secret*/ } }
);

Accounts.emailTemplates.siteName = 'Sample App';
Accounts.emailTemplates.from = 'system@sampleapp.mycompany.com';
Accounts.emailTemplates.enrollAccount.subject = (user) => {
    return `Welcome to Awesome Town, ${user.profile.name}`;
};
Accounts.emailTemplates.enrollAccount.text = (user, url) => {
    return 'You have been selected to participate in building a better future!'
        + ' To activate your account, simply click the link below:\n\n'
        + url;
};
Accounts.emailTemplates.resetPassword.from = () => {
    // Overrides the value set in `Accounts.emailTemplates.from` when resetting passwords.
    return 'accounts@sampleapp.mycompany.com';
};
Accounts.emailTemplates.verifyEmail = {
    subject() {
        return "SampleApp - Activate your account now!";
    },
    html(user, url) {
        return `Hey ${user.emails[0].address}! <br />Please verify your e-mail by following this link: <a href="${url}">Verify My Account</a><br /><br />Best Regards,<br />SampleApp Team`;
    }
};
Accounts.emailTemplates.loginNoPassword = {
    subject() {
        return "Sample App - Activate your account now!";
    },
    /* text(user, url) {
         return `Hey ${user}! Verify your e-mail by following this link: ${url}`;
     },
     html(user, url) {
         return `Hey ${user}! Verify your e-mail by following this link: ${url}`;
     },
     headers: {

     }*/
};


AccountsUISetup();