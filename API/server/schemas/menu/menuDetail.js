'use strict';

import Joi from'joi';

const menu = Joi.object().keys({
    id: Joi.string().required(),
    name: Joi.string().required(),
    dishes: Joi.array().items(Joi.string()).required(),
});

module.exports = menu;