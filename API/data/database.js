import crypto from 'crypto';

class User {
    constructor(id, firstName, lastName, username, password, email) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.password = password;
        this.email = email;
    }
}

const getUser = async (db, id) => {
    return db
        .get('users')
        .find(user => user.id === id)
        .value();
};

const addUser = (db, username, password, email) => {
    const user = db
        .get('users')
        .push(new User(crypto.randomBytes(10).toString('hex'), "", "", username, password, email))
        .last()
        .write();

    return user.id;
};

export {
    User,
    getUser,
    addUser,
};