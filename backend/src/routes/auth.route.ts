import { Router } from 'express';
import { registerNewUser, verifyEmail, forgotPassword, resetPassword, login } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import {
  loginSchema,
  registerSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../schemas/auth.schema';

const router = Router();

router.post('/register',        validate({ body: registerSchema }),        registerNewUser);
router.post('/verify-email',    validate({ body: verifyEmailSchema }),     verifyEmail);
router.post('/forgot-password', validate({ body: forgotPasswordSchema }), forgotPassword);
router.post('/reset-password',  validate({ body: resetPasswordSchema }),  resetPassword);
router.post('/login',           validate({ body: loginSchema }),           login);

export default router;
