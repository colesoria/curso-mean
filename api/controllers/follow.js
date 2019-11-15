const path = require("path");
const fs = require("fs");
const mongoosePaginate = require("mongoose-pagination");

const User = require("./../models/user");
const Follow = require("./../models/follow");

function getFollowers(req, res) {
  const userId = req.user.sub;
  const itemsPerPage = 5;
  let page = 1;
  Follow.find({ followed: userId })
    .sort("_id")
    .paginate(page, itemsPerPage, (err, users) => {
      if (err)
        return res
          .status(500)
          .send({ message: "Ha habido un error en la consulta." });
      if (!users)
        return res
          .status(404)
          .send({ message: "No se han encontrado usuarios seguidores." });
      return res.status(200).send({ users });
    });
}

function getFollowed(req, res) {
  const userId = req.user.sub;
  Follow.find({ user: userId }, (err, users) => {
    if (err)
      return res
        .status(500)
        .send({ message: "Ha habido un error en la consulta." });
    if (!users)
      return res
        .status(404)
        .send({ message: "No se han encontrado usuarios seguidores." });
    return res.status(200).send({ users });
  });
}

function followUser(req, res) {
  const follower = req.user.sub;
  const followed = req.params.id;
  let follow = new Follow();
  follow.user = follower;
  follow.followed = followed;
  follow.save((err, followStored) => {
    if (err)
      return res
        .status(500)
        .send({ message: "Ha habido un problema al guardar los datos." });
    return res.status(200).send({ message: "Sigues a un nuevo usuario." });
  });
}

function unfollowUser(req, res) {
  const follower = req.user.sub;
  const followed = req.params.id;
  Follow.findOneAndDelete({ user: follower, followed: followed }, err => {
    if (err)
      return res
        .status(500)
        .send({ message: "No se ha podido eliminar el seguimiento." });
    return res
      .status(200)
      .send({ message: "Has dejado de seguir al usuario." });
  });
}

module.exports = {
  getFollowers,
  getFollowed,
  followUser,
  unfollowUser
};
