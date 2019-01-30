'use strict';

import path from 'path';
import low from'lowdb';
import FileAsync from 'lowdb/adapters/FileAsync';

exports.plugin = {
    name: 'lowdb',
    version: '1.0.0',
    register: async function (server, options) {
        const dbDir = path.join(__dirname, '..', '..', 'data/db.json');
        const adapter = new FileAsync(dbDir);
        const db = await low(adapter);

        server.expose('db', db);
    }
};
