const mongoose = require("mongoose");

const OrdonnanceSchema = new mongoose.Schema({
  code: String,
  patientNom: String,
  age: String,
  genre: String,
  adresse: String,
  medicaments: String,
  statut: String,

  medecin: {
    nom: String
  },

  pharmacie: {
    id: String,
    nom: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Ordonnance", OrdonnanceSchema);
