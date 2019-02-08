'use strict';

import Boom from 'boom';
import Joi from "joi";

import { addDishSchema, menuDetailSchema } from '../../schemas/menu';
import { addDish } from '../../middlewares/menu';
import { failAction }  from "../../utils/common";
import { headersSchema } from "../../schemas/authenticate";

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
                    schema: menuDetailSchema,
                    failAction,
                },
            },
            handler: async (request, h) => {
                const menu = await addDish(request);

                if (!menu) {
                    throw Boom.badImplementation("User not created");
                }

                console.log('menu', menu);

                // If the user is saved successfully, issue a JWT
                return h
                    .response(menu)
                    .type('application/json')
                    .header("authorization", request.headers.authorization)
                    .code(201);

            },
        });
    }
};