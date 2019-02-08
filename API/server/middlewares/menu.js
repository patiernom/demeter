'use strict';

import { omit, path } from "ramda";

const getMenu = async (request) => {
    const { db } = path(['server', 'plugins', 'lowdb'], request);
    const { id } = path(['auth', 'credentials'], request);

    return db
        .get('menus')
        .filter(menu => menu.idUser === id)
        .map((menu) => omit(['idUser'], menu))
        .value();
};

export {
    getMenu
};