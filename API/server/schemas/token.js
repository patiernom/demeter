'use strict';

import Joi from'joi';

const token = Joi.object().keys({
    id_token: Joi.string().token()
});

module.exports = token;