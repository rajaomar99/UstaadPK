import { Router } from 'express';
import { getCurrentUser, updateCurrentUser, onboardUser } from '../controllers/user.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

// All user routes require authentication
router.use(requireAuth);

router.get('/me', getCurrentUser);
router.patch('/me', updateCurrentUser);
router.post('/onboarding', onboardUser);

export default router;
