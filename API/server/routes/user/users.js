'use strict';

import Boom from 'boom';

import usersSchema from '../../schemas/user/users';
import headersSchema from "../../schemas/authenticate/headers";
import { getUsersList } from '../../utils/user';
import { failAction } from "../../utils/common";

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
                },
                tags: ['api'],
                description: 'Get the list of the users',
                notes: 'Returns the list of the users if your scope is admin',
                response: {
                    schema: usersSchema,
                    failAction,
                },
                validate: {
                    headers: headersSchema,
                    failAction,
                },
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
                    .header("authorization", request.headers.authorization)
                    .code(201);
            },
        });
    }
};