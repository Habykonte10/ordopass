const express = require("express");
const router = express.Router();

/* ===== TEST ===== */
router.get("/test", (req, res) => {
  res.json({ status: "AUTH API OK" });
});

/* ===== LOGIN ===== */
router.post("/login", (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({
      success: false,
      message: "Champs manquants",
    });
  }

  // ⚠️ TEMPORAIRE (sans base de données)
  return res.json({
    success: true,
    message: "Connexion réussie",
    user: {
      email,
      role,
    },
  });
});

module.exports = router;
