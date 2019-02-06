'use strict';

import Boom from 'boom';
import bcrypt from 'bcrypt';
import { path, omit } from "ramda";

const verifyUniqueUser = (request, h) => {
    // Find an entry from the database that
    // matches either the email or username
    const { db } = path(['server', 'plugins', 'lowdb'], request);

    const user = db.get('users')
        .find((user) => user.email === request.payload.email || user.username === request.payload.username)
        .value();

    console.log('verifyUniqueUser', user);

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

const getUserById = async (request, id) => {
    const { db } = path(['server', 'plugins', 'lowdb'], request);

    return db
        .get('users')
        .find(user => user.id === id)
        .map((user) => omit(['password'], user))
        .value();
};

const getUserByUsername = async (request, username) => {
    const { db } = path(['server', 'plugins', 'lowdb'], request);

    return db
        .get('users')
        .find(user => user.username === username)
        .map((user) => omit(['password'], user))
        .value();
};

const getUsersList = async (request) => {
    const { db } = path(['server', 'plugins', 'lowdb'], request);

    return db
        .get('users')
        .map((user) => omit(['password'], user))
        .value();
};

const addUser = async (request, newUser) => {
    const { db } = path(['server', 'plugins', 'lowdb'], request);

    const user = await db
        .get('users')
        .push(newUser)
        .last()
        .write();

    return user.id;
};

// bring your own validation function
const validate = async function (decoded, request) {
    // do your checks to see if the person is valid
    if (!getUserById(request, decoded.id)) {
        return { isValid: false };
    }
    else {
        return { isValid: true };
    }
};

export {
    verifyUniqueUser,
    verifyCredentials,
    getUserById,
    getUserByUsername,
    addUser,
    getUsersList,
    validate,
};