'use strict';

import Joi from'joi';

const response = Joi.object().keys({
    message: Joi.string().description('response message of operation'),
    uri: Joi.string().description('the uri of updated menu'),
});

module.exports = response;