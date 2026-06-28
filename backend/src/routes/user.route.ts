import { Router } from 'express';
import { getCurrentUser, updateCurrentUser } from '../controllers/user.controller';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { updateUserSchema } from '../schemas/user.schema';

const router = Router();

// All user routes require authentication
router.use(requireAuth);

router.get('/me', getCurrentUser);
router.patch('/me', validate({ body: updateUserSchema }), updateCurrentUser);

export default router;
