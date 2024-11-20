const jwt = require('jsonwebtoken');

// Function to create an access token
const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '7d', // Token expires in 1 day
  });
};

// Function to create a refresh token
const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = {
  createAccessToken,
  createRefreshToken,
};
