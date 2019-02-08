'use strict';

import Joi from'joi';

const menu = Joi.object().keys({
    menu: Joi.array().items(Joi.object().keys({
        id: Joi.string(),
        name: Joi.string(),
        dishes: Joi.array().items(Joi.string()),
    }))
});

module.exports = menu;