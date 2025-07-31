const Search = require('../models/search.js');
const logger = require('../utils/logger.js');


const searchpostcontroller = async (req, res) => {
    logger.warn('endpoint for search controller');
    try {
        const { query } = req.query;
        const results = await Search.findOne(
            {
                $text:
                    { $search: query },
            },

            {
                $score:
                    { $meta: 'textScore' },
            }

        ).sort({ $meta: 'textScore' }).limit(10);


        res.json(results);
    } catch (e) {
        logger.error('Error searching post :', e);
        res.status(500).send({ message: 'Error seaching post ', success: false });

    }
}

module.exports = {searchpostcontroller};