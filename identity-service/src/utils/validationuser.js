import joi from 'joi';

const validateRegistration = (data) => {
    const schema = joi.object({
        username: joi.string().min(3).max(10).required(),
        email: joi.string().email().required(),
        password: joi.string().min(8).required(),
    })

    return schema.validate(data)
}

const validateLogin = (data) => {
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(8).required(),
    })

    return schema.validate(data)
}


export default {
  validateRegistration,
  validateLogin
};