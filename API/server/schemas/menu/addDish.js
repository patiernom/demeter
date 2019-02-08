'use strict';

import Joi from'joi';

const addDishSchema = Joi.object().keys({
    name: Joi.string().required().description('name of the new dish')
});

module.exports = addDishSchema;