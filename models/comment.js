//requires
var mongoose = require("mongoose");

//define schema
var commentSchema = mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

//define model
var Comment = mongoose.model("Comment", commentSchema);

//exports
module.exports = Comment;