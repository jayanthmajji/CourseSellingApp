const jwt = require("jsonwebtoken");
const { JWT_USER } = require("../config");

function userMiddleware(req, res, next) {
  const token = req.headers.token;
  const decoded = jwt.verify(token, JWT_USER);

  if (decoded) {
    req.userId = decoded.id;
    next();
  } else {
    res.json({
      message: "You are not signed in!",
    });
  }
}

module.exports = {
  userMiddleware: userMiddleware,
};
