import React from 'react';
import classNames from 'classnames';
import Img from 'react-image';




export default class Spinner extends React.Component {
    componentDidMount() {

    }
    render() {
        return (
            <div className={classNames('col-lg-6','w50','v-center')}>
                <img src={'/images/bars.gif'} alt={'loading...'} />
            </div>
        );
    }
}