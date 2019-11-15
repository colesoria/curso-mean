const express = require("express");
const FollowController = require("./../controllers/follow");
const api = express.Router();
const md_auth = require("./../middlewares/authenticated");

// Rutas que requieren autenticación
api.get("/followers", md_auth.ensureAuth, FollowController.getFollowers);
api.get("/followed", md_auth.ensureAuth, FollowController.getFollowed);
api.post("/follow/:id", md_auth.ensureAuth, FollowController.followUser);
api.post("/unfollow/:id", md_auth.ensureAuth, FollowController.unfollowUser);

module.exports = api;
