'use strict';

import { omit } from "ramda";

const findMenuById = async (db, idMenu) => db
    .get('menus')
    .find((item) => item.id === idMenu)
    .value();

const findMenus = async (db, idUser) => db
    .get('menus')
    .filter(menu => menu.idUser === idUser)
    .map((menu) => omit(['idUser', 'dishes'], menu))
    .value();

const createMenu = async (db, newMenu) => db
    .get('menus')
    .push(newMenu)
    .last()
    .write();

const updateMenu = async (db, idMenu, updatedMenu) => db
    .get('menus')
    .find((item) => item.id === idMenu)
    .assign(updatedMenu)
    .write();

export {
    findMenuById,
    findMenus,
    createMenu,
    updateMenu,
}