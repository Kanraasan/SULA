import express from 'express';
import { createUser } from './controller/userRegister';
import { loginUser } from './controller/userLogin';
import { postContent } from './controller/userPost';
import { uploadFile } from './controller/uploadFile';
import { getPost } from './controller/getPost';
import { getPostById } from './controller/getPostById';
import { editPost } from './controller/editPost';
import { deleteNoteById } from './controller/delete';

const router = express.Router();
router.post('/regist', createUser);
router.post('/login', loginUser);
router.post('/post', uploadFile, postContent);
router.get('/post/:id', getPostById);
router.put('/post/:id', editPost);
router.delete('/post/:id', deleteNoteById);
export default router;
