import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Helper to build a safe user payload (never expose password)
const userPayload = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  rating: user.rating,
  problemsSolved: user.problemsSolved,
  battlesPlayed: user.battlesPlayed,
  battlesWon: user.battlesWon,
  createdAt: user.createdAt,
});

// POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username }] });
    if (existingUser) {
      const field = existingUser.email === email.toLowerCase() ? 'Email' : 'Username';
      return res.status(400).json({ success: false, message: `${field} already in use` });
    }

    const user = await User.create({ username, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: userPayload(user),
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userPayload(user),
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/logout  (stateless — client must discard the token)
export const logout = (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};

// GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      user: {
        ...userPayload(user),
        winRate: user.winRate,
      },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/auth/change-password
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new passwords are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }
    if (currentPassword === newPassword) {
      return res.status(400).json({ success: false, message: 'New password must differ from the current password' });
    }

    // Load user with password field (normally excluded by select: false)
    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword; // pre-save hook hashes it
    await user.save();

    // Issue a fresh token so the client can keep going without re-logging in
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Password changed successfully',
      token,
    });
  } catch (error) {
    next(error);
  }
};
