import { Accounts } from 'meteor/std:accounts-ui';
import { getLoginServices } from 'meteor/std:accounts-ui/imports/helpers.js';
import User from '../../api/Models/User';
import {Meteor} from "meteor/meteor";

export default function AccountsUISetup(onSignedInHook) {
    //console.log(getLoginServices());

    let is_mobile=false, can_register=false;
    try {
        if (Meteor.isDevelopment) {
            // if in development mode (local runtime via IDE), then check the settings.json flag indicating whether or not we are forcing into mobile or desktop mode (desktop simulation doesn't allow registration).
            if (typeof(Meteor.settings.public.dev) !== 'undefined' && typeof(Meteor.settings.public.dev.forceMobileInDev) === 'boolean') {
                is_mobile = Meteor.settings.public.dev.forceMobileInDev;
            } else {
                is_mobile = true;
            }
        } else {
            // only allow registration on mobile device in production mode..
            is_mobile = (Meteor.isCordova || Meteor.Device.isPhone() || (!Meteor.Device.isDesktop()));
        }
    }catch(E) { // mobile-device-detection package is deprecated and may not function depending upon the device.
        is_mobile=true;
    }
    if (is_mobile) can_register=true;

    acui_config = {
        passwordSignupFields: 'EMAIL_ONLY',
        loginPath: '/login',
        signUpPath: '/register',
        resetPasswordPath: '/forgot',
        profilePath: '/account',
        homeRoutePath: '/',
        minimumPasswordLength: 6,
        forbidClientAccountCreation: is_mobile,
        requireEmailVerification: true // doesn't seem to work in the accounts-ui package addon, it should but it doesn't. So you'll see us utilize this setting below in the validation hook server-side.
    };
    // allow instatiator to define a scoped hook for signing in.
    if (Meteor.isClient && typeof(onSignedInHook)==="function") {
        acui_config.onSignedInHook = onSignedInHook;
    }

    Accounts.config({
        sendVerificationEmail: true,
        forbidClientAccountCreation: !can_register,
        /*
            // Behavior
            confirmPassword: true,
            enablePasswordChange: true,
            forbidClientAccountCreation: false,
            overrideLoginErrors: true,
            sendVerificationEmail: false,
            lowercaseUsername: false,
            focusFirstInput: true,

            // Appearance
            showAddRemoveServices: false,
            showForgotPasswordLink: false,
            showLabels: true,
            showPlaceholders: true,
            showResendVerificationEmailLink: false,

            // Client-side Validation
            continuousValidation: false,
            negativeFeedback: false,
            negativeValidation: true,
            positiveValidation: true,
            positiveFeedback: true,
            showValidating: true,

            // Privacy Policy and Terms of Use
            privacyUrl: 'privacy',
            termsUrl: 'terms-of-use',

            // Redirects
            homeRoutePath: '/home',
            redirectTimeout: 4000,

            // Hooks
            onLogoutHook: myLogoutFunc,
            onSubmitHook: mySubmitFunc,
            preSignUpHook: myPreSubmitFunc,
            postSignUpHook: myPostSubmitFunc,

            // Texts
            texts: {
              button: {
                  signUp: "Register Now!"
              },
              socialSignUp: "Register",
              socialIcons: {
                  "meteor-developer": "fa fa-rocket"
              },
              title: {
                  forgotPwd: "Recover Your Password"
              },
            },
        */
    });

    Accounts.ui.config(acui_config);

    if (!Meteor.isClient) {
        Accounts.validateLoginAttempt(function (attemptObj) {
            let require_verification = acui_config.requireEmailVerification;
            require_verification=false; // forcing it off , since we use a signup_page that is two-step but separated out in terms of form submission.

            if (attemptObj.user && attemptObj.allowed) {
                if (attemptObj.user.isBlocked) {
                    throw new Meteor.Error(403, "Sorry. Your account is disabled.");
                }
                // ** RESTRICT access to users that have validated their emails **
                // presently disabled per setting above, to facilitate multi-step registration process.
                if (require_verification) {
                    if (!attemptObj.user.emails[0].verified) {
                        throw new Meteor.Error(403, "Please validate your email");
                    }
                }

                // ** RESTRICT access to authenticate when in production mode on server (aka Admin interface) **
                // make sure we are in production mode. if we are developing and forcing desktop mode, then act like we are in production on a server, and require user to be in the right role to login.
                let forced_admin_dev_mode=false;
                if (typeof(Meteor.settings.public.dev)!=='undefined' && typeof(Meteor.settings.public.dev.forceMobileInDev)==='boolean') {
                    forced_admin_dev_mode=Meteor.settings.public.dev.forceMobileInDev;
                }
                let user_can_admin = Roles.userIsInRole(attemptObj.user._id, ['admin-users','super-admin'], 'default-group');
                if ( (!Meteor.isDevelopment || !forced_admin_dev_mode )
                    && !is_mobile
                    && !user_can_admin
                ) {
                    console.log("Admin login attempt("+attemptObj.user._id+"): "+attemptObj.user.emails[0].address+" , [dev: "+Meteor.isDevelopment+"], [dev_force: "+forced_admin_dev_mode+"], [hasRole: "+ user_can_admin +"]");
                    throw new Meteor.Error(403, "Sign in not permitted. Use mobile app.");
                }
            }

            return true;
        });
        // matb33:collection-hooks
        Meteor.users.after.insert(function (userId, doc) {

            if (doc.emails[0].address.indexOf("mycompany.com")!==-1) {
                Roles.addUsersToRoles(doc._id,'super-admin',Roles.GLOBAL_GROUP);
            } else {

            }
            Roles.addUsersToRoles(doc._id,['edit-account','place-orders','contact-driver'], 'default-group');
            // todo: add these to a server-side function called by an existing admin (to mark an account via a button as an admin or driver)
            //Roles.addUsersToRoles(user._id,['edit-account','deliver-orders','contact-customer'], 'driver-group');
            //Roles.addUsersToRoles(user._id,['edit-account','deliver-orders','contact-customer'], 'admin-group');

        });
        Accounts.onCreateUser(function (options, user) {
            User.validate(user); // validate using our custom model on top of the Meteor.users collection standard schema validation.

            return user;
        });

        Meteor.users.allow({
            /*insert: function(userId, doc) {
                //Normally I would check if (this.userId) to see if the method is called by logged in user or guest
                //you can also add some checks here like user role based check etc.,
                return true;
            },*/
            update: function(userId, doc, fieldNames, modifier) {
                if (userId !== doc._id) {
                    let user_can_admin = Roles.userIsInRole(userId, ['admin-users','super-admin'], 'admin-group');
                    if (user_can_admin) {
                        console.log("admin user("+userId+") is modifying another: "+doc._id);
                        return true;
                    } else {
                        console.log("user("+userId+") tried to modify another: "+doc._id+", and was blocked due to role.");
                    }
                } else {
                    // user is updating their own profile. So we permit..
                    return true;
                }

                return false;
            },
            /*remove: function(userId, doc) {
                //similar checks like insert
                return false;
            }*/
        });
    }
};