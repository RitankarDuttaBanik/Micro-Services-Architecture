const logger = require('../utils/logger.js');
const Post = require('../models/Post.js');

const createPost = async (req,res) => {
    try {
        const {content , mediaIDs } = req.body;
        const newcreatedPost = new Post({
            user : req.user.userId, // but user is a seperate service.
            content ,
            mediaIDs : mediaIDs || []
        })

        await newcreatedPost.save();
        logger.info('Post created successfully',newcreatedPost);
        res.status(201).json({
            success : true,
            message : 'Post created successfully',
        })


    } catch (e) {
        logger.error('Error creating post:', e);
        res.status(500).send({ message: 'Error creating post', success :false });
    }
};


const getAllPost = async (req,res) => {
    try {
        
    } catch (e) {
         logger.error('Error fetching all  post:', e);
        res.status(500).send({ message: 'Error fetching all post', success :false });
        
    }
};

const getPostById = async (req,res) => {
    try {
        
    } catch (e) {
         logger.error('Error fetching post By Id :', e);
        res.status(500).send({ message: 'Error fetching post By Id ', success :false });
        
    }
};


const deletePost = async (req,res) => {
    try {
        
    } catch (e) {
         logger.error('Error deleting post:', e);
        res.status(500).send({ message: 'Error deleting post ', success :false });
        
    }
};

module.exports  = {createPost,getAllPost,getPostById,deletePost};