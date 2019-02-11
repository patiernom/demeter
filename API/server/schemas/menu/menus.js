'use strict';

import Joi from'joi';

const menus = Joi.object().keys({
    menus: Joi.array().items(Joi.object().keys({
        id: Joi.string(),
        name: Joi.string(),
    }))
});

module.exports = menus;