let User = require("./../models/user");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("./../services/jwt");
const mongoosePaginate = require("mongoose-pagination");
const fs = require("fs");
const path = require("path");

function getAllUsers(req, res) {
  const identityUserId = req.user.sub;
  const itemsPerPage = 5;
  let page = 1;
  if (req.params.page) {
    page = req.params.page;
  }
  User.find()
    .sort("_id")
    .paginate(page, itemsPerPage, (err, users, total) => {
      if (err)
        return res.status(500).send({ message: "Error en la petición." });

      if (!users)
        return res
          .status(404)
          .send({ message: "No se han eencontrado registros." });
      return res
        .status(200)
        .send({ users, total, pages: Math.ceil(total / itemsPerPage) });
    });
}

function getUserById(req, res) {
  if (!req.params.id) {
    return res.status(400).send({ message: "No hay un usuario a buscar." });
  }
  User.findById(req.params.id, (err, user) => {
    if (err)
      return res.status(500).send({
        message: "error en la petición"
      });
    if (!user)
      return res.status(404).send({ message: "El usuario no existe." });
    user.password = undefined;
    return res.status(200).send({ user });
  });
}

function createUser(req, res) {
  const params = req.body;
  let user = new User();
  if (params.fullName && params.email && params.password && params.nickname) {
    user.fullName = params.fullName;
    user.email = params.email;
    user.nickname = params.nickname;
    bcrypt.hash(params.password, null, null, (err, hash) => {
      user.password = hash;
      user.save((err, userStored) => {
        if (err) {
          return res.status(500).send({
            message: `Usuario no guardado en la base de datos ${err.message}`
          });
        }
        userStored.password = undefined;
        return res.status(200).send({ user: userStored });
      });
    });
  } else {
    return res.status(400).send({
      message: "No han llegado todos los datos necesarios."
    });
  }
}

function uploadImage(res, res) {
  const userId = req.params.id;
  if (userId !== req.user.sub) {
    return removeFilesOfUploads(
      req.files.image,
      "No tienes permiso para actualizar los datos del ususario."
    );
  }

  if (req.files) {
    const filePath = req.files.image.path;
    const fileSplit = filePath.split("\\");
    const fileName = fileSplit[2];
    const extSplit = fileName.split(".");
    const fileExt = extSplit[1];
    if (fileExt === "png" || fileExt === "jpg" || fileExt === "jpeg") {
      User.findByIdAndUpdate(
        userId,
        { avatar: fileName },
        { new: true },
        (err, userUpdated) => {
          if (err)
            return res
              .status(500)
              .send("Ha habido un error al actualizar los datos del usuario.");
          if (!userUpdated)
            return res.status(404).send({
              message: "No se ha podido actualizar la información del usuario."
            });
          return res.status(200).send({ user: userUpdated });
        }
      );
    } else {
      return removeFilesOfUploads(
        filePath,
        "El tipo de archivo no es correcto."
      );
    }
  } else {
    return res.status(200).send({ message: "No se han subido imágenes." });
  }
}

function removeFilesOfUploads(filePath, message) {
  fs.unlink(filePath, err => {
    return res.status(400).send(message);
  });
}

function getImageFile(req, res) {
  const imageFile = req.params.imageFile;
  const pathFile = "./uploads/users/" + imageFile;
  fs.exists(pathFile, exists => {
    if (exists) {
      return res.sendFile(path.resolve(pathFile));
    } else {
      return res.status(200).send({ message: "No existe la imágen." });
    }
  });
}

function updateUser(req, res) {
  const userId = req.params.id;
  const update = req.body;
  delete update.password;
  if (userId !== req.user.sub) {
    res.status(500).send({
      message: "No tienes permiso para actualizar los datos del ususario."
    });
  }
  User.findByIdAndUpdate(userId, update, { new: true }, (err, userUpdated) => {
    if (err)
      return res
        .status(500)
        .send("Ha habido un error al actualizar los datos del usuario.");
    if (!userUpdated)
      return res.status(404).send({
        message: "No se ha podido actualizar la información del usuario."
      });
    return res.status(200).send({ user: userUpdated });
  });
}

function login(req, res) {
  const params = req.body;
  if (!params.email || !params.password)
    return res.status(400).send({ message: "faltan datos." });
  const email = params.email;
  const password = params.password;

  User.findOne({ email: email }, (err, user) => {
    if (err) return res.status(500).send({ message: "Error en la petición." });
    if (user) {
      bcrypt.compare(password, user.password, (err, check) => {
        if (check) {
          if (params.getToken) {
            return res.status(200).send({
              token: jwt.createToken(user)
            });
          }
          user.password = undefined;
          return res.status(200).send({ user });
        } else {
          return res
            .status(404)
            .send({ message: "El usuario o la contraseña no son correctos." });
        }
      });
    }
  });
}

function getCounters(req, res) {
  let userId = req.user.sub;
  if (req.params.id) {
    userId = req.params.id;
  }
  getCountFollow(userId).then(value => {
    return res.status(200).send({ value });
  });
}

async function getCountFollow(user_id) {
  const following = await Follow.count({ user: user_id }).exec((err, count) => {
    if (err) return handleError(err);
    return count;
  });

  const followed = await Follow.count({ followed: user_id }).exec(
    (err, count) => {
      if (err) return handleError(err);
      return count;
    }
  );

  const publications = await Publication.count({ user: user_id }).exec(
    (err, count) => {
      if (err) return handleError(err);
      return count;
    }
  );

  return {
    following: following,
    followed: followed,
    publications: publications
  };
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  uploadImage,
  getImageFile,
  getCounters,
  login
};
