const express = require("express");
const UserController = require("./../controllers/user");
const multipart = require("connect-multiparty");
const api = express.Router();
const md_auth = require("./../middlewares/authenticated");
const md_upload = multipart({ uploadDir: "./uploads/users" });

// Rutas que requieren autenticación
api.get("/users", md_auth.ensureAuth, UserController.getAllUsers);
api.get("/user/:id", md_auth.ensureAuth, UserController.getUserById);
api.put("/user/:id", md_auth.ensureAuth, UserController.updateUser);
api.get("/user/counters/:id?", md_auth.ensureAuth, UserController.getCounters);
// Rutas públicas
api.post("/register", UserController.createUser);
api.post("/signin", UserController.login);
api.post(
  "/user/upload-image/:id",
  [md_auth.ensureAuth, md_upload],
  UserController.uploadImage
);
api.get(
  "/user/image/:imageFile",
  md_auth.ensureAuth,
  UserController.getImageFile
);

module.exports = api;
