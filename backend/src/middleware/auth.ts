import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request interface to include the decoded user
export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    email: string;
  };
}

/**
 * Middleware to verify JWT tokens from the Authorization header.
 * Expects format: "Bearer <token>"
 */
export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, error: 'Authentication required' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.AUTH_SECRET;
    
    if (!secret) {
      console.error('AUTH_SECRET is not defined in environment variables');
      res.status(500).json({ success: false, error: 'Internal server error' });
      return;
    }

    // Verify token — this requires the token to be signed with the exact same AUTH_SECRET
    const decoded = jwt.verify(token, secret) as {
      id: string;
      role: string;
      email: string;
    };

    req.user = decoded;
    
    next();

  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ success: false, error: 'Token expired' });
    } else {
      res.status(401).json({ success: false, error: 'Invalid token' });
    }
  }
};

/**
 * Middleware to restrict route access to specific roles.
 * Must be used AFTER requireAuth middleware.
 * 
 * @param allowedRoles Array of roles permitted to access the route (e.g., ['tutor', 'admin'])
 */
export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Authentication required' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ success: false, error: 'Forbidden: Insufficient permissions' });
      return;
    }

    next();
  };
};
