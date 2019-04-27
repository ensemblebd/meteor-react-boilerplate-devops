import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

export const USER_DATA = "USER_DATA";

export function loadUser() {
    return dispatch => {
        Tracker.autorun(() => {
            dispatch({
                type: USER_DATA,
                data: Meteor.user()
            });
        });
    };
}