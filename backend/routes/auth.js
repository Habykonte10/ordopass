const express = require("express");
const router = express.Router();
const User = require("../models/User");

/* REGISTER */
router.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ error: "Champs manquants" });
    }

    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(400).json({ error: "Utilisateur existe déjà" });
    }

    const user = await User.create({ username, password, role });

    res.json({
      message: "Compte créé avec succès",
      user: {
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/* LOGIN */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ error: "Identifiants incorrects" });
    }

    res.json({
      message: "Connexion réussie",
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
