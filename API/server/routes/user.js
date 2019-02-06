'use strict';

import Joi from "joi";
import userSchema from '../schemas/user';
import { getUserByUsername } from'../utils/user';

exports.plugin = {
    name: 'user',
    version: '1.0.0',
    register: async (server, options) => {
        server.route({
            method: 'GET',
            path: '/api/user/{username}',
            config: {
                auth: {
                    strategy: 'jwt',
                    scope: ['admin']
                },
                tags: ['api'],
                description: 'Get the detail of the user',
                notes: 'Returns the details of the users if your scope is admin',
                response: {
                    schema: userSchema,
                    failAction: async (request, h, err) => {
                        console.error('ValidationError:', err);
                        throw Boom.badRequest(`Invalid request payload input ${err.message}`);
                    }
                },
                validate: {
                    params: {
                        username: Joi.string().required().description('username')
                    },
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
                const user = await getUserByUsername(request, request.params.username);

                console.log('user', user);

                return h
                    .response(user)
                    .type('application/json')
                    .header("authorization", request.headers.authorization)
                    .code(201);
            }
        });
    }
};
