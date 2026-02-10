const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

/* ===== LOGIN ===== */
router.post("/login", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ message: "Champs manquants" });
    }

    const user = await User.findOne({ username, role });
    if (!user) {
      return res.status(401).json({ message: "Utilisateur introuvable" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    res.json({
      username: user.username,
      role: user.role
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

/* ===== REGISTER PHARMACIE ===== */
router.post("/register-pharmacie", async (req, res) => {
  try {
    const { username, password } = req.body;

    if(!username || !password){
      return res.status(400).json({ message: "Champs manquants" });
    }

    const exist = await User.findOne({ username, role:"pharmacie" });
    if(exist){
      return res.status(400).json({ message: "Utilisateur existe déjà" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hash,
      role: "pharmacie"
    });

    await user.save();

    res.json({ message: "✅ Compte pharmacie créé avec succès" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur création pharmacie" });
  }
});

module.exports = router;
