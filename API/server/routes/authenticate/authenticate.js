'use strict';

import { tokenAuthSchema, authenticateUserSchema } from '../../schemas/authenticate';
import { verifyCredentials } from '../../middlewares/authenticate';
import { failAction } from "../../utils/common";
import { createToken } from "../../utils/authenticate";

exports.plugin = {
    name: 'authenticate',
    version: '1.0.0',
    register: async (server, options) => {
        server.route({
            method: 'POST',
            path: '/api/users/authenticate',
            config: {
                auth: false,
                // Check the user's password against the DB
                pre: [
                    { method: verifyCredentials, assign: 'user' }
                ],
                validate: {
                    payload: authenticateUserSchema,
                    failAction,
                },
                tags: ['api','authenticate'],
                description: 'Authenticate a user',
                notes: 'Returns the token for the user',
                response: {
                    schema: tokenAuthSchema,
                    failAction,
                },
            },
            handler: (request, h) => {
                // If the user's password is correct, we can issue a token.
                // If it was incorrect, the error will bubble up from the pre method

                return h
                    .response({ id_token: createToken(request.pre.user) })
                    .type('application/json')
                    .header("authorization", request.headers.authorization)
                    .code(201);
            },
        });
    }
};