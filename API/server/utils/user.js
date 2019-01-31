'use strict';

import Boom from 'boom';
import bcrypt from 'bcrypt';
import { path } from "ramda";

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

const verifyCredentials = (request, res) => {
    const password = req.payload.password;

    // Find an entry from the database that
    // matches either the email or username
    const { db } = path(['server', 'plugins', 'lowdb'], request);

    const user = db.get('users')
        .find((user) => user.email === request.payload.email || user.username === request.payload.username)
        .value();

    if (user) {
        bcrypt.compare(password, user.password, (err, isValid) => {
            if (isValid) {
                return h.response(user);
            }
            else {
                throw Boom.badRequest('Incorrect password!');
            }
        });
    } else {
        throw Boom.badRequest('Incorrect username or email!');
    }
};

const getUser = async (req, id) => {
    const { db } = path(['server', 'plugins', 'lowdb'], req);

    return db
        .get('users')
        .find(user => user.id === id)
        .value();
};

const addUser = async (req, newUser) => {
    const { db } = path(['server', 'plugins', 'lowdb'], req);

    const user = await db
        .get('users')
        .push(newUser)
        .last()
        .write();

    return user.id;
};

export {
    verifyUniqueUser,
    verifyCredentials,
    getUser,
    addUser,
};