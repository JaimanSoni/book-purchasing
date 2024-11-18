const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const authenticate = async (req, res, next) => {
  
  const token = req.headers["authorization"]?.split(" ")[1]; 

  if (!token) {
    return res
      .status(401)
      .json({ message: "No token provided, access denied" });
  }

  try {
    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
      if (err) {
        return res
          .status(400)
          .json({ msg: "Token verification failed, authorization denied" });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticate;
