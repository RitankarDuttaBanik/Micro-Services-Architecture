const multer = require('multer');
const logger = require('../utils/logger.js');


const upload = multer({
    storage : multer.memoryStorage(),
    limits  : {
        fileSize : 5 * 1024 * 1024,

    }
}).single('file');


module.exports = upload;