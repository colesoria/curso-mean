const jwt = require("jwt-simple");
const moment = require("moment");
const secret = "clave-secreta-para-la-app";
exports.createToken = function(user) {
  const payload = {
    sub: user._id,
    name: user.fullName,
    nick: user.nickname,
    email: user.email,
    roles: user.roles,
    avatar: user.avatar,
    iat: moment().unix(),
    exp: moment()
      .add(30, "days")
      .unix()
  };
  return jwt.encode(payload, secret);
};
