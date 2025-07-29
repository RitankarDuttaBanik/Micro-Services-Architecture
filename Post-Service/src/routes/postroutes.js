const express = require('express');
const {createPost , getAllPost, getPostById } = require('../controllers/postcontroller.js');
const {authenticate} = require('../middleware/authmiddleware.js');

const router = express.Router();

router.use(authenticate);
router.post('/createPost',createPost);
router.get('/getallpost', getAllPost);
router.get('/:id', getPostById);

module.exports = router;


