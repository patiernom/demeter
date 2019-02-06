'use strict';

import Hapi from 'hapi';
import glob from 'glob';
import { concat, forEach } from 'ramda';

import pkg from '../package';
import { validate } from './utils/user';

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

const swaggerOptions = {
    info: {
        title: 'Demeter API Documentation',
        version: pkg.version,
    },
};

const plugins = [
    require('./plugins/lowdbConnector'),
    require('inert'),
    require('vision'),
    {
        plugin: require('hapi-swagger'),
        options: swaggerOptions
    },
    // require('./routes/authenticate'),
];

const routes = [];
const addRoute = (file) => routes.push(require(file.replace(__dirname, '.')));

const init = async () => {
    // We're giving the strategy both a name
    // and scheme of 'jwt'
    await server.register(require('hapi-auth-jwt2'));

    server.auth.strategy('jwt', 'jwt', {
        key: pkg.privateKey,          // Never Share your secret key
        validate: validate,            // validate function defined above
        verifyOptions: { algorithms: [ 'HS256' ] } // pick a strong algorithm
    });

    server.auth.default('jwt');

    // Look through the routes directory
    // and create a new route for each file
    forEach(addRoute, glob.sync('/routes/**/*.js', { root: __dirname }));

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