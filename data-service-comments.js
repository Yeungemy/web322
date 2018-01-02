const mongoose = require('mongoose');
let Schema = mongoose.Schema;
mongoose.Promise = require("bluebird");

var commentSchema = new Schema({
    "authorName": String,
    "authorEmail": String,
    "subject": String,
    "commentText": String,
    "postedDate": Date,
    "replies": [{
        "comment_id": String,
        "authorName": String,
        "authorEmail": String,
        "commentText": String,
        "repliedDate": Date
    }]
});

let comment; // to be defined on new connection(see initialize)

module.exports.initialize = () => {
    return new Promise((resolve, reject) => {
        let db = mongoose.createConnection("mongodb://htzheng:123456@ds123084.mlab.com:23084/web322_app_htzheng");

        db.on('error', (err) => {
            // reject the promise with the provided error
            console.log("Failed to connect to my lab");
            reject(err);
        });
        db.once('open', () => {
            console.log("Connect to my lab successfully")
            comment = db.model("comments", commentSchema);
            resolve();
        });
    });
};

module.exports.addComment = (data) => {
    return new Promise((resolve, reject) => {
        data.postedDate = Date.now();
        let newComment = new comment(data);
        newComment.save((err) => {
            if (err) {
                reject("There was an error saving the comment: " + err);
            } else {
                resolve(newComment._id);
            }
        });
    });
};

module.exports.getAllComments = () => {
    return new Promise((resolve, reject) => {
        comment.find()
            .sort({
                postedDate: "ascending"
            })
            .exec()
            .then((comments) => {
                if (comments) {
                    resolve(comments);
                }
            }).catch((err) => {
                reject(err);
            });
    });
};

module.exports.addReply = (data) => {
    return new Promise((resolve, reject) => {
        data.repliedDate = Date.now();
        comment.update({
                _id: data.comment_id
            }, {
                $addToSet: {
                    replies: data
                }
            }, {
                multi: false
            })
            .exec()
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
};