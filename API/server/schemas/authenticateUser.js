'use strict';

import Joi from'joi';

const authenticateUserSchema = Joi.alternatives().try(
    Joi.object({
        username: Joi.string().alphanum().min(2).max(30).required().description('user username'),
        password: Joi.string().required().description('user password')
    }),
    Joi.object({
        email: Joi.string().email().required().description('user email'),
        password: Joi.string().required().description('user password')
    })
);

module.exports = authenticateUserSchema;