'use strict';

import Boom from 'boom';

import { createMenuSchema } from '../../schemas/menu';
import { addMenu } from '../../middlewares/menu';
import { failAction }  from "../../utils/common";
import { headersSchema } from "../../schemas/authenticate";

exports.plugin = {
    name: 'addMenu',
    version: '1.0.0',
    register: async (server, options) => {
        server.route({
            method: 'POST',
            path: '/api/menu/add',
            config: {
                tags: ['api','menu'],
                description: 'Add a new menu',
                notes: 'Returns the the id of the new menu',
                validate: {
                    headers: headersSchema,
                    payload: createMenuSchema,
                    failAction,
                }
            },
            handler: async (request, h) => {
                const menu = await addMenu(request);

                if (!menu) {
                    throw Boom.badImplementation("menu not created");
                }

                // If the user is saved successfully, issue a JWT
                return h
                    //.response({ id_menu: menu })
                    .type('application/json')
                    .header("authorization", request.headers.authorization)
                    //.header("location", request.headers.authorization)
                    .code(204);

            },
        });
    }
};