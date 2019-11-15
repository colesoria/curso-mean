const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = Schema({
  emiter: { type: Schema.ObjectId, ref: "User" },
  receiver: { type: Schema.ObjectId, ref: "User" },
  message: String,
  read: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Message", MessageSchema);
