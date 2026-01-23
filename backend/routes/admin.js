const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const User = require("../models/User");

const router = express.Router();

/* LISTE UTILISATEURS */
router.get("/users", auth, admin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* STATISTIQUES */
router.get("/stats", auth, admin, async (req, res) => {
  try {
    const total = await User.countDocuments();
    const medecins = await User.countDocuments({ role: "medecin" });
    const pharmaciens = await User.countDocuments({ role: "pharmacien" });
    const admins = await User.countDocuments({ role: "admin" });

    res.json({
      total,
      admins,
      medecins,
      pharmaciens
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
