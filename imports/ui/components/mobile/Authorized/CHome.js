import React from "react";
import { Redirect } from 'react-router-dom';
import User from "../../../../api/Models/User";
import { CRequireAuth } from '../../shared/AuthorizeComponents';
import Home from '../../../pages/mobile/Home.jsx';

export default class CHome extends React.Component {
    render() {
        let needs_info = true;
        try {
            let user = User.findOne(Meteor.userId());
            let first=user.profile.firstName;
            let last =user.profile.lastName;
            if (first.length >=2 && last.length >=2) {
                needs_info=false;
            }
        }catch(e) {}
        return (
            <CRequireAuth redirectTo={"/na-welcome"}>
                {(!needs_info) ?
                    <Home/>
                    : <Redirect push to={"/new-account"}/>
                }
            </CRequireAuth>

        );
    }
}