'use strict';

import Boom from 'boom';

import User from '../../models/User';
import createUserSchema from '../../schemas/authenticate/createUser';
import tokenAuthSchema from "../../schemas/authenticate/token";
import createToken from '../../utils/authenticate/token';
import hashPassword from '../../utils/authenticate/password';
import { verifyUniqueUser, addUser } from '../../utils/user';
import { failAction}  from "../../utils/common";

exports.plugin = {
    name: 'register',
    version: '1.0.0',
    register: async (server, options) => {
        server.route({
            method: 'POST',
            path: '/api/users/register',
            config: {
                auth: false,
                // Before the route handler runs, verify that the user is unique
                pre: [
                    { method: verifyUniqueUser }
                ],
                // Validate the payload against the Joi schema
                validate: {
                    payload: createUserSchema,
                    failAction,
                },
                tags: ['api'],
                description: 'Register a new user',
                notes: 'Returns the token for the new user',
                response: {
                    schema: tokenAuthSchema,
                    failAction,
                },
            },
            handler: async (request, h) => {
                let user = new User();
                user.email = request.payload.email;
                user.username = request.payload.username;
                user.admin = false;

                try {
                    const password = await hashPassword(request.payload.password);

                    user.password = password;
                } catch (err) {
                    throw Boom.badRequest(err);
                }

                const newUser = await addUser(request, user);

                if (!newUser) {
                    throw Boom.badImplementation("User not created");
                }

                // If the user is saved successfully, issue a JWT
                return h
                    .response({ id_token: createToken(user) })
                    .type('application/json')
                    .header("authorization", request.headers.authorization)
                    .code(201);

            },
        });
    }
};