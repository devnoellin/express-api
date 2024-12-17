const express = require('express');
const userRoutes = require('./server/user/user.route');
const authRoutes = require('./server/auth/auth.route');

const router = express.Router();

router.get('/health-check', (req, res) =>
  res.send('OK')
);

router.use(userRoutes);
router.use(authRoutes);

module.exports = router;
