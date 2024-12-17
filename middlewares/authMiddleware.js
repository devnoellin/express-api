const jwt = require('jsonwebtoken');
const { ValidationError } = require('../handlers/apiErrors');

const authMiddleware = (req, _, next) => {
  const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
  const token = req.headers.authorization?.split(' ')[1]; // 從 Header 取得 Token

  if (!token) {
    throw new ValidationError('Authorization token is missing', 'E20003');
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    console.error('Invalid token:', err);

    throw new ValidationError('Invalid authorization token', 'E20004');
  }
};

module.exports = authMiddleware;