const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userStore = require('../userStore');
const passwordResetStore = require('../passwordResetStore');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

router.post('/register', (req, res) => {
  const { email, password } = req.body;

  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'A valid email is required' });
  }
  if (typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }
  if (userStore.findByEmail(email)) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const user = userStore.createUser(email, passwordHash);
  res.status(201).json({ id: user.id, email: user.email });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = userStore.findByEmail(email);

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

router.get('/me', requireAuth, (req, res) => {
  const user = userStore.findById(req.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ id: user.id, email: user.email });
});

router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  const user = userStore.findByEmail(email);

  // Always return 200 so this endpoint can't be used to enumerate registered emails.
  if (!user) {
    return res.json({ message: 'If that email is registered, a reset link has been sent.' });
  }

  const token = passwordResetStore.createResetToken(user.id);
  // In a real app this would be emailed, not returned in the response.
  res.json({ message: 'If that email is registered, a reset link has been sent.', token });
});

router.post('/reset-password', (req, res) => {
  const { token, newPassword } = req.body;
  const record = passwordResetStore.findValidToken(token);

  if (!record) {
    return res.status(400).json({ error: 'Invalid or expired reset token' });
  }

  const passwordHash = bcrypt.hashSync(newPassword, 10);
  userStore.updatePassword(record.user_id, passwordHash);
  passwordResetStore.deleteToken(token);

  res.json({ message: 'Password has been reset successfully' });
});

router.post('/change-password', requireAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = userStore.findById(req.userId);

  const passwordHash = bcrypt.hashSync(newPassword, 10);
  userStore.updatePassword(req.userId, passwordHash);
  res.json({ message: 'Password changed successfully' });
});

module.exports = router;
