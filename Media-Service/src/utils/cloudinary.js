const cloudinary = require('cloudinary').v2;
const logger = require('../utils/logger.js');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const uploadcloudinary = (file) => {
    return new Promise((resolve, reject) => {
        const uploadstream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto' },
            (error, result) => {
                if (error) {
                    logger.error('Error while uploading file in Cloudinary.', error);
                    return reject(error);
                }
                resolve(result);
            }
        );
        uploadstream.end(file.buffer);
    });
};

module.exports = { uploadcloudinary };
