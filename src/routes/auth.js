const express = require('express');
const userStore = require('../userStore');

const router = express.Router();

router.post('/register', (req, res) => {
  const { email, password } = req.body;

  if (userStore.findByEmail(email)) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const user = userStore.createUser(email, password);
  res.status(201).json({ id: user.id, email: user.email });
});

module.exports = router;
