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
import { upvoteReport } from './controller/upvoteReport';
import { getAdminProfile, updateAdminProfile, deleteAdminAccount } from './controller/adminProfile';
import { getAdminStats } from './controller/adminStats';
import { updateUserProfile } from './controller/userProfile';
import { authorize } from './middleware/auth';

const router = express.Router();
router.post('/register', createUser);
router.post('/login', loginUser);

// User & Admin can do these
router.post('/report', authorize(['user', 'admin']), uploadFile, createReport);
router.get('/report', getReports);
router.get('/report/:id', getReportById);
router.get('/leaderboard', getLeaderboard);
router.post('/report/:id/upvote', authorize(['user', 'admin']), upvoteReport);

// Restricted actions
router.put('/report/:id', authorize(['user', 'admin']), editReport); // users can edit their own, admins can edit all
router.delete('/report/:id', authorize(['admin']), deleteReportById);

// Admin profile & stats
router.get('/admin/stats', authorize(['admin']), getAdminStats);
router.get('/admin/profile', authorize(['admin']), getAdminProfile);
router.put('/admin/profile', authorize(['admin']), updateAdminProfile);
router.delete('/admin/account', authorize(['admin']), deleteAdminAccount);

// User Profile
router.put('/user/profile', authorize(['user', 'admin']), updateUserProfile);

export default router;

