const mongoose = require('mongoose');

const searchschema = new mongoose.Schema({
    postId: {
        type: String,
        required: true,
        unique: true
    },

    userId: {
        type: String,
        required: true,
        unique: true
    },

    content: {
        type: String,
        required: true,
    },

    createdAt : {
        type: Date,
        required : true,
    }
}, { timestamps: true });



searchschema.index({content : 'text'});
searchschema.index({createdAt : -1 });
const Search = mongoose.model('Search', searchschema);
module.exports = Search;