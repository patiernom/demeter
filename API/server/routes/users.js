'use strict';

import Boom from 'boom';
import Joi from'joi';
import usersSchema from '../schemas/users';
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
                },
                tags: ['api'],
                description: 'Get the list of the users',
                notes: 'Returns the list of the users if your scope is admin',
                response: {
                    schema: usersSchema,
                    failAction: async (request, h, err) => {
                        console.error('ValidationError:', err);
                        throw Boom.badRequest(`Invalid request payload input ${err.message}`);
                    }
                },
                validate: {
                    headers: Joi.object({
                        authorization: Joi.string().required().description('session token'),
                    }).pattern(/./, Joi.any()),
                    failAction: async (request, h, err) => {
                        console.error('ValidationError:', err);
                        throw Boom.badRequest(`Invalid request payload input ${err.message}`);
                    }
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