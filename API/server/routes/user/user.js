'use strict';

import Joi from "joi";

import { userSchema } from '../../schemas/user';
import { headersSchema } from '../../schemas/authenticate';
import { getUserByUsername } from '../../middlewares/user';
import { failAction } from "../../utils/common";

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
                tags: ['api','user'],
                description: 'Get the detail of the user',
                notes: 'Returns the details of the users if your scope is admin',
                response: {
                    schema: userSchema,
                    failAction,
                },
                validate: {
                    params: {
                        username: Joi.string().required().description('username')
                    },
                    headers: headersSchema,
                    failAction,
                },
            },
            handler: async (request, h) => {
                const user = await getUserByUsername(request, request.params.username);

                return h
                    .response(user)
                    .type('application/json')
                    .header("authorization", request.headers.authorization)
                    .code(201);
            }
        });
    }
};
