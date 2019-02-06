'use strict';

import hashPassword from "./password";
import createToken from './token';
import {path} from "ramda";
import Boom from "boom";
import bcrypt from "bcrypt";

const verifyUniqueUser = (request, h) => {
    // Find an entry from the database that
    // matches either the email or username
    const { db } = path(['server', 'plugins', 'lowdb'], request);

    const user = db.get('users')
        .find((user) => user.email === request.payload.email || user.username === request.payload.username)
        .value();

    // Check whether the username or email
    // is already taken and error out if so
    if (user) {
        if (user.username === request.payload.username) {
            throw Boom.badRequest('Username taken');
        }
        if (user.email === request.payload.email) {
            throw Boom.badRequest('Email taken');
        }
    }
    // If everything checks out, send the payload through
    // to the route handler
    return h.response(request.payload);
};

const verifyCredentials = (request, h) => {
    const password = request.payload.password;

    // Find an entry from the database that
    // matches either the email or username
    const { db } = path(['server', 'plugins', 'lowdb'], request);

    const user = db.get('users')
        .find((user) => user.email === request.payload.email || user.username === request.payload.username)
        .value();

    if (user) {
        return bcrypt
            .compare(password, user.password)
            .then((isValid) => {
                if (isValid) {
                    return h.response(user);
                }

                else {
                    throw Boom.badRequest('Incorrect password!');
                }
            })
            .catch((err)=> Boom.badImplementation(err));
    } else {
        throw Boom.badRequest('Incorrect username or email!');
    }
};

export {
    verifyUniqueUser,
    verifyCredentials,
    hashPassword,
    createToken,
}