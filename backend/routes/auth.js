const express = require("express");
const router = express.Router();
const User = require("../models/User");

// REGISTER médecin / pharmacie
router.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ error: "Champs manquants" });
    }

    const exist = await User.findOne({ username });
    if (exist) {
      return res.status(400).json({ error: "Utilisateur existe déjà" });
    }

    const user = new User({ username, password, role });
    await user.save();

    res.json({ message: "Compte créé avec succès", user });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username, password });
  if (!user) {
    return res.status(401).json({ error: "Identifiants incorrects" });
  }

  res.json({ message: "Connexion OK", user });
});

module.exports = router;
