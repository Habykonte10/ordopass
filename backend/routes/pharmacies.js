const express = require("express");
const router = express.Router();
const Pharmacy = require("../models/Pharmacy");

/* ======================================
   ✅ CREATE PHARMACY (POSTMAN / ADMIN)
====================================== */
router.post("/", async (req, res) => {
  try {
    const pharmacy = new Pharmacy(req.body);
    await pharmacy.save();
    res.status(201).json(pharmacy);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ======================================
   ✅ LOGIN PHARMACIE
   username = email
====================================== */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Email et mot de passe requis"
      });
    }

    // username = email
    const pharmacy = await Pharmacy.findOne({ email: username });

    if (!pharmacy) {
      return res.status(404).json({
        message: "Pharmacie introuvable"
      });
    }

    if (pharmacy.password !== password) {
      return res.status(401).json({
        message: "Mot de passe incorrect"
      });
    }

    res.json({
      message: "✅ Connexion pharmacie réussie",
      user: {
        id: pharmacy._id,
        nom: pharmacy.nom,
        email: pharmacy.email,
        role: "pharmacie"
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ======================================
   ✅ GET ALL PHARMACIES (médecin)
====================================== */
router.get("/", async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find().sort({ createdAt: -1 });
    res.json(pharmacies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ======================================
   ✅ UPDATE ONLINE / OFFLINE
====================================== */
router.put("/:id/status", async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findByIdAndUpdate(
      req.params.id,
      { online: req.body.online },
      { new: true }
    );
    res.json(pharmacy);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
