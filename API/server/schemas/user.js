'use strict';

import Joi from'joi';

const user = Joi.object().keys({
    id: Joi.string(),
    username: Joi.string(),
    email: Joi.string(),
    firstName: Joi.string(),
    lastName: Joi.string(),
});

module.exports = user;