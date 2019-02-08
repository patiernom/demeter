import crypto from 'crypto';

class Menu {
    constructor(name, idUser) {
        this.id = crypto.randomBytes(10).toString('hex');
        this.idUser = idUser;
        this.name = name;
        this.dishes = [];
    }
}

module.exports = Menu;