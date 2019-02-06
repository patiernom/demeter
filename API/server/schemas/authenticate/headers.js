'use strict';

import Joi from'joi';

const headers = Joi.object({
        authorization: Joi.string().required().description('session token'),
    })
    .pattern(/./, Joi.any());

module.exports = headers;