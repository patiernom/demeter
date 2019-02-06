'use strict';

import jwt from 'jsonwebtoken';
import pkg from '../../../package';

function createToken(user) {
    let scopes;
    // Check if the user object passed in
    // has admin set to true, and if so, set
    // scopes to admin
    if (user.admin) {
        scopes = 'admin';
    }

    // Sign the JWT
    return jwt.sign(
        { id: user.id, username: user.username, scope: scopes }, pkg.privateKey,
        { algorithm: 'HS256', expiresIn: "1h" });
}

module.exports = createToken;