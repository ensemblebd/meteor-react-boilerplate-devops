import React from "react";
import classNames from "classnames";
import {checkUserLoggedIn} from "../../../startup/client/Utility";
//import Img from 'react-image'; // https://www.npmjs.com/package/react-image
// see also: https://stackoverflow.com/questions/47145075/background-image-in-react-component
export default class BackgroundImage extends React.Component {
    componentDidMount() {

    }
    render() {
        //<img src={'/images/Background.jpg'} alt={'scenery image'} />
        return (
           <div className={classNames('background-image','full-screen','fixed-tl')} />
        );
    }
}