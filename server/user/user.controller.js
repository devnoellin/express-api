const { Op } = require('sequelize');

const { ValidationError } = require('../../handlers/apiErrors.js');
const Users = require('./user.model');

/**
 * 取得使用者列表
 * @apiDefine getUserList
 * @apiPath {GET} /api/v1/user/list
 *
 * @apiParam {string} [sort="created_at"] 排序字段，可選值：id, username, created_at, updated_at
 * @apiParam {string} [order="desc"] 排序順序，可選值：asc, desc
 * @apiParam {number} [first_result=0] 分頁起始位置
 * @apiParam {number} [max_results=20] 每頁的最大筆數
 * @apiParam {boolean} [enable] 篩選是否啟用的使用者
 * @apiParam {string} [phone] 篩選電話號碼，支援模糊查詢
 *
 * @apiSuccess {string} result ok/error
 * @apiSuccess {Array} list 使用者列表
 * @apiError E10001: Invalid sort field
 * @apiError E10002: Invalid order field
 * @apiSuccessExample {json} 成功回傳
      HTTP/1.1 200 OK
      {
        "result": "ok",
        "list": [
          {
            "user_id": 1,
            "username": "Alice",
            "phone": "123456789",
            "created_at": "2023-12-01T10:00:00.000Z"
          },
          {
            "user_id": 2,
            "username": "Bob",
            "phone": "987654321",
            "created_at": "2023-12-01T11:00:00.000Z"
          }
        ]
      }
 * @apiErrorExample {json} 錯誤回傳
      HTTP/1.1 400 OK
      {
        "result": "error",
        "msg": "Invalid sort field",
        "code": "E10001",
        "errors": {},
      }
 */
exports.getUserList = async (req, res, next) => {
  try {
    const {
      sort = 'created_at',
      order = 'desc',
      first_result = 0,
      max_results = 20,
      enable,
      phone,
    } = req.query;
    const validSortFields = ['user_id', 'username', 'created_at', 'updated_at'];
    const validOrder = ['asc', 'desc'];

    if (!validSortFields.includes(sort)) {
      throw new ValidationError('Invalid sort field', 'E10001');
    }
    if (!validOrder.includes(order.toLowerCase())) {
      throw new ValidationError('Invalid order field', 'E10002');
    }

    let where = {};

    if (enable) {
      where.enable = enable === 'true';
    }
    if (phone) {
      where.phone = { [Op.like]: `%${phone}%` };
    }

    const users = await Users.findAll({
      where,
      attributes: ['user_id', 'username', 'phone', 'created_at'],
      order: [[sort, order.toUpperCase()]],
      offset: parseInt(first_result, 10),
      limit: parseInt(max_results, 10),
    });

    res.json({
      result: 'ok',
      list: users,
    });
  } catch (error) {
    console.error('Error fetching user list:', error);

    next(error);
  }
};
