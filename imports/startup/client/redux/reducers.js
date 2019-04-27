import { USER_DATA } from './actions';

const initialUser = {
    username: '',
    userid: '',
    email: ''
};

function userReducer(state = initialUser, action) {
    switch(action.type) {
        case USER_DATA:
            return {
                username: action.data && action.data.username,
                email: action.data && action.data.emails[0].address,
                userid: action.data && action.data._id
            };
        default:
            return state;
    }
}