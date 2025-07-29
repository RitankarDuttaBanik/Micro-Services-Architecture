const logger = require('../utils/logger.js');


const uploadmedia = async (req,res) => {
    logger.info('Uploading file ...');
    try {
        

        if(!req.file){
            logger.error('File not Found. please Uplaod file again');
            res.status(400).json({
                success : false,
                message : 'File not Found. please Uplaod file again'
            })

        }

        const {originalName,mimeType} = req.file;
        const userId = req.user.userId;

        logger.info(`File details : ${originalName}, type=${mimeType}`);
        logger.info('uploading to cloudinary....');
        const cloudinaryuploadResult = await uploadcloudinary(req.file);
        logger.info(`cloudinary upload successfull,${cloudinaryuploadResult.public_id}`);

        const newlycreatedMedia = new Media({
            publicId : cloudinaryuploadResult.public_id,
            originalName,
            mimeType,
            url: cloudinaryuploadResult.secure_url,
            userId,
        })

        await newlycreatedMedia.save();
        res.status(200).json({
            success : true,
            mediaId :newlycreatedMedia._id,
            url : newlycreatedMedia.url,
            message : 'uploaded file successfully'
        })

         
    } catch (e) {
        logger.error('Error uploading file :', e);
                res.status(500).send({ message: 'Error uploading file ', success: false });
        
    }
}

module.exports = {uploadmedia};