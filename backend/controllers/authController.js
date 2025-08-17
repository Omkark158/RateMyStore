const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// USER SIGNUP -
exports.signup = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    // VALIDATIONS
    if (!name || name.length < 20 || name.length > 60) {
      return res.status(400).json({ msg: "Name must be 20–60 characters" });
    }

    if (address && address.length > 400) {
      return res.status(400).json({ msg: "Address must be max 400 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: "Invalid email format" });
    }

    const passRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
    if (!passRegex.test(password)) {
      return res.status(400).json({
        msg: "Password must be 8–16 chars, include 1 uppercase & 1 special char",
      });
    }

    // CHECK USER EXISTS
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    // HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // CREATE USER 
    const newUser = await User.create({
      name,
      email,
      address,
      password: hashedPassword,
      role: 'user'
    });

    // ISSUE TOKEN 
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      msg: 'User created successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        address: newUser.address,
        role: newUser.role
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// NORMAL LOGIN (user or store_owner) 
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(401).json({ msg: 'Invalid credentials' });

    if (role && user.role !== role) {
      return res.status(403).json({ msg: 'Unauthorized role' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// ADMIN LOGIN (requires secret key) 
exports.adminLogin = async (req, res) => {
  try {
    const { email, password, adminKey } = req.body;

    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({ msg: 'Invalid admin key' });
    }

    const user = await User.findOne({ where: { email, role: 'admin' } });
    if (!user) return res.status(401).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30m' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// ---------------- UPDATE PASSWORD ----------------
exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ msg: 'Both old and new passwords are required' });
    }

    // validate new password strength
    const passRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
    if (!passRegex.test(newPassword)) {
      return res.status(400).json({
        msg: "New password must be 8–16 chars, include 1 uppercase & 1 special char",
      });
    }

    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Old password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.json({ msg: 'Password updated successfully' });
  } catch (err) {
    console.error('Update password error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};
