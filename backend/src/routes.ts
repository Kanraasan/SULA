import express from 'express';
import { createUser } from './controller/userRegister';
import { loginUser } from './controller/userLogin';
import { createReport } from './controller/createReport';
import { uploadFile } from './controller/uploadFile';
import { getReports } from './controller/getReports';
import { getReportById } from './controller/getReportById';
import { getLeaderboard } from './controller/getLeaderboard';
import { editReport } from './controller/editReport';
import { deleteReportById } from './controller/deleteReport';
import { authorize } from './middleware/auth';

const router = express.Router();
router.post('/register', createUser);
router.post('/login', loginUser);

// User & Admin can do these
router.post('/report', authorize(['user', 'admin']), uploadFile, createReport);
router.get('/report', getReports);
router.get('/report/:id', getReportById);
router.get('/leaderboard', getLeaderboard);

// Restricted actions (Admin only)
router.put('/report/:id', authorize(['admin']), editReport);
router.delete('/report/:id', authorize(['admin']), deleteReportById);

export default router;
