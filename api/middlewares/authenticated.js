const jwt = require("jwt-simple");
const moment = require("moment");
const secret = "clave-secreta-para-la-app";

exports.ensureAuth = function(req, res, next) {
  if (!req.headers.authorization) {
    return res
      .status(403)
      .send({ message: "La petición no tiene la cabecera de autenticación." });
  }
  const token = req.headers.authorization.replace(/['"]+/g, "");
  try {
    const payload = jwt.decode(token, secret);
    if (payload.ex <= moment().unix()) {
      return res.status(401).send({ message: "El token ha expirado." });
    }
    req.user = payload;
  } catch (ex) {
    return res.status(404).send({ message: "El token no es válido." });
  }

  next();
};
