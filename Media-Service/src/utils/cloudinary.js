const cloudinary = require('cloudinary').v2;
const logger = require('../utils/logger.js');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const uploadcloudinary = (file) => {
    new promise((reslove,reject) => {
        const uploadstream = cloudinary.uploader.upload_stream({
            resource_type: 'auto',
        },
        (error, result) => {
            if(error){
                logger.error('error while uploading file in cloudinary.',error);
                reject(error);
            }
            else{
                reslove(result);
            }
        }
    )
    uploadstream.end(file.buffer);
    })
}


module.exports = {uploadcloudinary};