'use strict';

import { getUser } from'../utils/user';

exports.plugin = {
    name: 'hallo',
    version: '1.0.0',
    register: async (server, options) => {
        server.route({
            method: 'GET',
            path: '/',
            config: { auth: false },
            handler: async (request, h) => {
                const user = await getUser(request, 1);

                return h
                    .response({
                        message: `Hello, world, ${user.firstName} ${user.lastName} alias ${user.username}!`,
                        text: `You don\'t used a Token!`});
            }
        });
    }
};
