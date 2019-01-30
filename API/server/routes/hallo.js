'use strict';

exports.plugin = {
    name: 'hallo',
    version: '1.0.0',
    register: async function (server, options) {
        server.route({
            method: 'GET',
            path: '/',
            handler: async (request, h) => {
                const { server } = request;
                const { plugins } = server;
                const db = plugins.lowdb.db;

                const user = await plugins.lowdb.dls.getUser(db, 1);

                return `Hello, world, ${user.username}!`;
            }
        });
    }
};
