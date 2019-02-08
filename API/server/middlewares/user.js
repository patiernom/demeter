'use strict';

import { path, omit } from "ramda";

const getUserById = async (request, id) => {
    const { db } = path(['server', 'plugins', 'lowdb'], request);

    const user = await db
        .get('users')
        .find(user => user.id === id)
        .value();

    return omit(['password'], user);
};

const getUserByUsername = async (request, username) => {
    const { db } = path(['server', 'plugins', 'lowdb'], request);

    const user = await db
        .get('users')
        .find(user => user.username === username)
        .value();

    return omit(['password'], user);
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
    getUserById,
    getUserByUsername,
    addUser,
    getUsersList,
    validate,
};