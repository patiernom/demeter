'use strict';

import Boom from "boom";
import { omit } from "ramda";
import User from "../models/User";
import { hashPassword } from "../utils/authenticate";
import { getLowDB } from "../utils/common";
import { findUserById, findUserByUsername, findAllUsers, createUser } from '../db/user';

const getUserById = async (request, id) => {
    const { db } = getLowDB(request);

    const user = await findUserById(db, id);

    return omit(['password'], user);
};

const getUserByUsername = async (request, username) => {
    const { db } = getLowDB(request);

    const user = await findUserByUsername(db, username);

    return omit(['password'], user);
};

const getUsersList = async (request) => {
    const { db } = getLowDB(request);

    return findAllUsers(db);
};

const addUser = async (request) => {
    const { db } = getLowDB(request);

    let newUser = new User();
    newUser.email = request.payload.email;
    newUser.username = request.payload.username;
    newUser.admin = false;

    try {
        newUser.password = await hashPassword(request.payload.password);
    } catch (err) {
        throw Boom.badRequest(err);
    }

    const user = await createUser(db, newUser);

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