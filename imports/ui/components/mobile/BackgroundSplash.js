import React from "react";
import classNames from "classnames";
import ReactFitText from '../shared/ReactFitText';
//import Img from 'react-image'; // https://www.npmjs.com/package/react-image

// see also: https://stackoverflow.com/questions/47145075/background-image-in-react-component

// WARNING:  Do not modify this unless you are prepared to break and therefore update the splash page animation script within app.jsx

export default class BackgroundSplash extends React.Component {
    render() {
        //<img src={'/images/Background.jpg'} alt={'scenery image'} />
        return (
            <div className={classNames('full-height')} id={'sampleapp-splash'}>
                <div className={classNames('half-height','row','top-xs','center-xs')}>
                    <div className={classNames("col-xs-6",'rel')} style={{alignSelf: 'flex-end'}}>
                        <div className="logo-container">
                            <img src={'/images/Logo Mark.png'} alt={'Sampleapp Logo'} />
                        </div>
                    </div>
                </div>
                <div className={classNames('half-height','row','top-xs','font-kanit')}>
                    <div className={classNames("col-xs-12",'')} style={{alignSelf: 'flex-start'}}>

                        <div className={classNames("col-xs-9","col-s-7","col-md-6","col-lg-5",'rel','margin-auto-x')}>
                            <div className={classNames('center-xs','margin-auto-x')} style={{letterSpacing: 0.44+'em', fontWeight: 800}}>
                                <ReactFitText minFontSize={24} compressor={0.5} maxFontSize={60}>
                                    <h1 className={classNames('','margin-auto-x')} style={{}}>
                                        SAMPLEAPP
                                    </h1>
                                </ReactFitText>
                            </div>
                        </div>
                        <div className={classNames("col-xs-8","col-s-6","col-md-5","col-lg-4",'rel','margin-auto-x')}>
                            <div className={classNames('center-xs','italic','margin-auto-x')} style={{letterSpacing: 0.74+'em'}}>
                                <ReactFitText minFontSize={18} compressor={0.5} maxFontSize={42}>
                                    <h2 className={classNames('big','margin-auto-x')}>
                                        DELIVERY
                                    </h2>
                                </ReactFitText>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}