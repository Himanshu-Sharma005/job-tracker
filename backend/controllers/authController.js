const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const signupUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please add all fields', data: null });
    }

    const userExists = await User.findByEmail(email);
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists', data: null });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await User.create(name, email, hashedPassword);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        _id: result.insertId,
        name,
        email,
        token: generateToken(result.insertId)
      }
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        success: true,
        message: 'Logged in successfully',
        data: {
          _id: user.id,
          name: user.name,
          email: user.email,
          token: generateToken(user.id)
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials', data: null });
    }
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found', data: null });
    }
    
    res.json({
      success: true,
      message: 'User retrieved successfully',
      data: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signupUser,
  loginUser,
  getMe
};
