const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = Schema({
  fullName: { type: String, required: true },
  nickname: { type: String, unique: true, dropDups: true, required: true },
  email: { type: String, unique: true, dropDups: true, required: true },
  password: String,
  roles: [{ type: Schema.ObjectId, ref: "Role" }],
  avatar: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);
