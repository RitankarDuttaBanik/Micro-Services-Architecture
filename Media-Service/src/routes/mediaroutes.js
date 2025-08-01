const express = require('express');
const multer = require('multer');
const logger = require('../utils/logger.js');
const { uploadmedia , getAllmedia } = require('../controllers/mediaControllers.js');
const { authenticate } = require('../middleware/authmiddleware.js');
//const upload = require('../utils/multer.js');

const router = express.Router();

const upload = multer({
    storage : multer.memoryStorage(),
    limits  : {
        fileSize : 50 * 1024 * 1024,

    }
}).single('file');



router.post('/upload', authenticate, (req, res, next) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            logger.error('multer error while uploading:', err);
            return res.status(400).json({
                message: 'multer error while uploading',
                error: err.message,
                stack: err.stack
            })

        }
        else if (err) {
            logger.error('unknown error found while uploading', err);
            return res.status(500).json({
                message: 'Unknown error while uploading',
                error: err.message,
                stack: err.stack
            })
        }

        if (!req.file) {
            logger.error('no file found', err);
            return res.status(400).json({
                message: 'no file found',

            })
        }

        next();
    })
},uploadmedia);

router.get('/getallmedia', authenticate, getAllmedia);

module.exports = router;
