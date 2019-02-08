import crypto from 'crypto';

class Menu {
    constructor(name) {
        this.id = crypto.randomBytes(10).toString('hex');
        this.name = name;
        this.dishes = [];
    }
}

module.exports = Menu;