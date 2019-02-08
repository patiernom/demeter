'use strict';

import Joi from'joi';

const createMenuSchema = Joi.object().keys({
    name: Joi.string().required().description('name of the new menu')
});

module.exports = createMenuSchema;