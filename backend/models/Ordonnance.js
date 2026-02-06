const mongoose = require("mongoose");

const OrdonnanceSchema = new mongoose.Schema({
  code: { type: String, required: true },

  medecin: {
    id: String,
    nom: String
  },

  pharmacie: {
    id: String,
    nom: String
  },

  patientNom: String,
  medicaments: String,

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
