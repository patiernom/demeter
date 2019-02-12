'use strict';

import Joi from'joi';

const response = Joi.object().keys({
    message: Joi.string().description('response message of operation'),
    id_menu: Joi.string().description('the id of new menu'),
    uri: Joi.string().description('the uri of new menu'),
});

module.exports = response;