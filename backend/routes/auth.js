import { Router } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import config from '../config/index.js';
import logger from '../utils/logger.js';
import { User, Progress, publicUserShape } from '../models/index.js';
import authenticate from '../middleware/authenticate.js';

const router = Router();

const signTokens = (user) => {
  const payload = { id: String(user._id), email: user.email, role: user.role };

  return {
    token: jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRE, subject: String(user._id) }),
    refreshToken: jwt.sign(payload, config.JWT_REFRESH_SECRET, { expiresIn: config.JWT_REFRESH_EXPIRE, subject: String(user._id) }),
  };
};

router.post('/register', async (req, res) => {
  try {
    const { email, username, password, fullName } = req.body;

    if (!email || !username || !password || !fullName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    const existingUser = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username }] });
    if (existingUser) {
      return res.status(409).json({ message: 'Email or username already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: email.toLowerCase(),
      username,
      passwordHash,
      fullName,
      role: username === 'hackshield' ? 'admin' : 'student',
    });

    await Progress.create({ userId: user._id });

    const tokens = signTokens(user);

    res.status(201).json({
      message: 'User registered successfully',
      ...tokens,
      user: publicUserShape(user),
    });
  } catch (error) {
    logger.error('Register error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const tokens = signTokens(user);

    res.json({
      message: 'Login successful',
      ...tokens,
      user: publicUserShape(user),
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: publicUserShape(user) });
  } catch (error) {
    logger.error('Get user error:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'refreshToken is required' });
    }

    const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id || decoded.sub);
    if (!user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const tokens = signTokens(user);
    res.json(tokens);
  } catch (error) {
    logger.error('Refresh token error:', error);
    res.status(401).json({ message: 'Failed to refresh token' });
  }
});

router.post('/logout', (_req, res) => {
  res.json({ message: 'Logout successful' });
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(24).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();

    res.json({
      message: 'Password reset token generated',
      resetToken: config.NODE_ENV === 'production' ? undefined : resetToken,
    });
  } catch (error) {
    logger.error('Forgot password error:', error);
    res.status(500).json({ message: 'Failed to generate reset token' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ message: 'Token and password are required' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.passwordHash = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    logger.error('Reset password error:', error);
    res.status(500).json({ message: 'Failed to reset password' });
  }
});

export default router;
