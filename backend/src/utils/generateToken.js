const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn, cookieName, nodeEnv } = require('../config/env');

/**
 * Signs a JWT for the given admin id and sets it as an HTTP-only cookie on the response.
 */
const generateTokenAndSetCookie = (res, adminId) => {
  const token = jwt.sign({ id: adminId }, jwtSecret, { expiresIn: jwtExpiresIn });

  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: nodeEnv === 'production',
    sameSite: nodeEnv === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};

module.exports = generateTokenAndSetCookie;
