'use strict';

import Joi from'joi';

const createMenuSchema = Joi.object().keys({
    id: Joi.string().required().description('id of the new menu')
});

module.exports = createMenuSchema;