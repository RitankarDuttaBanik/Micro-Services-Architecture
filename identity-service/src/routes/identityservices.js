import  Router  from 'express';
import {Registration,LoginUser,LogoutUser,createRefreshToken} from '../controllers/identityController.js';
const router = Router();


router.post('/registerUser',Registration);
router.post('/LoginUser',LoginUser);
router.post('/refeshToken',createRefreshToken);
router.post('/LogOut',LogoutUser);

export default router;