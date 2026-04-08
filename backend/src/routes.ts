import express from 'express';
import { createUser } from './controller/userRegister';
import { loginUser } from './controller/userLogin';
import { createReport } from './controller/userPost';
import { uploadFile } from './controller/uploadFile';
import { getReports } from './controller/getPost';
import { getReportById } from './controller/getPostById';
import { editReport } from './controller/editPost';
import { deleteReportById } from './controller/deleteReport';
import { authorize } from './middleware/auth';

const router = express.Router();
router.post('/regist', createUser);
router.post('/login', loginUser);

// User & Admin can do these
router.post('/report', authorize(['user', 'admin']), uploadFile, createReport);
router.get('/report', getReports);
router.get('/report/:id', getReportById);

// Restricted actions (Admin only)
router.put('/report/:id', authorize(['admin']), editReport);
router.delete('/report/:id', authorize(['admin']), deleteReportById);

export default router;
