const express = require('express');
const userRoutes = require('./server/user/user.route');

const router = express.Router();

router.get('/health-check', (req, res) =>
  res.send('OK')
);

router.use(userRoutes);

module.exports = router;
