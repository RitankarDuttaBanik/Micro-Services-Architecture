const Search = require("../models/search.js");
const logger = require('../utils/logger.js');


async function handlepostcreated(event) {
    try {

        const newstartPost = new Search({
            postId : event.postId,
            userId : event.userId,
            content : event.content,
            createdAt : event.createdAt
        }) 

        await newstartPost.save();
        logger.info(`Post created ${event.postId} ${newstartPost._id.toString()}`);
        
    } catch (e) {
        logger.error('error handling post creation event',e);
    }
    
}

async function deletecreatepost(event){
    try {
        await Search.findOneAndDelete({postId  : event.postId});
        logger.info(`Post deleted ${event.postId} ${newstartPost._id.toString()}`);
    } catch (e) {
        logger.error('error handling post deletion event',e);
    }
}
module.exports = {handlepostcreated , deletecreatepost };