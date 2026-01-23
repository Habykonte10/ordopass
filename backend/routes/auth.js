const express = require("express");
const router = express.Router();
const User = require("../models/User");

/* ======================
   TEST
====================== */
router.get("/test", (req, res) => {
  res.json({ status: "AUTH API OK" });
});

/* ======================
   INSCRIPTION
====================== */
router.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs sont obligatoires",
      });
    }

    if (!["medecin", "pharmacien"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Rôle invalide",
      });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Nom d'utilisateur déjà utilisé",
      });
    }

    const user = await User.create({ username, password, role });

    res.json({
      success: true,
      message: "Compte créé avec succès",
      user: {
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* ======================
   CONNEXION
====================== */
router.post("/login", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const user = await User.findOne({ username, role });

    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Identifiants incorrects",
      });
    }

    res.json({
      success: true,
      message: "Connexion réussie",
      user: {
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
