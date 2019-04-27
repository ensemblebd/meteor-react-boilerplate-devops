import React from "react";
import classNames from "classnames";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from "material-ui/styles/getMuiTheme";
import darkBaseTheme from "material-ui/styles/baseThemes/darkBaseTheme";
import _ from 'lodash';

const custom_dark = {
    fontFamily: '"Work Sans", sans-serif',
    borderRadius: 8,
    palette: {
        textColor: '#FFFFFF',
        canvasColor: '#303030',
    }
};
const theme_dark = (_.merge(darkBaseTheme, custom_dark));

export default class _Layout extends React.Component {
    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(theme_dark)}>
                <div className={classNames('flex-center-container','col-xs-11','col-md-10','col-lg-8','margin-auto-x','full-height-force','transition-item','transition-leave','transition-appear')} style={{minHeight: "360px"}}>
                    {this.props.children}
                </div>
            </MuiThemeProvider>
        );
    }
}