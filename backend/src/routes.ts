import express from 'express';
import { createUser } from './controller/userRegister';
import { loginUser } from './controller/userLogin';
import { postContent } from './controller/userPost';
import { uploadFile } from './controller/uploadFile';

const router = express.Router();
router.post('/regist', createUser);
router.post('/login', loginUser);
router.post('/post', uploadFile, postContent);
export default router;
