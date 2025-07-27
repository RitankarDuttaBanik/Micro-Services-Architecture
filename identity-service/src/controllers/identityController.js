//USER REGISTRATION
import logger from '../utils/logger.js';
import validationUtils from '../utils/validationuser.js';
const { validateLogin, validateRegistration } = validationUtils;
import  User  from '../models/User.js';
import generateTokens from '../utils/generateToken.js';

const Registration = async (req,res) => {
    logger.info('Registration endpoint ');
    try {
        //validate the schema 
        const { error } = validateRegistration(req.body);
        if (error) {
            logger.warn('validation error ', error.details[0].message);
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });

        }

        const { email, password, username } = req.body;
        let user = await User.findOne({ $or: [{ email }, { username }] });

        if (user) {
            logger.warn('User already exists');
            return res.status(400).json({
                success: false,
                message: 'User exists',
            });
        }

        user = new User({username,email,password});
        await user.save();
        logger.warn('User created successfully and going for tokens..');

        const {accessToken, refreshToken} = await generateTokens(user);

       res.status(201).json({
                    success: true,
                    message: 'User registered successfully',
                    accessToken,
                    refreshToken,
                });



    } catch (e) {
        logger.error('Registration failed ', e);
            res.status(500).json({
                message : 'unable to register user',
                success : false 
            })
    }
}


//USER LOGIN

const LoginUser = async (req,res) => {
    logger.info('Login endpoint .....');
    try {
        
        const { error } = validateLogin(req.body);
        if(error){
            logger.error('Validation error in login endpoint ', error.details[0].message);
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
                });
        }

        const {email , password } = req.body;

        const user = await User.findOne({email});
        if(!user){
            logger.error('User not found');
            return res.status(404).json({success : false , message : `user not found`});
        }

        const isPasswordValid = await user.comparePassword(password);

        if(!isPasswordValid){
            logger.error('Password is incorrect');
            return res.status(404).json({success : false , message : "Invalid Password"});
        }

        const {accessToken,refreshToken} = await generateTokens(user);

        res.json({
            success : true,
            message : 'User logged in successfully',
            accessToken,
            refreshToken,
            userId : user._id
        })

        
    } catch (error) {
        logger.error('Registration failed ', error);
            res.status(500).json({
                message : 'unable to Login user',
                success : false 
            })
    }
}
//USER TOKEN

const createRefreshToken  = async (req,res) => {
    logger.info("Refresh Token endpoint...");
    try {
        
        const {refreshToken} = req.body;

        if(!refreshToken){
            logger.error('Refresh token is missing');
            return res.status(400).json({success : false , message : "Refresh token is missing"})  
        }

        const storeToken = await refreshToken.findOne({token : refreshToken});

        if(!storeToken || storeToken.expiresAt < new Date()){
            logger.warn('Invalid or expired token');
            return res.status(401).json({success : false , message : "Invalid or expired token"});
        }

        const user = await User.findById(storeToken.user);

        if(!user){
            logger.error('User not found');
            return res.status(401).json({success : false , message : "User not found"});
        }

        const { accessToken : newAccessToken , refreshToken : newRefreshToken } = await generateTokens(user);

        // delete old token 

        await refreshToken.deleteOne({_id: storeToken._id});

        res.json({
            accessToken : newAccessToken,
            refreshToken : newRefreshToken,
        })

    } catch (e) {
        logger.error('Login failed ', e);
            res.status(500).json({
                message : 'unable to Login user',
                success : false 
            });
        
    }
}



//LOGOUT 

const LogoutUser = async (req,res) => {
    logger.info('Logout endpoint....');
    try {

        const {refreshToken} = req.body;
        if(!refreshToken){
            logger.warn('Refresh token is missing for logout');
            return res.status(400).json({success : false , message : "Refresh token is missing"});

        }

        await refreshToken.deleteOne({token : refreshToken});
        logger.info("Refresh token has been removed for logout");
        res.json({
            message : 'User logged out successfully',  
            success : true
            });
            
        
    } catch (e) {
        logger.error('Logout failed ', e);
            res.status(500).json({
                message : 'unable to Logout user',
                success : false 
            })
    }
}



//exports
export {Registration,LoginUser,createRefreshToken,LogoutUser};