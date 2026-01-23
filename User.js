const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },

  email: String,

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["admin", "medecin", "pharmacie"], // ✔ changé ici
    required: true
  },

  nom: String,
  telephone: String,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("User", UserSchema);