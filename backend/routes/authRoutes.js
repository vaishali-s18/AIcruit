import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

// @route   POST /api/auth/signup
// @access  Public
router.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'candidate'
    });

    if (user) {
      res.status(201).json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
          role: user.role,
          skills: user.skills,
          experience: user.experience,
          savedJobs: user.savedJobs,
          applications: user.applications
        }
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
          role: user.role,
          skills: user.skills,
          experience: user.experience,
          savedJobs: user.savedJobs,
          applications: user.applications
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/auth/save-job
// @access  Private (Simulated by using userId in body for simplicity, normally from JWT)
router.post('/save-job', async (req, res) => {
  const { userId, jobId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    if (!user.savedJobs.includes(jobId)) {
      user.savedJobs.push(jobId);
      await user.save();
    }
    
    res.json({ success: true, savedJobs: user.savedJobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/auth/unsave-job
// @access  Private
router.post('/unsave-job', async (req, res) => {
  const { userId, jobId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId.toString());
    await user.save();
    
    res.json({ success: true, savedJobs: user.savedJobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  const { skills, experience } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Merge unique skills
      if (skills && Array.isArray(skills)) {
        const uniqueSkills = new Set([...user.skills, ...skills]);
        user.skills = Array.from(uniqueSkills);
      }

      if (experience !== undefined) {
        user.experience = experience;
      }

      const updatedUser = await user.save();

      res.json({
        success: true,
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          token: jwt.sign({ id: updatedUser._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '30d' }),
          role: updatedUser.role,
          skills: updatedUser.skills,
          experience: updatedUser.experience,
          savedJobs: updatedUser.savedJobs,
          applications: updatedUser.applications
        }
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
