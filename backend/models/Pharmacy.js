const mongoose = require("mongoose");

const pharmacySchema = new mongoose.Schema({
  nom: { 
    type: String, 
    required: [true, "Le nom est requis"],
    trim: true,
    maxlength: [100, "Le nom ne peut pas dépasser 100 caractères"]
  },
  adresse: { 
    type: String, 
    required: [true, "L'adresse est requise"],
    trim: true
  },
  telephone: { 
    type: String, 
    required: [true, "Le téléphone est requis"],
    trim: true,
    match: [/^\+?[\d\s\-()]+$/, "Numéro de téléphone invalide"]
  },
  pharmacien: { 
    type: String, 
    required: [true, "Le nom du pharmacien est requis"],
    trim: true
  },
  services: [{ 
    type: String,
    trim: true,
    lowercase: true
  }]
}, { 
  timestamps: true 
});

// Index pour optimiser les recherches
pharmacySchema.index({ nom: 1 });
pharmacySchema.index({ adresse: 1 });

const Pharmacy = mongoose.model("Pharmacy", pharmacySchema);

module.exports = Pharmacy;
