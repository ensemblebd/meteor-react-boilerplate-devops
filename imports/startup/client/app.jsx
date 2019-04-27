import { Meteor } from 'meteor/meteor';
import React from 'react';
// TrackerReact is imported (default) with Meteor 1.3 new module system
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import classNames from "classnames";

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Colors from 'material-ui/styles/colors';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import _colorManipulator from 'material-ui/utils/colorManipulator';
import AppCanvas from 'material-ui/internal/AppCanvas.js';
import injectTapEventPlugin from 'react-tap-event-plugin';

import CMobileAppBar from '../../ui/components/mobile/AppBar.js';
import CAdminAppBar from '../../ui/components/web/AppBar.js';
import RoutesLayout_ForAdminWebServer from '../../ui/components/RoutesLayout_ForAdminWebServer.jsx';
import RoutesLayout_ForMobile from '../../ui/components/RoutesLayout_ForMobile.jsx';
import Spinner from '../../ui/components/shared/Spinner.js';
import {createHistory} from 'history';
import BackgroundImage from '../../ui/components/shared/BackgroundImage.js';
import BackgroundSplash from '../../ui/components/mobile/BackgroundSplash';
import Preload from 'react-preloaded';
import {checkUserLoggedIn} from "./Utility";
import _ from 'lodash';

const custom_light = {
    fontFamily: '"Work Sans", sans-serif',
    borderRadius: 8,
    palette: {
        textColor: '#4D4D4F',
        canvasColor: Colors.white,

        //f97a66, 03b3d1,
        primary1Color: '#222A3A',
        primary2Color: Colors.cyan700,
        primary3Color: Colors.grey400,
        alternateTextColor: Colors.white,
        pickerHeaderColor: '#222A3A',
        accent1Color: '#f97a66',

        // light-theme defaults follow:
        //accent2Color: Colors.grey100,
        //accent3Color: Colors.grey500,
        //secondaryTextColor: (0, _colorManipulator.fade)(Colors.darkBlack, 0.54),

        //borderColor: Colors.grey300,
        //disabledColor: (0, _colorManipulator.fade)(Colors.darkBlack, 0.3),
        //clockCircleColor: (0, _colorManipulator.fade)(Colors.darkBlack, 0.07),
        //shadowColor: Colors.fullBlack
    },
    appBar: {
        //height: 60
    }
};

const theme_light = (_.merge(lightBaseTheme,custom_light));
const history = createHistory();

const unlisten = history.listen(location => {
    console.log("[Location Monitor] change:"+location.pathname);
})

export default class App extends TrackerReact(React.Component) {
    constructor(props) {
        super(props);

        // super important for material UI to function properly...
        try {
            injectTapEventPlugin();/* enable the following if ONLY using touch devices... ({
                shouldRejectClick: function (lastTouchEventTimestamp, clickEventTimestamp) {
                    return true;
                }
            });*/
        } catch(E) {
            console.log(E);
        }

        // set cordova storage default path (ios for meteors builtin local copy of mongo instance for user)
        if (Meteor.isCordova) {
            try {
                this.onfigurePlugin('cordova-plugin-file', {
                    iosPersistentFileLocation: 'Library'
                });
            }catch(E) {}
        }
        // configure default state for this application-level component (root view)
        this.state = {
            loading:true, // should we show a loading screen currently?
            isMobile:true, // force mobile view by default?
            example: 0, // remove me
            isLoggedIn:false, // user is logged in or not?
            preLoading: true,  // Are we currently preloading assets like images/fonts?
            hasShownSplashOnce:false,  // have we shown the splash once, and then should not show it again in future?
            isDeveloperBarDisabled:false,  // if user has a developer email, give them a dev toolbar on mobile viewport (todo: made a database value/flag for user)
        };

        // if using es6, switch to arrow function instead of manual scope bindings below:   (e) => {...}
        this.developerFrontEndModeToggleHandler = this.developerFrontEndModeToggleHandler.bind(this);
        this.developerToggleMobileBarHandler = this.developerToggleMobileBarHandler.bind(this);
        this.refreshStateHandler = this.refreshStateHandler.bind(this);
        this.signOutHandler = this.signOutHandler.bind(this);
        this.onSignedInHandler = this.onSignedInHandler.bind(this);
        this._handleImageLoadError = this._handleImageLoadError.bind(this);
        this._handleImageLoadSuccess = this._handleImageLoadSuccess.bind(this);
        this._transition_dark2light = this._transition_dark2light.bind(this);

        // configure the accounts ui to utilize the scsope of THIS component when the callback for on-signed-in is triggered. (That way we can update the state and "do things")
        this.props.accountsUISetupFunc(this.onSignedInHandler);
    }
    componentWillUnmount() {
        unlisten();
    }
    componentDidMount() {

    }
    componentWillMount() {

    }

