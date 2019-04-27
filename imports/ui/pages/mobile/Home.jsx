import React from 'react';
import classNames from 'classnames';
import LinearProgress from 'material-ui/LinearProgress';
import RaisedButton from 'material-ui/RaisedButton';
import {fullWhite} from 'material-ui/styles/colors';
import ActionAndroid from 'material-ui/svg-icons/action/android';
import FontIcon from 'material-ui/FontIcon';
import Divider from 'material-ui/Divider';
import {List, ListItem} from 'material-ui/List';
import MobileTearSheet from '../../components/shared/MobileTearSheet';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import SearchBar from 'material-ui-search-bar';
import ReactFitText from '../../components/shared/ReactFitText';


const style = {
    container: {
        position: 'relative',
    },
    refresh: {
        display: 'inline-block',
        position: 'relative',
    },
};

function handleLogout() {
    Meteor.logout(function() {
        $('body').removeClass('is-logged-in');
        $('.background-image').removeClass('hide-animatable');
    });
}
export class Home extends React.Component {
    constructor() {
        super();
        this.state={
            dataSource: []
        };
    }
    render() {
        return (
            <div className={classNames('Home')}>
                <ReactFitText minFontSize={22} compressor={0.5} maxFontSize={32} tryFitActual={true} >
                    <h1 className={classNames('')} style={{fontSize: '26px'}}>
                        Welcome to sampleapp!
                    </h1>
                </ReactFitText>
                <p>This dashboard will list your current order presumably, and provide a easy way to find things that
                    need delivered to you.</p>

                <hr/>
                <SearchBar
                    dataSource={this.state.dataSource}
                    onChange={(value) => this.setState({dataSource: [value, value + value, value + value + value]})}
                    onRequestSearch={() => console.log('onRequestSearch')}
                    style={{
                        margin: '0 auto',
                        maxWidth: 800
                    }}
                />
                <RaisedButton buttonStyle={{float: 'right'}}
                              label={"Sign Out"}
                              style={style}
                              onClick={handleLogout}
                />

                <LinearProgress mode="indeterminate"/>
                <MobileTearSheet height={250}>
                    <List>
                        <ListItem insetChildren={true} primaryText="Driver: Aaron Carter"/>
                        <ListItem insetChildren={true} primaryText="Delivery Expected:  2pm"/>
                    </List>
                    <Divider inset={true}/>
                    <List>
                        <ListItem insetChildren={true} primaryText="2x Triple-A Batteries"/>
                    </List>
                </MobileTearSheet>
            </div>
        );
    }
}

export default Home;
