const logger = require('../utils/logger.js');
const Post = require('../models/Post.js');
const { validatePostcreate } = require('../utils/validation.js');


//can do on a different file -invalidcache - remove after use
async function invalidateCache(req,input){
        const cachedkeys = `post:${input}`;
        await req.redisClient.del(cachedkeys);

        const keys = await req.redisClient.keys(`posts:*`);
        if(keys.length > 0){
            await req.redisClient.del(keys);
        }

}

const createPost = async (req, res) => {
    logger.info('create post endpoint ...');
    try {
        const { error } = validatePostcreate(req.body);
        if (error) {
            logger.warn('validation error ', error.details[0].message);
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });

        }

        const { content, mediaIDs } = req.body;
        const newcreatedPost = new Post({
            user: req.user.userId, // but user is a seperate service.
            content,
            mediaIDs: mediaIDs || []
        })

        await newcreatedPost.save();
        await invalidateCache(req,newcreatedPost._id.toString());
        logger.info('Post created successfully', newcreatedPost);
        res.status(201).json({
            success: true,
            message: 'Post created successfully',
        })


    } catch (e) {
        logger.error('Error creating post:', e);
        res.status(500).send({ message: 'Error creating post', success: false });
    }
};


const getAllPost = async (req, res) => {
    try {
        //pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;

        const cacheKey = `posts:${page}:${limit}`;
        const cachedPosts = await req.redisClient.get(cacheKey);

        if (cachedPosts) {
            return res.json(JSON.parse(cachedPosts));
        }

        const posts = await Post.find({}).sort({ createdAt: -1 }).skip(startIndex).limit(limit);
        const totalPosts = await Post.countDocuments();

        const Result = {

            posts,
            currentPage : page,
            totalPosts,
            totalPages : Math.ceil(totalPosts/limit),
            
        }
        //save posts  to redis cache
        
        await req.redisClient.setex(cacheKey,300,JSON.stringify(Result));

        res.json(Result);

    } catch (e) {
        logger.error('Error fetching all  post:', e);
        res.status(500).send({ message: 'Error fetching all post', success: false });

    }
};

const getPostById = async (req, res) => {
    try {

        const postId = req.params.id;
        const cacheKey = `posts:${postId}`;

        const cachePost = await req.redisClient.get(cacheKey);

        if(cachePost){
            return res.json(JSON.parse(cachePost));

        }

        const singlePostDetails = await Post.findById(postId);

        if(!singlePostDetails){
            return res.status(404).send({ message: 'Post not found', success: false });
        }

       await  req.redisClient.setex(cachePost,3600,JSON.stringify(singlePostDetails));

       res.json(singlePostDetails);


    } catch (e) {
        logger.error('Error fetching post By Id :', e);
        res.status(500).send({ message: 'Error fetching post By Id ', success: false });

    }
};


const deletePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete({
            _id:req.params.id,
            user : req.user.userId,//user created it can only delete it.
        })
        if(!post){
            return res.status(404).send({ message: 'Post not found', success: false });
            }
        
        await invalidateCache(req,req.params.id);
        
        res.json({ message: 'Post deleted successfully', success: true });

    } catch (e) {
        logger.error('Error deleting post:', e);
        res.status(500).send({ message: 'Error deleting post ', success: false });

    }
};

module.exports = { createPost, getAllPost, getPostById, deletePost };