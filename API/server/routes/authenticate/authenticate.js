'use strict';

import createToken from '../../utils/authenticate/token';
import tokenAuthSchema from "../../schemas/authenticate/token";
import authenticateUserSchema from '../../schemas/authenticate/authenticateUser';
import { verifyCredentials } from '../../utils/user';
import { failAction } from "../../utils/common";

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
                tags: ['api'],
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