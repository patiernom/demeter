'use strict';

import bcrypt from 'bcrypt';
import Boom from 'boom';
import User from '../models/User';
import createUserSchema from '../schemas/createUser';
import { verifyUniqueUser } from'../utils/user';
import createToken from '../utils/token';

function hashPassword(password, cb) {
    // Generate a salt at level 10 strength
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            return cb(err, hash);
        });
    });
}

exports.plugin = {
    name: 'register',
    version: '1.0.0',
    register: async function (server, options) {
        server.route({
            method: 'POST',
            path: '/api/register',
            config: {
                // Before the route handler runs, verify that the user is unique
                pre: [
                    { method: verifyUniqueUser }
                ],
                handler: (req, res) => {
                    let user = new User();
                    user.email = req.payload.email;
                    user.username = req.payload.username;
                    user.admin = false;
                    hashPassword(req.payload.password, (err, hash) => {
                        if (err) {
                            throw Boom.badRequest(err);
                        }
                        user.password = hash;
                        user.save((err, user) => {
                            if (err) {
                                throw Boom.badRequest(err);
                            }
                            // If the user is saved successfully, issue a JWT
                            res({ id_token: createToken(user) }).code(201);
                        });
                    });

                },
                // Validate the payload against the Joi schema
                validate: {
                    payload: createUserSchema
                }
            }
        });
    }
};