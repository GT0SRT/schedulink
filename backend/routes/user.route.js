const express = require('express');
const router = express.Router();
const User = require('../models/user.model');

// Create a user (student or teacher)
router.post('/', async (req, res, next) => {
  try {
    const { name, role, email, enrolmentId } = req.body;
    const u = await User.create({ name, role, email, enrolmentId });
    res.json(u);
  } catch (err) { next(err); }
});

module.exports = router;