import { Router, Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

const router = Router();
const pool = new Pool();

router.post('/register', async (req: Request, res: Response) => {
    try {
        const { email, password, first_name, last_name } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email and password required' });
        }
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ success: false, error: 'User already exists' });
        }
        const hashedPassword = await bcryptjs.hash(password, 10);
        const result = await pool.query('INSERT INTO users (email, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id, email', [email, hashedPassword, first_name, last_name]);
        const user = result.rows[0];
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '7d' });
        res.status(201).json({ success: true, token, user });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email and password required' });
        }
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        const user = result.rows[0];
        const passwordMatch = await bcryptjs.compare(password, user.password_hash);
        if (!passwordMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '7d' });
        res.json({ success: true, token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/refresh-token', (req: Request, res: Response) => {
    try {
        const { token } = req.body;
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        const newToken = jwt.sign({ id: decoded.id, email: decoded.email }, process.env.JWT_SECRET!, { expiresIn: '7d' });
        res.json({ success: true, token: newToken });
    } catch (error: any) {
        res.status(401).json({ success: false, error: 'Invalid token' });
    }
});

router.post('/verify-otp', async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;
        res.json({ success: true, message: 'OTP verified' });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/enable-2fa', async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;
        res.json({ success: true, message: '2FA enabled' });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;