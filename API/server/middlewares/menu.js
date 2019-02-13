'use strict';

import Menu from '../models/Menu'
import { omit } from "ramda";

import { findMenuById, findMenus, createMenu, updateMenu } from '../db/menu';
import { getLowDB, getAuthenticatedUser} from "../utils/common";

const getMenuById = async (request) => {
    const { db } = getLowDB(request);
    const { idMenu } = request.params;

    const menu = await findMenuById(db, idMenu);

    return omit(['idUser'], menu);
};

const getMenus = async (request) => {
    const { db } = getLowDB(request);
    const { id: idUser } = getAuthenticatedUser(request);

    return findMenus(db, idUser);
};

const addMenu = async (request) => {
    const { db } = getLowDB(request);
    const { id: idUser } = getAuthenticatedUser(request);

    const newMenu = new Menu(request.payload.name, idUser);
    const menu = await createMenu(db, newMenu);

    return menu.id;
};

const addDish = async (request) => {
    const { db } = getLowDB(request);
    const { name } = request.payload;
    const { idMenu } = request.params;

    const menu = await findMenuById(db, idMenu);

    menu.dishes.push(name);

    const updatedMenu = await updateMenu(db, menu);

    return updatedMenu.id;
};

export {
    getMenuById,
    getMenus,
    addMenu,
    addDish
};