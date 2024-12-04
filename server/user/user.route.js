const express = require('express');
const router = express.Router();
const userController = require('./user.controller');

/**
 * @api {GET} /api/v1/user/list 取得使用者列表
 */
router.get('/v1/user/list', userController.getUserList);

module.exports = router;