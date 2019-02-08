'use strict';

import Boom from 'boom';

import { tokenAuthSchema, createUserSchema } from '../../schemas/authenticate';
import { createToken  } from '../../utils/authenticate';
import { addUser } from '../../middlewares/user';
import { verifyUniqueUser } from '../../middlewares/authenticate';
import { failAction }  from "../../utils/common";

exports.plugin = {
    name: 'register',
    version: '1.0.0',
    register: async (server, options) => {
        server.route({
            method: 'POST',
            path: '/api/users/register',
            config: {
                tags: ['api','authenticate'],
                description: 'Register a new user',
                notes: 'Returns the token for the new user',
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
                response: {
                    schema: tokenAuthSchema,
                    failAction,
                },
            },
            handler: async (request, h) => {
                const user = await addUser(request);

                if (!user) {
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