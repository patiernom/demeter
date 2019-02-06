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
                },
                validate: {
                    params: {
                        username: Joi.string().required().description('username')
                    },
                    headers: {
                        Authorization: Joi.string().required().description('session token')
                    },
                },
            },
            handler: async (request, h) => {
                const user = await getUserByUsername(request, request.params.username);

                return h
                    .response({message: `Hello, world, ${user.firstName} ${user.lastName} alias ${user.username}!`});
            }
        });
    }
};
