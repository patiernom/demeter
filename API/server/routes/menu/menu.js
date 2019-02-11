'use strict';

import Boom from 'boom';
import Joi from "joi";

import { menuDetailSchema } from '../../schemas/menu';
import { headersSchema } from '../../schemas/authenticate';
import { getMenuById } from '../../middlewares/menu';
import { failAction } from "../../utils/common";

exports.plugin = {
    name: 'menu',
    version: '1.0.0',
    register: async (server, options) => {
        server.route({
            method: 'GET',
            path: '/api/menu/{idMenu}',
            config: {
                tags: ['api', 'menu'],
                description: 'Get the menu by id',
                notes: 'Returns the menu details for the provided id',
                response: {
                    schema: menuDetailSchema,
                    failAction,
                },
                validate: {
                    headers: headersSchema,
                    params: {
                        idMenu: Joi.string().required().description('id of the menu')
                    },
                    failAction,
                },
            },
            handler: async (request, h) => {
                const menu = await getMenuById(request);

                if (!menu) {
                     throw Boom.notFound('No menu found!');
                }

                // If the user is saved successfully, issue a JWT
                return h
                    .response(menu)
                    .type('application/json')
                    .header("authorization", request.headers.authorization)
                    .code(200);
            },
        });
    }
};