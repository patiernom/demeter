'use strict';

import Hapi from 'hapi';

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    await server.register([
        require('./plugins/lowdbConnector'),
        require('./routes/hallo'),
        require('./routes/hallo_name'),
    ]);

    await server.start();

    return server;
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init()
    .then((server) => console.log(`Server running at: ${server.info.uri}`))
    .catch((error) => console.error(`Unable to start the server: ${error}`));