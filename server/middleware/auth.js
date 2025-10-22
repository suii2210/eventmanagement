import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticate = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Authorization token is missing' });

  try {
    req.user = jwt.verify(auth.split(' ')[1], JWT_SECRET); // { userId, email }
    next();
  } catch (e) {
    console.error('Authentication error:', e);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
 