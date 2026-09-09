import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: { id: number; email: string; role?: string };
}

/**
 * Middleware to authenticate requests using a JWT Bearer token.
 * Attaches decoded user payload to req.user on success.
 */
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return res.status(500).json({ success: false, error: 'Server configuration error' });
    }
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, error: 'Missing or invalid Authorization header' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, secret) as { id: number; email: string; role?: string };
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }
};
