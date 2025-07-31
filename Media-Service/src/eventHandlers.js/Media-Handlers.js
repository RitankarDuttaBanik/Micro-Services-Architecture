const Media = require("../models/media");
const { deleteMediafromcloudinary } = require("../utils/cloudinary");

const handlepostdelete = async (event) => {
    console.log(event , "there is a event");
    const { postId , mediaIds } = event

    try {

       const mediatodelete =  await Media.find({_id  : {$in : mediaIds}})

        for(const media of mediatodelete){
            await deleteMediafromcloudinary(media.publicId);
            await Media.findByIdAndDelete(media._id);

            logger.info(`DeleteD Media ${media._id} associate with deleted post ${postId}`)
        }

        logger.info('processed deletion of Media for post id ');
        
    } catch (e) {
        logger.error('Error while loading the media',e);
        return { status: 500, message: 'Error while loading the media' };
        
        
    }
}

module.exports = { handlepostdelete };