const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoleSchema = Schema({
  name: { type: String, unique: true, dropDups: true, required: true },
  permissions: [{ type: Schema.ObjectId, ref: "Permission" }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Role", RoleSchema);
