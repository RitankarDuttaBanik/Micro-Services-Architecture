const mongoose = require('mongoose');

const mediaschema = new mongoose.Schema({
        publicId : {
            type: String,
            required: true
        },

        originalName : {
            type: String,
            required: true,
        },

        mimeType : {
            type: String,
            required: true
        },

        url: {
            type: String,
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref : 'User',
            required : true
        }

},{timestamps : true});


const Media = mongoose.model('Media',mediaschema);
module.exports = Media;