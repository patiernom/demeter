'use strict';

import authenticateUserSchema from '../schemas/authenticateUser';
import { verifyCredentials } from'../utils/user';
import createToken from '../utils/token';

exports.plugin = {
    name: 'authenticate',
    version: '1.0.0',
    register: async (server, options) => {
        server.route({
            method: 'POST',
            path: '/api/users/authenticate',
            config: {
                // Check the user's password against the DB
                pre: [
                    { method: verifyCredentials, assign: 'user' }
                ],
                validate: {
                    payload: authenticateUserSchema
                }
            },
            handler: (request, h) => {
                // If the user's password is correct, we can issue a token.
                // If it was incorrect, the error will bubble up from the pre method
                return h
                    .response({ id_token: createToken(request.pre.user) })
                    .type('application/json')
                    .header("Authorization", request.headers.authorization)
                    .code(201);
            },
        });
    }
};