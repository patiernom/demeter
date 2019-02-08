'use strict';

import Boom from 'boom';

import { menuSchema } from '../../schemas/menu';
import { headersSchema } from '../../schemas/authenticate';
import { getMenu } from '../../middlewares/menu';
import { failAction } from "../../utils/common";

exports.plugin = {
    name: 'menu',
    version: '1.0.0',
    register: async (server, options) => {
        server.route({
            method: 'GET',
            path: '/api/menu',
            config: {
                tags: ['api', 'menu'],
                description: 'Get the menu for the logged user',
                notes: 'Returns the name and the list of the dishes of the logged user\'s menu',
                response: {
                    schema: menuSchema,
                    failAction,
                },
                validate: {
                    headers: headersSchema,
                    failAction,
                },
            },
            handler: async (request, h) => {
                const menu = await getMenu(request);

                console.log('menu', menu);

                if (!menu) {
                     throw Boom.notFound('No menu found!');
                }

                // If the user is saved successfully, issue a JWT
                return h
                    .response({ menu: menu })
                    .type('application/json')
                    .header("authorization", request.headers.authorization)
                    .code(201);
            },
        });
    }
};