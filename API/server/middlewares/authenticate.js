import { path } from "ramda";
import Boom from "boom";
import bcrypt from "bcrypt";

import { findUserByUserOrEmail } from '../db/user';

const verifyUniqueUser = async (request, h) => {
    // Find an entry from the database that
    // matches either the email or username
    const { db } = path(['server', 'plugins', 'lowdb'], request);

    const user = await findUserByUserOrEmail(db, request.payload.username, request.payload.email);

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

const verifyCredentials = async (request, h) => {
    const password = request.payload.password;

    // Find an entry from the database that
    // matches either the email or username
    const { db } = path(['server', 'plugins', 'lowdb'], request);

    const user = await findUserByUserOrEmail(db, request.payload.username, request.payload.email);

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
}