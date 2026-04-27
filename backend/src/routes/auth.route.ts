import { Router } from 'express';
import { registerNewUser, verifyEmail, forgotPassword, resetPassword } from '../controllers/auth.controller';

const router = Router();

router.post('/register', registerNewUser);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);


export default router;
