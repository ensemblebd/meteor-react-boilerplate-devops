import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Class } from 'meteor/jagi:astronomy';
import Phone from './Phone';
import i18n from '../i18n/i18n';
import {check} from 'meteor/check';

const Address = Class.create({
   name: 'Address',
   fields: {
       title: String,
       street: String,
       street2: {
           type: String,
           optional: true
       },
       city: String,
       state: {
           type: String,
           validators: [{
               type: 'length',
               param: 2
           }, {
               type: 'regexp',
               param: /[A-Z]{2}/
           }]
       },
       zip: String,
   },
    resolveError({ nestedName, validator }) {
        return i18n.get(`address.${nestedName}.${validator}`);
    },
    helpers: {
        where() {
            return this.city + ', ' + this.state;
        }
    }
});
const UserProfile = Class.create({
    name: 'UserProfile',
    fields: {
        nickname: {
            type: String,
            optional: true
        },
        firstName: {
            type: String,
            validators: [{
                type: 'minLength',
                param: 2
            }]
        },
        lastName: {
            type: String,
            validators: [{
                type: 'minLength',
                param: 2
            }]
        },
        addresses: {
            type: [Address],
            optional: true
        },
        phones: {
            type: [Phone],
            optional: true
        },
        birthDate: {
            type: Date,
            optional: true,
            validators: [{
                type: 'lte',
                resolveParam() {
                    var date = new Date();
                    return date.setFullYear(date.getFullYear() - 18);
                }
            }]
        },
        age: {
            type: Number,
            optional: true,
            transient: true
        },
    },
    meteorMethods: {
        rename(firstName, lastName) {
            this.firstName = firstName;
            this.lastName = lastName;
            return this.save();
        }
    }
});


const User = Class.create({
    name: 'User',
    collection: Meteor.users,
    fields: {
        isBlocked: {
            type: Boolean,
            default: function() {
                return false;
            }
        },
        createdAt: {
            type: Date,
            default: function() {
                return new Date();
            }
        },
        profile: {
            type: UserProfile,
            optional: true
        }
    },
    resolveError({ nestedName, validator }) {
        return i18n.get(`user.${nestedName}.${validator}`);
    },
    events: {
        afterInit(e) {
            //e.target.calculateAge();
        }
    },
    helpers: {
        calculateAge() {
            if (this.birthDate) {
                const diff = Date.now() - this.profile.birthDate.getTime();
                this.age = Math.abs((new Date(diff)).getUTCFullYear() - 1970);
            }
        },
        fullName() {
            return `${this.profile.firstName} ${this.profile.lastName}`;
        },
        formattedBirthDate() {
            const date = this.profile.birthDate;
            if (date) {
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();
                if (month < 10) {
                    month = `0${month}`;
                }
                if (day < 10) {
                    day = `0${day}`;
                }
                return `${year}-${month}-${day}`;
            }
        }
    },
    secured: {
        update: false
    }

});

if (Meteor.isServer) {
    User.extend({
        fields: {
            services: Object
        }
    });
} else {
    /* example purposes.. disabled for seccurity..
    User.extend({
        meteorMethods: {
            create() {
                return this.save();
            },
            rename_ss(firstName, lastName) {
                this.profile.firstName = firstName;
                this.profile.lastName = lastName;
                return this.save();
            }
        }
    });*/
}

export default User;