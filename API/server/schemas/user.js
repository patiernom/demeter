'use strict';

import Joi from'joi';

const user = Joi.object().keys({
    id: Joi.string(),
    username: Joi.string(),
    email: Joi.string().email(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    admin: Joi.bool()
});

module.exports = user;