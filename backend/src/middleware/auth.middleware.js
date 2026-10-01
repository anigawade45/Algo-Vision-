const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');
const { errorResponse } = require('../utils/apiResponse');

const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check HTTP-only cookie
    if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // 2. Fallback to Authorization header
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return errorResponse(
        res,
        401,
        'Unauthorized access. Token is missing.'
      );
    }

    // 3. Verify JWT
    const decoded = jwt.verify(token, env.jwtSecret);

    // 4. Find user
    const user = await User.findById(decoded.userId);

    if (!user) {
      return errorResponse(
        res,
        401,
        'Unauthorized access. User no longer exists.'
      );
    }

    // 5. Attach authenticated user
    req.user = user;
    next();
  } catch (error) {
    return errorResponse(
      res,
      401,
      'Unauthorized access. Invalid or expired token.'
    );
  }
};

module.exports = {
  protect,
};