const mongoose = require('mongoose');
let Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const bcrypt = require('bcryptjs');

let userSchema = new Schema({
    user: {
        type: String,
        unique: true
    },
    password: String
});

let user; // to be defined on new connection

module.exports.initialize = () => {
    return new Promise((resolve, reject) => {
        let db = mongoose.createConnection("mongodb://htzheng:123456@ds163826.mlab.com:63826/web322_w7");
        db.on('error', (err) => {
            reject(err);
        });

        db.once('open', () => {
            user = db.model("users", userSchema);
            resolve("Success Initialize mongooseDB!!!");
        });
    });
};

module.exports.registerUser = (userData) => {
    return new Promise((resolve, reject) => {
        if (userData.password != userData.password2) {
            reject("Password do not match");
        } else {
            let newUser = new user(userData);
            bcrypt.genSalt(10, function (err, salt) {
                if (err) {
                    reject("Failed to encrypt the password");
                }
                bcrypt.hash(userData.password, salt, function (err, hash) {
                    newUser.password = hash;
                    newUser.save((err) => {
                        if (err) {
                            reject();
                        } else {
                            resolve();
                        }
                    }).catch((err) => {
                        if (err) {
                            if (err.code == 11000) {
                                reject("User Name already taken");
                            } else {
                                reject("There was an error creating the user: ${user}");
                            }
                        }
                    });
                });
            });
        }
    });
};

module.exports.checkUser = (userData) => {
    return new Promise((resolve, reject) => {
        let userName = userData.user;
        user.find({
                user: userName
            })
            .exec()
            .then((users) => {
                if (users.length == 0) {
                    reject("Unable to find user: " + userData.user);
                } else {
                    hash = users[0].password;
                    bcrypt.compare(userData.password, hash, (err, match) => {
                        if (err) {
                            throw (err);
                        } else {
                            if (match == true) {
                                resolve(userName);
                            } else {
                                reject("The current password is incorrect for: " + userName);
                            }
                        }
                    });
                }
            }).catch((err) => {
                reject("Unable to find user: " + userName);
            });
    });
};