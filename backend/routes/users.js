import { Router } from 'express';
import logger from '../utils/logger.js';
import bcrypt from 'bcryptjs';
import { User, Progress, publicUserShape } from '../models/index.js';

const router = Router();

router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();
    const progress = await Progress.findOne({ userId: req.user.id }).lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: publicUserShape(user), progress });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

router.put('/profile', async (req, res) => {
  try {
    const { fullName, bio, avatarUrl, password } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (fullName) user.fullName = fullName;
    if (bio !== undefined) user.bio = bio;
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
    if (password) user.passwordHash = await bcrypt.hash(password, 10);

    await user.save();

    res.json({ user: publicUserShape(user) });
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

export default router;