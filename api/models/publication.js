const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PublicationSchema = Schema({
  text: String,
  file: String,
  user: { type: Schema.ObjectId, ref: "User" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Publication", PublicationSchema);
