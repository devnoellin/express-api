const express = require('express');
const router = express.Router();
const userController = require('./user.controller');

/**
 * @api {GET} /api/v1/users 取得使用者列表
 */
router.get('/v1/users', userController.getUsersList);

/**
 * @api {GET} /api/v1/user/{user_id} 取得使用者資料
 */
router.get('/v1/user/:user_id', userController.getUserData);


module.exports = router;