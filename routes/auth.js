const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// SCHEMA
const MedecinSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  email: String,
  username: String,
  password: String,
  dateNaissance: String,
  specialite: String,
  numeroInscription: String,
  etablissement: String
});

const Medecin = mongoose.model("Medecin", MedecinSchema);

// REGISTER
router.post("/register-medecin", async (req, res) => {
  try {
    const medecin = new Medecin(req.body);
    await medecin.save();

    res.json({
      message: "Compte créé avec succès",
      user: medecin
    });

  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await Medecin.findOne({ username, password });

  if (!user) {
    return res.status(401).json({ error: "Identifiants incorrects" });
  }

  res.json({ message: "Connexion OK", user });
});

module.exports = router;
