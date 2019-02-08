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

    return db
        .get('menus')
        .push(newMenu)
        .write()
        .id;
};

const addDish = async (request) => {
    const { db } = path(['server', 'plugins', 'lowdb'], request);
    const { id: idUser } = path(['auth', 'credentials'], request);
    const { dish, idMenu } = request.payload;

    return db
        .get('menus')
        .find({ id: idMenu, idUser: idUser })
        .assign((menu) => menu.dishes.push(dish))
        .write()
        .value();
};

export {
    getMenu,
    addMenu,
    addDish
};