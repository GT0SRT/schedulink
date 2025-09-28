require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const app = express();
const salt = bcrypt.genSaltSync(10);
const qrRoutes = require('./routes/generateQR');

app.use(cors({ origin: process.env.WEB_URI, credentials: true }));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// JWT token generator
const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

app.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password, role, theme = false } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    // else Create new user
    const hashedPassword = bcrypt.hashSync(password, salt);
    const userDoc = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      theme,
    });

    const token = createToken(userDoc._id);

    // Set HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "None",
      secure: true, // Set to true in production with HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send user (excluding password)
    const { password: _, ...safeUser } = userDoc._doc;

    res.status(201).json(safeUser);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Signup failed', message: e.message });
  }
});

app.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'None',
      secure: true, // true in production with HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const { password: _, ...safeUser } = user._doc;
    res.status(200).json(safeUser);
  } catch (e) {
    console.error('Signin error:', e);
    res.status(500).json({ error: 'Signin failed', message: e.message });
  }
});

app.get('/me', (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });

    User.findById(decoded.id).select('-password').then(user => {
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    }).catch(err => res.status(500).json({ error: 'Server error' }));
  });
});

app.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

app.use('/api/generateQR', qrRoutes);

// Server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
