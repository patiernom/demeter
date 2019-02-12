'use strict';

import Boom from 'boom';
import Joi from "joi";

import { addDishSchema } from '../../schemas/menu';
import { addDish } from '../../middlewares/menu';
import { failAction }  from '../../utils/common';
import { headersSchema } from '../../schemas/authenticate';

exports.plugin = {
    name: 'addDish',
    version: '1.0.0',
    register: async (server, options) => {
        server.route({
            method: 'PUT',
            path: '/api/menu/{idMenu}/dishes/add',
            config: {
                tags: ['api','menu'],
                description: 'Add a new dish',
                notes: 'Returns the menu with the new dish',
                validate: {
                    headers: headersSchema,
                    params: {
                        idMenu: Joi.string().required().description('id of the menu')
                    },
                    payload: addDishSchema,
                    failAction,
                },
                response: {
                    status: {
                        204: Joi.any(),
                    },
                    failAction,
                },
            },
            handler: async (request, h) => {
                const menu = await addDish(request);

                if (!menu) {
                    throw Boom.badImplementation('Menu not updated');
                }

                return h
                    .response()
                    .type('application/json')
                    .header('authorization', request.headers.authorization)
                    .code(204);

            },
        });
    }
};