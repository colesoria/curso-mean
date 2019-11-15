const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PermissionSchema = Schema({
  name: { type: String, unique: true, dropDups: true, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Permission", PermissionSchema);
