'use strict';

import Boom from 'boom';
import bcrypt from 'bcrypt';
import { path } from "ramda";

const verifyUniqueUser = (req, res) => {
    // Find an entry from the database that
    // matches either the email or username
    const { db } = path(['server', 'plugins', 'lowdb'], req);

    const user = db.get('users')
        .find((user) => user.email === req.payload.email || user.username === req.payload.username)
        .value();

    // Check whether the username or email
    // is already taken and error out if so
    if (user) {
        if (user.username === req.payload.username) {
            res(Boom.badRequest('Username taken'));
        }
        if (user.email === req.payload.email) {
            res(Boom.badRequest('Email taken'));
        }
    }
    // If everything checks out, send the payload through
    // to the route handler
    res(req.payload);
};

const verifyCredentials = (req, res) => {
    const password = req.payload.password;

    // Find an entry from the database that
    // matches either the email or username
    const { db } = path(['server', 'plugins', 'lowdb'], req);

    const user = db.get('users')
        .find((user) => user.email === req.payload.email || user.username === req.payload.username)
        .value();

    if (user) {
        bcrypt.compare(password, user.password, (err, isValid) => {
            if (isValid) {
                res(user);
            }
            else {
                res(Boom.badRequest('Incorrect password!'));
            }
        });
    } else {
        res(Boom.badRequest('Incorrect username or email!'));
    }
};

const getUser = (req, id) => {
    const { db } = path(['server', 'plugins', 'lowdb'], req);

    return db
        .get('users')
        .find(user => user.id === id)
        .value();
};

export {
    verifyUniqueUser,
    verifyCredentials,
    getUser,
};