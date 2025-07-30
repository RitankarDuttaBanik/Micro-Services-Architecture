const joi = require('joi');

const validatePostcreate = (data) => {
    const schema = joi.object({
        content: joi.string().min(3).max(10).required(),
        mediaIds: joi.array(),
    })

    return schema.validate(data)
}


module.exports = { validatePostcreate };