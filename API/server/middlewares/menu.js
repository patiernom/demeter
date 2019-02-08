'use strict';

import Menu from '../models/Menu'
import { omit, path } from "ramda";

const getMenu = async (request) => {
    const { db } = path(['server', 'plugins', 'lowdb'], request);
    const { id: idUser } = path(['auth', 'credentials'], request);

    return db
        .get('menus')
        .filter(menu => menu.idUser === idUser)
        .map((menu) => omit(['idUser'], menu))
        .value();
};

const addMenu = async (request) => {
    const { db } = path(['server', 'plugins', 'lowdb'], request);
    const { id: idUser } = path(['auth', 'credentials'], request);
    const newMenu = new Menu(request.payload.name, idUser);

    const menu = await db
        .get('menus')
        .push(newMenu)
        .last()
        .write();

    return menu.id;
};

const addDish = async (request) => {
    const { db } = path(['server', 'plugins', 'lowdb'], request);
    const { id: idUser } = path(['auth', 'credentials'], request);
    const { name } = request.payload;
    const { idMenu } = request.params;

    const menu = await db
        .get('menus')
        .find((item) => item.id === idMenu && item.idUser === idUser)
        .value();

    menu.dishes.push(name);

    const newMenu = await db
        .get('menus')
        .find((item) => item.id === idMenu && item.idUser === idUser)
        .assign(menu)
        .write();

    return omit(['idUser'], newMenu);
};

export {
    getMenu,
    addMenu,
    addDish
};