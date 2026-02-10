const mongoose = require("mongoose");

const OrdonnanceSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true
  },

  medecin: {
    id: String,
    nom: String
  },

  pharmacie: {
    id: String,
    nom: String
  },

  patientNom: {
    type: String,
    required: true
  },

  medicaments: {
    type: String,
    required: true
  },

  statut: {
    type: String,
    default: "envoyee"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Ordonnance", OrdonnanceSchema);
