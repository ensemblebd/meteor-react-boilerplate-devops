import {Meteor} from "meteor/meteor";
import {DDP} from "meteor/ddp-client";
import { Astro } from 'meteor/jagi:astronomy';

import User from './Models/User.js';

if (Meteor.isClient) {
    DDP.onReconnect(function() {
        console.log("reconnecting ddp"); // informational notice to client console that we are remotely connecting to server.
    });


    // client side subscriptions...
    const aUser = User.findOne();
    Tracker.autorun(function () {
        Meteor.connection.subscribe('myUser', Meteor.userId());
        Meteor.connection.subscribe("allUsers");
    });
} else {
    // in server mode, make sure we define private collections, and publish the publicly available subscriptions..
    // meteor creates the user collection, so we can't try to define it: // Accounts.users = new Mongo.Collection('user');

    Meteor.publish('myUser', function(id) {
        if (this.userId) {
            return User.find(
                {_id: this.userId},
                {fields: {profile: 1, emails: 1}}
            );
        } else {
            return null;
        }
    });

    Meteor.publish('customers', function(id) {
        if (Roles.userIsInRole(this.userId, ['admin-users','super-admin'], 'admin-group')) {
            return Roles.getUsersInRole('place-orders','default-group');
        }
        return null;
    });
    Meteor.publish("allUsers", function(){
        var user = Meteor.user();
        if (Roles.userIsInRole(this.userId, ['admin-users','super-admin'], 'admin-group')){
            return Meteor.users.find();
        }
        return null;
    });

    Meteor.methods({
        updateUser: function(id, newUserData) {
            if (Roles.userIsInRole(this.userId, ['admin-users','super-admin'], 'admin-group')) {
                return Meteor.users.update({_id: id}, {
                    $set: newUserData
                });
            }
            return false;
        },
       insertUser: function(newUserData) {
           if (Roles.userIsInRole(this.userId, ['admin-users','super-admin'], 'admin-group')) {
               return Accounts.createUser(newUserData);
           }
           return false;
       },
       addUserRole: function(id,roles,group) {
           if (group === null) {
               group = Roles.GLOBAL_GROUP;
           }
           if (Roles.userIsInRole(this.userId, ['admin-users', 'super-admin'], 'admin-group')) {
               Roles.addUsersToRoles(id, roles, group);
           }
       },
        removeUserRole: function(id,roles,group) {
            if (group === null) {
                group = Roles.GLOBAL_GROUP;
            }
            if (Roles.userIsInRole(this.userId, ['admin-users', 'super-admin'], 'admin-group')) {
                Roles.removeUsersFromRoles(id, roles, group);
            }
        }
    });



}