    isLoading() {
        // we have to handle some of the routing, since react-router is incapable in the context of a callback. We have installed the history package it recommends, and utilize that..
        // settimeout is to prevent race condition on current load order with new state triggering unmounting of components and thus rerendering
        if (!this.state.preLoading && this.state.loading && Accounts.loginServicesConfigured()) {// && this.state.hasFontsLoaded) { // https://gitlab.com/pekkis/react-webfont-loader#readme   or    https://forums.meteor.com/t/adding-google-fonts/1095/2
            let self = this;
            if (Meteor.user()!==null && history.getCurrentLocation().pathname == "/login") {
                history.push('/','/');
                Meteor.setTimeout(function() {
                    self.setState({loading: false});
                },1);
            } else {
                Meteor.setTimeout(function() {
                    self.setState({loading: false, example: 1});
                },1);
            }
        }
        return this.state.loading;
    }

    onSignedInHandler() {
        console.log("user signed in.");
        this._transition_dark2light();
    }
    developerFrontEndModeToggleHandler(e) {
        e.preventDefault();
        let self = this;
        self.setState((state)=>({
           isMobile: !state.isMobile,
            loading: true
        }), function() {
            console.log("Switched state: "+this.state.isMobile);
            setTimeout(function() {
                self.setState({loading: false});
            },1500);
        });
    }
    developerToggleMobileBarHandler(e) {
        e.preventDefault();
        let self=this;
        self.setState((state)=>({
            isDeveloperBarDisabled: !state.isDeveloperBarDisabled,
            loading: true
        }), function() {
            console.log("Switched toggle for mobile bar: "+this.state.isDeveloperBarDisabled);
            setTimeout(function() {
                self.setState({loading: false});
            },1500);
        });
    }
    refreshStateHandler(e) {
        e.preventDefault();
        let self = this;
        self.setState({
            loading: true
        }, function() {
            console.log("Refreshed state.");
            setTimeout(function() {
                self.setState({loading: false});
            },1500);
        });
    }
    signOutHandler(e) {
        e.preventDefault();
        $('body').removeClass('is-logged-in');
        $('.background-image').removeClass('hide-animatable');
        let self=this;
        Meteor.logout(function(err) {
            console.log("you have been logged out.");
            self.setState({
                isLoggedIn: false,
                loading: true
            }, function() {
                console.log("refresh should occur due to logout state change.");
            });
        });
    }
    isMobileView() {
        if (Meteor.isDevelopment) {
            if (typeof(Meteor.settings.public.dev)!=='undefined' && typeof(Meteor.settings.public.dev.forceMobileInDev)==='boolean') {
                return Meteor.settings.public.dev.forceMobileInDev;
            }
            if (this.state.isMobile) {
                return true;
            }
            else return false;
        }
        else return ( Meteor.isCordova || Meteor.Device.isPhone() || (!Meteor.Device.isDesktop()) );
    }
    _handleImageLoadError() {
        let self=this;
        self._transition_from_splash(self);
    }
    _handleImageLoadSuccess() {
        let self=this;
        self._transition_from_splash(self);
    }
    _transition_dark2light() {
        if (history.getCurrentLocation().pathname !== "/new-account") {
            $('body').addClass('is-logged-in');
            $('.background-image').addClass('hide-animatable');
        }
    }
    _transition_from_splash(self) {
        // all of these animation changes to original component will be reset when it's displayed again, so we need not "clean up" anything.
        setTimeout(function() {

            let original = $('.logo-container');

            let clone = original.clone();
            clone.addClass('fixed-tl transition-ease center-xs').css({width: original.width(), padding: original.css('padding'), 'z-index':1}).offset(original.offset());
            clone.find('img').addClass('transition-ease').css({width: original.find('img').width(), height: original.find('img').height()});
            clone.prependTo('#app > div[data-reactroot]');
            setTimeout(function() {
                original.animate({opacity: 0},200,'swing',function() {

                });
                clone.addClass('do-animate');
                setTimeout(function() {
                    clone.find('img').addClass('margin-auto-x col-xs-10 col-sm-8 col-md 8');
                    setTimeout(function() {
                        clone.removeClass('transition-ease').css('width','').addClass('done-moving');

                        let text_items=original.parents('.half-height').next().find('h1,h2'); //sampleapp-splash
                        $(text_items[0]).animate({'margin-left': -9999},1700,'easeOutBounce', null);
                        $(text_items[1]).animate({'margin-right': -9999},1700,'easeOutBounce', null);

                        setTimeout(function() { // now we are done animating everything, we can hide the splash.
                            $('body').addClass('is-loaded');
                            $('.background-image').addClass('transition-ease');
                            if (checkUserLoggedIn()) {
                                self._transition_dark2light();
                            }
                            self.setState({preLoading: false, hasShownSplashOnce: true});
                        },800);
                    },1200); // end of image scaling animation
                },1200); // end of centering (scaling) animation // 1200s timing matches css transition. aka, run this func as soon as previous animation is done.
            },500);// end of primary (north) movement animation
        },600);//end of delayed splash animation unreveal
    }
    isUserDeveloper() { // only show the topbar in mobile, on developer account.
        if (!checkUserLoggedIn()) return false;
        return (Meteor.user().emails[0].address.indexOf("mycompany.com")!==-1);
    }
    hasAppBar() {
        if (!this.isMobileView()) return true;
        else {
            if (this.isUserDeveloper()) {
                return !(this.state.isDeveloperBarDisabled);
            } else return false;
        }
    }

