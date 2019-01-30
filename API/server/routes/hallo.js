'use strict';

import { path } from 'ramda';

exports.plugin = {
    name: 'hallo',
    version: '1.0.0',
    register: async function (server, options) {
        server.route({
            method: 'GET',
            path: '/',
            handler: async (request, h) => {
                const { lowdb } = path(['server', 'plugins'], request);
                const { db, dsl } = lowdb;

                const user = await dsl.getUser(db, 1);

                return `Hello, world, ${user.username}!`;
            }
        });
    }
};
