const jwt = require('jsonwebtoken');

const {
  ValidationError,
} = require('../../handlers/apiErrors.js');
const {
  User,
} = require('./auth.model.js');
/**
 * 使用者登入
 * @apiDefine login
 * @apiPath {POST} /api/v1/login
 *
 * @apiParam {string} username 使用者名稱 (必填)
 * @apiParam {string} password 密碼 (必填)
 *
 * @apiSuccess {string} result ok/error
 * @apiSuccess {string} token JWT Token
 * @apiError E20001 Missing username or password
 * @apiError E20002 Invalid username or password
 * @apiSuccessExample {json} 成功回傳
      HTTP/1.1 200 OK
      {
        "result": "ok",
      }
 * @apiErrorExample {json} 錯誤回傳
      HTTP/1.1 400 OK
      {
        "result": "error",
        "msg": "Invalid username or password",
        "code": "E20002",
        "errors": {},
      }
 */
exports.login = async (req, res, next) => {
  try {
    const {
      account,
      password,
    } = req.body;

    // 驗證是否提供帳號與密碼
    if (!account || !password) {
      throw new ValidationError('Missing username or password', 'E20001');
    }

    // 查詢使用者
    const user = await User.findOne({
      where: {
        account,
      },
      attributes: ['user_id', 'username', 'email', 'phone', 'password_hash'],
    });

    if (!user) {
      throw new ValidationError('Invalid username or password', 'E20002');
    }

    // 驗證密碼
    const isPasswordValid = password === user.password_hash;

    if (!isPasswordValid) {
      throw new ValidationError('Invalid username or password', 'E20002');
    }

    const payload = {
      user_id: user.user_id,
      username: user.username,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { algorithm: 'RS256', expiresIn: '1h' });

    if (!token) {
      throw new ValidationError('Token is missing or invalid', 'E20003');
    }

    const options = {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    }

    res
      .cookie('sid', token, options)
      .json({
        result: 'ok',
      });
  } catch (error) {
    console.error('Error during login:', error);

    next(error);
  }
};