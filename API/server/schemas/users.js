'use strict';

import Joi from'joi';

const users = Joi.object().keys({
    users: Joi.array().items(Joi.object().keys({
        id: Joi.string(),
        username: Joi.string(),
        email: Joi.string().email(),
        firstName: Joi.string(),
        lastName: Joi.string(),
        admin: Joi.bool()
    }))
});

module.exports = users;