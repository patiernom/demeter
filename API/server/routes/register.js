'use strict';

import bcrypt from 'bcrypt';
import Boom from 'boom';
import User from '../models/User';
import createUserSchema from '../schemas/createUser';
import { verifyUniqueUser, addUser } from'../utils/user';
import createToken from '../utils/token';

const hashPassword = async (password, cb) => {
    // Generate a salt at level 10 strength
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
                throw Boom.badRequest(err);
            }

            return hash;
        });
    });
};

exports.plugin = {
    name: 'register',
    version: '1.0.0',
    register: async (server, options) => {
        server.route({
            method: 'POST',
            path: '/api/users/register',
            config: {
                // Before the route handler runs, verify that the user is unique
                pre: [
                    { method: verifyUniqueUser }
                ],
                // Validate the payload against the Joi schema
                validate: {
                    payload: createUserSchema
                }
            },
            handler: async (request, h) => {
                let user = new User();
                user.email = request.payload.email;
                user.username = request.payload.username;
                user.admin = false;
                user.password = await hashPassword(request.payload.password);

                const newUser = await addUser(request, user);

                if (!newUser) {
                    throw Boom.badImplementation("User not created");
                }
                
                // If the user is saved successfully, issue a JWT
                return h
                    .response({ id_token: createToken(user) })
                    .type('application/json')
                    .header("Authorization", request.headers.authorization)
                    .code(201);

            },
        });
    }
};