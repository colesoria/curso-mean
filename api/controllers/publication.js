const path = require("path");
const fs = require("fs");
const moment = require("moment");
const mongoosePaginate = require("mongoose-pagination");

const Publication = require("./../models/publication");
const User = require("./../models/user");
const Follow = require("./../models/follow");

function getAllPublications(req, res) {
  const userId = req.user.sub;
  let page = 1;
  const itemsPerPage = 10;
  if (req.params.page) {
    page = req.params.page;
  }
  const followed = Follow.find({ user: userId }, (err, follows) => {
    if (err)
      return res
        .status(500)
        .send({ message: "No se han podido conseguir las publicaciones" });
    if (!follows)
      return res.status(200).send({ message: "Aun no sigues a nadie." });
    follows.forEach(follow => {
      Publication.find({ user: follow.followed })
        .sort("created_at", "DESC")
        .populate("user")
        .paginate(page, itemsPerPage, (err, publications) => {
          if (err)
            return res.send(500).send({
              message: "Ha habido un error al leer las publicaciones"
            });
          if (!publications)
            return res.send(404).send({ message: "No hay ningún mensaje." });
          return res.status(200).send(publications);
        });
    });
  });
}

function getPublicationById(req, res) {
  const publicationId = req.parqms.id;
  Publication.findById(publicationId)
    .populate("user")
    .exec((err, publication) => {
      if (err)
        return res
          .status(500)
          .send({ message: "Ha habido un problema al reqalizar la consulta." });
      if (!publication)
        return res
          .status(404)
          .send({ message: "No se ha encontrado la publicación." });
      return res.status(200).send({ publication });
    });
}

function createPublication(req, res) {
  let publication = new Publication();
  if (!params.body.text) {
    return res.status(400).send({ message: "Debes enviar un texto" });
  }
  publication.text = req.body.text;
  publication.user = req.user.sub;
  publication.save((err, publicationStored) => {
    if (err)
      return res.status(500).send({ message: "Error al guardar los datos." });
    if (!publicationStored)
      return res
        .status(404)
        .send({ message: "La publicación no se ha guardado." });
    return res.status(200).send({ publicationStored });
  });
}

function updatePublication(req, res) {
  const publicationId = req.params.id;
  const userId = req.user.sub;
  Publication.find({ _id: publicationId, user: userId }, (err, publication) => {
    if (err)
      return res
        .status(500)
        .send({ message: "Ha habido un problema al intentar actualizar." });
    if (!publication)
      return res
        .status(404)
        .send({ message: "No se ha encontrado la publicación" });
    publication.text = req.body.text;
    publication.save({ new: true }, (err, publicationUpdated) => {
      if (err)
        return res
          .status(500)
          .send({ message: "Ha habido un problema al actualizar." });
      if (!publicationUpdated)
        return res
          .status(404)
          .send({ message: "No se ha poduido actualizar la publicación" });
      return res.status(200).send({ publication });
    });
  });
}

function deletePublication(req, res) {
  const publicationId = req.params.id;
  Publication.findOneAndDelete(
    { _id: publicationId, user: req.user.sub },
    err => {
      if (err)
        return res
          .status(500)
          .send({ message: "Ha habido un porblema al realizar la consulta." });

      return res
        .status(200)
        .send({ message: "La publicación se ha eliminado correctamente." });
    }
  );
}

function uploadImage(res, res) {
  const publicationId = req.params.id;

  if (req.files) {
    const filePath = req.files.image.path;
    const fileSplit = filePath.split("\\");
    const fileName = fileSplit[2];
    const extSplit = fileName.split(".");
    const fileExt = extSplit[1];
    if (fileExt === "png" || fileExt === "jpg" || fileExt === "jpeg") {
      Publication.findByIdAndUpdate(
        publicationId,
        { file: fileName },
        { new: true },
        (err, publicationUpdated) => {
          if (err)
            return res
              .status(500)
              .send("Ha habido un error al actualizar los datos del usuario.");
          if (!publicationUpdated)
            return res.status(404).send({
              message: "No se ha podido actualizar la información del usuario."
            });
          return res.status(200).send({ publication: publicationUpdated });
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
  const pathFile = "./uploads/publications/" + imageFile;
  fs.exists(pathFile, exists => {
    if (exists) {
      return res.sendFile(path.resolve(pathFile));
    } else {
      return res.status(200).send({ message: "No existe la imágen." });
    }
  });
}

module.exports = {
  getAllPublications,
  getPublicationById,
  createPublication,
  updatePublication,
  deletePublication,
  uploadImage,
  getImageFile
};
