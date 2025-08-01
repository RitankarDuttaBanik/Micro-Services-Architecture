const express = require('express');
const router = express.Router();
const {searchpostcontroller } = require('../controllers/searchcontrollers.js');
const {  authenticate  } = require('../middleware/authmiddleware.js');

router.use(authenticate);
router.get('/Search', searchpostcontroller);

module.exports = router;