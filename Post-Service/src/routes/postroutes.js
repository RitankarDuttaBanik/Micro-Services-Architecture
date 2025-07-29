const express = require('express');
const {createPost , getAllPost, getPostById, deletePost} = require('../controllers/postcontroller.js');
const {authenticate} = require('../middleware/authmiddleware.js');

const router = express.Router();

router.use(authenticate);
router.post('/createPost',createPost);
router.get('/getallpost', getAllPost);
router.get('/:id', getPostById);
router.delete('/:id',deletePost);

module.exports = router;


