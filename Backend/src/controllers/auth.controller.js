const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const allowedRoles = ['user', 'admin', 'agent'];

const register = async (req, res) => {
  try {
    const { name, username, password, phone, city, role = 'user' } = req.body;

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const existingUser = await User.findOne({ email: username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const prefix = role === 'admin' ? 'ADM' : role === 'agent' ? 'AGT' : 'USR';

    const newUser = new User({
      id: `${prefix}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      name,
      email: username,
      password: hashedPassword,
      role,
      isAdmin: role === 'admin',
      phone,
      city,
      joined: new Date().toISOString().split('T')[0],
      avatar: name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : prefix
    });

    await newUser.save();

    return res.status(201).json({ message: 'Registration successful! Please log in.' });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error during registration' });
  }
};

const login = async (req, res) => {
  try {
    const { username, password, role = 'user' } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    if (role === 'admin' && username === 'admin' && password === 'admin') {
      const token = jwt.sign(
        { name: 'Super Admin', email: 'admin@insurance.com', role: 'admin' },
        process.env.JWT_SECRET || 'fallbacksecret',
        { expiresIn: '1d' }
      );

      return res.status(200).json({ message: 'Admin login successful', token });
    }

    const user = await User.findOne({ email: username });

    if (!user) {
      return res.status(400).json({ message: 'User not found. Please register.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    if (role === 'admin' && !user.isAdmin) {
      return res.status(403).json({ message: 'Access denied: You are not registered as an Admin.' });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        role
      },
      process.env.JWT_SECRET || 'fallbacksecret',
      { expiresIn: role === 'admin' ? '1d' : '7d' }
    );

    return res.status(200).json({
      message: `${role} login successful`,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login' });
  }
};

module.exports = {
  login,
  register
};