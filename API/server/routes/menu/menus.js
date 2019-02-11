'use strict';

import Boom from 'boom';

import { menusSchema } from '../../schemas/menu';
import { headersSchema } from '../../schemas/authenticate';
import { getMenus } from '../../middlewares/menu';
import { failAction } from "../../utils/common";

exports.plugin = {
    name: 'menus',
    version: '1.0.0',
    register: async (server, options) => {
        server.route({
            method: 'GET',
            path: '/api/menus',
            config: {
                tags: ['api', 'menu'],
                description: 'Get the menus for the logged user',
                notes: 'Returns the list of the menus of the logged user',
                response: {
                    schema: menusSchema,
                    failAction,
                },
                validate: {
                    headers: headersSchema,
                    failAction,
                },
            },
            handler: async (request, h) => {
                const menus = await getMenus(request);

                if (!menus) {
                     throw Boom.notFound('No menu found!');
                }

                // If the user is saved successfully, issue a JWT
                return h
                    .response({ menus: menus })
                    .type('application/json')
                    .header("authorization", request.headers.authorization)
                    .code(200);
            },
        });
    }
};