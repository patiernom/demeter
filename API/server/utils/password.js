import bcrypt from "bcrypt";

const hashPassword = async (password, cb) => {
    const saltRounds = 10;

    // Generate a salt at level 10 strength
    const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, function(err, hash) {
            if (err) {
                reject(err);
            }

            resolve(hash);
        });
    });

    return hashedPassword
};

export {
    hashPassword
}