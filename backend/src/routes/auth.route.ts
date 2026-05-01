import { Router } from 'express';
import { registerNewUser, verifyEmail, forgotPassword, resetPassword, login } from '../controllers/auth.controller';

const router = Router();

router.post('/register', registerNewUser);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/login', login);


export default router;