    render() {
        let images=['images/Background.jpg','images/Logo Mark.png'];
        // muithemeprovider is REQUIRED to use material ui, and the container div is ALSO needed (the one with className = main-content).

        /* Lots of conditional logic here. Basically we have the following concept:
            Material UI & Canvas
            Preloader ---  Show background color until we have preloaded the BackgroundImage component. This makes it possible to display the BackgroundSplash component on initial loadup.
            * Is Application loading?
            |----> Yes: Are we in a mobile view?
                    -> No: Have we shown the splash once?
                        -> Yes:  Show spinner gif.
                        -> No: Show app splash page, per gerald design
                    -> Yes: Show spinner gif.
            |----> No: Show div containing main application.
                    -> Are we in mobile view?
                    |----> Yes: Is the user a developer and is the devbar enabled?
                            -> Yes: Show mobile appbar at top of screen
                            -> No: Show empty div
                    |----> No:  Show AppBar for desktop (admin page)
                    ------
                    Also show the PageLayout depending on if it's mobile or desktop. This flow is dictated by the react-router-4 approach with JSX.
        * */

        let main_content_classNames=classNames("main-content", (this.isMobileView())?'is-mobile':'is-desktop', 'container','full-height-force',(this.hasAppBar())?'has-app-bar':'');
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(theme_light)}>
                <AppCanvas>
                    <Preload
                        loadingIndicator={<div className={classNames(((this.isMobileView())?'bg-default':''),'full-screen','fixed-tl')}> </div>}
                        images={images}
                        autoResolveDelay={3000}
                        onError={this._handleImageLoadError}
                        onSuccess={this._handleImageLoadSuccess}
                        resolveOnError={true}
                        mountChildren={true}
                    >
                        {(this.isMobileView())?
                            <BackgroundImage />
                            :<div className={"hidden"} />
                        }
                    </Preload>
                    {this.isLoading() ? (
                        (this.isMobileView())?
                            ((!this.state.hasShownSplashOnce)?
                                <BackgroundSplash />: <Spinner />)
                            : <Spinner />
                    ) : (<div>
                        {(this.isMobileView())
                            ? (this.isUserDeveloper() && !this.state.isDeveloperBarDisabled)?
                                <CMobileAppBar signOutHandler={this.signOutHandler} mobileBarHandler={this.developerToggleMobileBarHandler} devModeHandler={this.developerFrontEndModeToggleHandler} refreshStateHandler={this.refreshStateHandler} />
                                :<div className={"hidden"} />
                            : <div className={"hidden"}/>
                        }
                        {(this.isMobileView())
                            ? <RoutesLayout_ForMobile intendedContainerClassNames={main_content_classNames} />
                            : <RoutesLayout_ForAdminWebServer intendedContainerClassNames={main_content_classNames} doShowAppBar={checkUserLoggedIn()} componentAppBar={
                                <CAdminAppBar signOutHandler={this.signOutHandler} devModeHandler={this.developerFrontEndModeToggleHandler} refreshStateHandler={this.refreshStateHandler} />
                            }  />
                        }
                    </div>)}
                </AppCanvas>
            </MuiThemeProvider>
        );
    }
};
