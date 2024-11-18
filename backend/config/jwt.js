const jwt = require('jsonwebtoken');
const { secret } = require('../config/jwt');

module.exports = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('Access denied.');

  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.status(401).send('Invalid token.');
    
    if (decoded.role !== 'admin') {
      return res.status(403).send('Admin access required.');
    }

    req.adminId = decoded.id;  
    next();
  });
};
