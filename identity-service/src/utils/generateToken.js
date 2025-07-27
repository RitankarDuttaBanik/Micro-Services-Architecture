import jwt from 'jsonwebtoken';
import crypto  from 'crypto';
import RefreshToken from '../models/refreshToken.js';

const generateTokens = async (user) => {
  const accessToken = jwt.sign(
    {
      userId: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "60m" }
  );
  
  const refreshTokenString = crypto.randomBytes(40).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  
  await RefreshToken.create({
    token:     refreshTokenString,
    user:      user._id,     
    expiresAt,
  });

 
  return {
    accessToken,
    refreshToken: refreshTokenString
  };
};

export default generateTokens;