const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FollowSchema = Schema({
  user: { type: Schema.ObjectId, ref: "User" },
  followed: { type: Schema.ObjectId, ref: "User" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Follow", FollowSchema);
