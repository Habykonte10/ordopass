const mongoose = require("mongoose");

const pharmacySchema = new mongoose.Schema({
  nom: { type: String, required: true },
  adresse: String,
  telephone: String,
  pharmacien: String,
  services: [String],
  online: { type: Boolean, default: true },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Pharmacy", pharmacySchema);
