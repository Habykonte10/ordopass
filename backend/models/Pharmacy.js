const mongoose = require("mongoose");

const PharmacySchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telephone: String,
  adresse: String,
  pharmacien: String,
  horaires: String,
  services: [String],

  role: {
    type: String,
    default: "pharmacie"
  },

  online: {
    type: Boolean,
    default: false
  },

  active: {
    type: Boolean,
    default: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Pharmacy", PharmacySchema);
