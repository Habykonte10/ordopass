const mongoose = require("mongoose");

const MedecinSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: {
    type: String,
    default: "medecin"
  }
});

module.exports = mongoose.model("Medecin", MedecinSchema);
