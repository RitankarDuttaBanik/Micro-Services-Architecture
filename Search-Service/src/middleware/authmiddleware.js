const logger = require('../utils/logger.js');

const authenticate = (req,res,next) => {
    const userId = req.headers['x-user-id']

    if(!userId){
        logger.warn(`Access attempted without userId`);
        return res.status(401).json({
            success : true,
            message : 'Access denied. Login first',
        })
    }

    req.user = { userId }
    next();
}

module.exports = { authenticate };