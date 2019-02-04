'use strict';

import Boom from 'boom';
import { getUsersList } from'../utils/user';

exports.plugin = {
    name: 'users',
    version: '1.0.0',
    register: async (server, options) => {
        server.route({
            method: 'GET',
            path: '/api/users',
            config: {
                auth: {
                    strategy: 'jwt',
                    scope: ['admin']
                }
            },
            handler: async (request, h) => {
                const users = await getUsersList(request);

                if (!users.length) {
                    throw Boom.notFound('No users found!');
                }

                // If the user is saved successfully, issue a JWT
                return h
                    .response({ users: users })
                    .type('application/json')
                    .header("Authorization", request.headers.authorization)
                    .code(201);
            },
        });
    }
};