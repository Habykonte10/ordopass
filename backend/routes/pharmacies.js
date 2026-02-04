const express = require("express");
const router = express.Router();

const Pharmacy = require("../models/Pharmacy");
const Prescription = require("../models/Prescription");

/* ===============================
   CRÉER PHARMACIE (POSTMAN)
================================ */
router.post("/", async (req, res) => {
  try {
    const pharmacy = new Pharmacy(req.body);
    await pharmacy.save();
    res.json(pharmacy);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===============================
   LISTE PHARMACIES (MÉDECIN)
================================ */
router.get("/", async (req, res) => {
  const pharmacies = await Pharmacy.find().sort({ createdAt: -1 });
  res.json(pharmacies);
});

/* ===============================
   ENVOYER ORDONNANCE
================================ */
router.post("/send-prescription", async (req, res) => {
  const { pharmacyId, ordonnance, fromMedecin } = req.body;

  const p = new Prescription({
    pharmacyId,
    ordonnance,
    fromMedecin
  });

  await p.save();
  res.json({ success: true });
});

/* ===============================
   PHARMACIE → VOIR ORDONNANCES
================================ */
router.get("/:id/prescriptions", async (req, res) => {
  const list = await Prescription.find({
    pharmacyId: req.params.id
  }).sort({ createdAt: -1 });

  res.json(list);
});

module.exports = router;
