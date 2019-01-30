import crypto from 'crypto';

class User {
    constructor(firstName, lastName, username, password, email, admin) {
        this.id = crypto.randomBytes(10).toString('hex');
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.password = password;
        this.email = email;
        this.admin = admin;
    }
}

module.exports = User;