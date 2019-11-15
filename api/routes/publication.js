const express = require("express");
const PublicationController = require("./../controllers/publication");
const multipart = require("connect-multiparty");
const api = express.Router();
const md_auth = require("./../middlewares/authenticated");
const md_upload = multipart({ uploadDir: "./uploads/publications" });

// Rutas que requieren autenticación
api.get(
  "/publications",
  md_auth.ensureAuth,
  PublicationController.getAllPublications
);
api.get(
  "/publication/:id",
  md_auth.ensureAuth,
  PublicationController.getPublicationById
);
api.put(
  "/publication/:id",
  md_auth.ensureAuth,
  PublicationController.updatePublication
);
api.post(
  "/publication",
  md_auth.ensureAuth,
  PublicationController.createPublication
);
api.post(
  "/publication/upload-image/:id",
  [md_auth.ensureAuth, md_upload],
  PublicationController.uploadImage
);
api.get(
  "/publication/image/:imageFile",
  md_auth.ensureAuth,
  PublicationController.getImageFile
);
api.delete(
  "/publication/delete/:id",
  md_auth.ensureAuth,
  PublicationController.deletePublication
);

module.exports = api;
