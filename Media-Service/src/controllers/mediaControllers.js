const logger = require('../utils/logger.js');
const { uploadcloudinary } = require("../utils/cloudinary.js");
const Media = require('../models/media.js'); 

const uploadmedia = async (req, res) => {
    logger.info('Uploading file ...');
    try {
        if (!req.file) {
            logger.error('File not found. Please upload the file again.');
            return res.status(400).json({
                success: false,
                message: 'File not found. Please upload the file again.'
            });
        }

        const { originalname, mimetype } = req.file;
        const userId = req.user.userId;

        logger.info(`File details: ${originalname}, type=${mimetype}`);
        logger.info('Uploading to Cloudinary...');
        const cloudinaryuploadResult = await uploadcloudinary(req.file);
        logger.info(`Cloudinary upload successful: ${cloudinaryuploadResult.public_id}`);

        const newlycreatedMedia = new Media({
            publicId: cloudinaryuploadResult.public_id,
            originalName: originalname,
            mimeType: mimetype,
            url: cloudinaryuploadResult.secure_url,
            userId,
        });

        await newlycreatedMedia.save();
        res.status(200).json({
            success: true,
            mediaId: newlycreatedMedia._id,
            url: newlycreatedMedia.url,
            message: 'Uploaded file successfully'
        });
    } catch (e) {
        logger.error('Error uploading file:', e);
        res.status(500).send({ message: 'Error uploading file', success: false });
    }
};

const getAllmedia = async (req,res) =>  {
    try {
        const results = await Media.find({});
        res.json({results});
        
    } catch (e) {
        logger.error('Error getting file:', e);
        res.status(500).send({ message: 'Error getting file', success: false });
    }
}
module.exports = { uploadmedia, getAllmedia};
