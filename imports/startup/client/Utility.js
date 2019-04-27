

export function checkUserLoggedIn() {
    if (!Meteor.user()) return false;
    else return true;
}