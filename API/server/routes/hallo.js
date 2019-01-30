'use strict';

import { path } from 'ramda';
import { getUser } from'../utils/user';

exports.plugin = {
    name: 'hallo',
    version: '1.0.0',
    register: async function (server, options) {
        server.route({
            method: 'GET',
            path: '/',
            config: { auth: 'jwt' },
            handler: async (request, h) => {
                const { db } = path(['server', 'plugins', 'lowdb'], request);

                const user = await getUser(db, 1);

                return h
                    .response({ message: `Hello, world, ${user.username}!`, text: 'You used a Token!'})
                    .type('application/json')
                    .header("Authorization", request.headers.authorization);
            }
        });
    }
};
