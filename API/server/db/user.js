'use strict';

import { omit, partial } from "ramda";

const finderId = (id, user) => user.id === id;
const finderUsername = (username, user) => user.username === username;
const finderUsernameOrEmail = (username, email, user) => user.email === email || user.username === username;

const findUser = async (db, finder) => db
    .get('users')
    .find(finder)
    .value();

const findUserById = async (db, id) => findUser(db, partial(finderId, [id]));
const findUserByUsername = async (db, username) => findUser(db, partial(finderUsername, [username]));
const findUserByUserOrEmail = async (db, username, email) => findUser(db, partial(finderUsernameOrEmail, [username, email]));
const findAllUsers = async (db) => db
    .get('users')
    .map((user) => omit(['password'], user))
    .value();

const createUser = async (db, newUser) => db
    .get('users')
    .push(newUser)
    .last()
    .write();

export {
    findUserById,
    findUserByUsername,
    findUserByUserOrEmail,
    findAllUsers,
    createUser
}