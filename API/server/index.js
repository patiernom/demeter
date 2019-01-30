'use strict';

import Hapi from 'hapi';
import glob from 'glob';
import { concat } from 'ramda';
import { getUser } from'./utils/user';

// bring your own validation function
const validate = async function (decoded, request) {

    // do your checks to see if the person is valid
    if (!getUser(request, decoded.id)) {
        return { isValid: false };
    }
    else {
        return { isValid: true };
    }
};

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    // We're giving the strategy both a name
    // and scheme of 'jwt'
    await server.register(require('hapi-auth-jwt2'));
    
    server.auth.strategy('jwt', 'jwt', {
        key: 'NeverShareYourSecret',          // Never Share your secret key
        validate: validate,            // validate function defined above
        verifyOptions: { algorithms: [ 'HS256' ] } // pick a strong algorithm
    });

    server.auth.default('jwt');

    const plugins = [
        require('./plugins/lowdbConnector'),
        require('./routes/hallo'),
        require('./routes/hallo_name'),
    ];

    // Look through the routes in
    // all the subdirectories of API
    // and create a new route for each
    const routes = [];
    // glob.sync('/routes/*.js', {
    //     root: __dirname
    // }).forEach((file) => {
    //     routes.push(require(file.replace(__dirname, '.')));
    // });

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