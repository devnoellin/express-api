const { Op } = require('sequelize');

const {
  ValidationError,
} = require('../../handlers/apiErrors.js');
const {
  isValidSortField,
  isValidOrder,
  isNumber,
} = require('../../handlers/validation.js');
const {
  User,
} = require('./user.model');

/**
 * 取得使用者列表
 * @apiDefine getUsersList
 * @apiPath {GET} /api/v1/users
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
 * @apiSuccess {number} total 符合條件的使用者總數
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
        ],
        "total": 50,
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
exports.getUsersList = async (req, res, next) => {
  try {
    const {
      sort = 'user_id',
      order = 'asc',
      first_result = 0,
      max_results = 20,
      enable,
      phone,
    } = req.query;
    const validSortFields = ['user_id', 'username', 'created_at', 'updated_at'];

    if (!isValidSortField(sort, validSortFields)) {
      throw new ValidationError('Invalid sort field', 'E10001');
    }
    if (!isValidOrder(order)) {
      throw new ValidationError('Invalid order field', 'E10002');
    }

    let where = {};

    if (enable) {
      where.enable = enable === 'true';
    }
    if (phone) {
      where.phone = {
        [Op.like]: `%${phone}%`
      };
    }

    const users = await User.findAll({
      where,
      attributes: ['user_id', 'username', 'phone', 'created_at'],
      order: [
        [sort, order.toUpperCase()],
      ],
      offset: parseInt(first_result, 10),
      limit: parseInt(max_results, 10),
    });

    const total = await User.count({
      where
    });

    res.json({
      result: 'ok',
      list: users,
      total,
    });
  } catch (error) {
    console.error('Error fetching user list:', error);

    next(error);
  }
};


/**
 * 取得使用者資料
 * @apiDefine getUserData
 * @apiPath {GET} /api/v1/user/{user_id}
 *
 * @apiParam {string} user_id 使用者 ID (必填)
 *
 * @apiSuccess {string} result ok/error
 * @apiSuccess {Object} data 使用者資料
 * @apiError E20001 Missing user_id parameter
 * @apiError E20002 Invalid user_id format
 * @apiError E20003 User not found
 * @apiSuccessExample {json} 成功回傳
      HTTP/1.1 200 OK
      {
        "result": "ok",
        "data": {
          "user_id": "000001",
          "username": "Alice",
          "email": "alice@example.com",
          "phone": "123456789",
          "address": "台北市",
          "role": "customer",
          "created_at": "2023-12-01T10:00:00.000Z",
          "updated_at": "2023-12-01T11:00:00.000Z"
        }
      }
 * @apiErrorExample {json} 錯誤回傳
      HTTP/1.1 404 OK
      {
        "result": "error",
        "msg": "User not found",
        "code": "E20002",
        "errors": {},
      }
 */
exports.getUserData = async (req, res, next) => {
  try {
    const {
      user_id
    } = req.params;

    // 驗證是否提供 user_id
    if (!user_id) {
      throw new ValidationError('Missing user_id parameter', 'E20001');
    }

    // 驗證user_id格式是否為純數字
    if (!isNumber(user_id)) {
      throw new ValidationError('Invalid user_id format', 'E20002');
    }

    // 查詢使用者資料
    const user = await User.findOne({
      where: {
        user_id
      },
      attributes: ['user_id', 'username', 'email', 'phone', 'address', 'created_at', 'updated_at'],
    });

    // 如果找不到該使用者
    if (!user) {
      throw new ValidationError('User not found', 'E20003');
    }

    // 成功回傳使用者資料
    res.json({
      result: 'ok',
      data: user,
    });
  } catch (error) {
    console.error('Error fetching user data:', error);

    next(error);
  }
};