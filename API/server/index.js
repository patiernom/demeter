'use strict';

import Hapi from 'hapi';
import glob from 'glob';
import { concat } from 'ramda';
import Inert from'inert';
import Vision from'vision';
import HapiSwagger from 'hapi-swagger';
import pkg from '../package';
import { validate } from './utils/user';

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    // We're giving the strategy both a name
    // and scheme of 'jwt'
    await server.register(require('hapi-auth-jwt2'));

    server.auth.strategy('jwt', 'jwt', {
        key: pkg.privateKey,          // Never Share your secret key
        validate: validate,            // validate function defined above
        verifyOptions: { algorithms: [ 'HS256' ] } // pick a strong algorithm
    });

    server.auth.default('jwt');

    const swaggerOptions = {
        info: {
            title: 'Demeter API Documentation',
            version: pkg.version,
        },
    };

    const plugins = [
        require('./plugins/lowdbConnector'),
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        },
        // require('./routes/authenticate'),
    ];

    // Look through the routes directory
    // and create a new route for each file
    const routes = [];
    const addRoute = (file) => routes.push(require(file.replace(__dirname, '.')));

    glob.sync('/routes/*.js', { root: __dirname }).forEach(addRoute);

    await server.register(concat(plugins, routes));
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