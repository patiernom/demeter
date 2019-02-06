'use strict';

import Joi from'joi';

const createUserSchema = Joi.object().keys({
    username: Joi.string().alphanum().min(2).max(30).required().description('user username'),
    email: Joi.string().email().required().description('user email'),
    password: Joi.string().required().description('user password')
});

module.exports = createUserSchema;