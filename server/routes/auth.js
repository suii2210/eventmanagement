import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '7d';

const signUser = (user) =>
  jwt.sign({ userId: user._id.toString(), email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

const sanitizeUser = (user) => ({
  id: user._id.toString(),
  email: user.email,
  name: user.name || ''
});

// SIGNUP
router.post('/signup', async (req, res) => {
  try {
    let { email, password, name } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    email = String(email).toLowerCase().trim();
    name = name ? String(name).trim() : '';

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed, name });

    const token = signUser(user);
    res.status(201).json({ message: 'User created successfully', token, user: sanitizeUser(user) });
  } catch (err) {
    console.error('Signup error:', err);
    if (err?.code === 11000) return res.status(409).json({ error: 'Duplicate email' });
    res.status(500).json({ error: 'Server error' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    email = String(email).toLowerCase().trim();
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signUser(user);
    res.json({ message: 'Login successful', token, user: sanitizeUser(user) });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// LOGOUT (stateless)
router.post('/logout', (req, res) => res.json({ message: 'Logout successful' }));

export default router;
