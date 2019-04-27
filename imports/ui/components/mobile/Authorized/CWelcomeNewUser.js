import React from "react";
import classNames from "classnames";
import { Accounts, STATES } from 'meteor/std:accounts-ui';
import { CRequireAuth } from '../../shared/AuthorizeComponents';
import ReactFitText from '../../shared/ReactFitText';
import _Layout from '../_Layout';


export default class CWelcomeNewUser extends React.Component {
    constructor(props){
        super(props);
    }
    componentDidMount() {
        $('body').addClass('is-logged-in');
        $('.background-image').addClass('hide-animatable');
    }
    handleClick(event) {
        event.preventDefault();
        this.props.history.push("/");
    }
    render() {
        return (
            <CRequireAuth layoutContainer={<_Layout/>}>
                <section className={classNames('main')}>
                    <div className={'row'}>
                        <div className={classNames('col-xs-10','col-sm-9','col-md-7','col-lg-5', 'text-center')}>
                            <div className={'row'}>
                                <ReactFitText minFontSize={16} compressor={0.5} maxFontSize={28} tryFitActual={false} >
                                    <h1 className={classNames('font-sans','big','w100')}>
                                        You're in!
                                    </h1>
                                </ReactFitText>
                            </div>
                            <div className={'row'}>
                                <ReactFitText minFontSize={16} compressor={0.5} maxFontSize={28} tryFitActual={false} >
                                    <h1 className={classNames('font-sans','big','w100')}>
                                        Think of Sampleapp as your own personal assistant.
                                    </h1>
                                </ReactFitText>
                            </div>
                            <div className={classNames('row','font-sans','big')}>
                                <ReactFitText minFontSize={16} compressor={0.5} maxFontSize={28} tryFitActual={false} >
                                    <h1 className={classNames('font-sans','big','w100')}>
                                        Order anything:<br />
                                        Food, Asprin, Socks,
                                        whatever you need!
                                    </h1>
                                </ReactFitText>
                            </div>
                            <div>{/* add some spacing. The system centers the content in it's parent container (height of screen minus logo bar 96px), so larger inner contents = better vertical positioning per the design */}
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                            </div>
                        </div>
                    </div>
                </section>
                <div className={classNames("col-xs-11",'col-sm-10','col-md-8','col-lg-6','rel','center-xs','w100','login-form')} style={{alignSelf: 'flex-end', position: 'absolute', bottom: '0px'}}>
                    <Accounts.ui.Buttons buttons={[{
                        id: 'finish',
                        label: 'Take me to my dashboard',
                        type: 'submit',
                        className: classNames('active'),
                        onClick: this.handleClick.bind(this)
                    }]}/>
                </div>
            </CRequireAuth>
        );
    }
}