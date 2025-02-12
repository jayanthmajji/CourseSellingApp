const jwt = require("jsonwebtoken");
const { JWT_ADMIN } = require("../config");

function adminMiddleware(req, res, next) {
  const token = req.headers.token;
  const decoded = jwt.verify(token, JWT_ADMIN);

  if (decoded) {
    req.adminId = decoded.id;
    next();
  } else {
    res.json({
      message: "You are not signed in!",
    });
  }
}

module.exports = {
  adminMiddleware: adminMiddleware,
};
