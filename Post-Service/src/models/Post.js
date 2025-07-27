const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    user : {
        type :mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },

    content : {
        type : String,
        required : true
    },
    
    mediaIDs :[
        {
            type : String
        }
    ],

    createdAt : {
        type : Date,
        default : Date.now
    }

},{timestamps : true});

PostSchema.index({content : "text"});// can also do in search-service

const post = mongoose.model("Post",PostSchema);
module.exports = post;