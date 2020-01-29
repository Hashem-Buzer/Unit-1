const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
function isAuth(req, res, next) {
  var token = req.body.token || req.query.token || req.headers["authorization"];

  if (token) {
    jwt.verify(token, process.env.secretOrKey, function(err, decoded) {
      console.log(decoded);
      if (err) {
        return res.status(401).json({
          message: "failed authentication: invalid token"
        });
      }
      console.log(decoded);
      console.log("success");
      next();
    });
  } else {
    return res.status(401).json({
      message: "failed authentication: no token provided."
    });
  }
}
module.exports = isAuth;
