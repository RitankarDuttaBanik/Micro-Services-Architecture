const express = require('express');
const {createPost} = require('../controllers/postcontroller.js');
const router = express.Router();
const {authenticate} = require('../middleware/authmiddleware.js');

router.use(authenticate);
router.post('/createPost',createPost);

module.exports = router;


