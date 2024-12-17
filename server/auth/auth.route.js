const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');

/**
 * @api {POST} /api/v1/login 使用者登入
 */
router.post('/v1/login', authController.login);

module.exports = router;