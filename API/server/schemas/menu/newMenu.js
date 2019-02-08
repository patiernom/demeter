'use strict';

import Joi from'joi';

const menu = Joi.object().keys({
    id_menu: Joi.string()
});

module.exports = menu;