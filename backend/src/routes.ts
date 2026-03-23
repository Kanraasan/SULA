import express from 'express';
import { createUser } from './controller/userRegister';
import { loginUser } from './controller/userLogin';

const router = express.Router();
router.post('/regist', createUser);
router.post('/login', loginUser);

export default router;
