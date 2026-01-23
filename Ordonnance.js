// models/Ordonnance.js
const mongoose = require("mongoose");

const OrdSchema = new mongoose.Schema({
  patient: String,
  fichier: String,
  medecin: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Ordonnance", OrdSchema);
