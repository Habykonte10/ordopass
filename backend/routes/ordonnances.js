const express = require("express");
const router = express.Router();
const Ordonnance = require("../models/Ordonnance");

/* ===== CREATE ORDONNANCE ===== */
router.post("/", async (req, res) => {
  try {
    const ordonnance = new Ordonnance({
      code: "ORD-" + Date.now(),

      medecin: {
        id: req.body.medecinId,
        nom: req.body.medecinNom
      },

      pharmacie: {
        id: req.body.pharmacieId,
        nom: req.body.pharmacieNom
      },

      patientNom: req.body.patientNom,
      medicaments: req.body.medicaments
    });

    await ordonnance.save();
    res.json({ message: "✅ Ordonnance envoyée" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===== ORDONNANCES D’UNE PHARMACIE ===== */
router.get("/pharmacie/:id", async (req, res) => {
  try {
    const ordonnances = await Ordonnance.find({
      "pharmacie.id": req.params.id
    }).sort({ createdAt: -1 });

    res.json(ordonnances);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===== UPDATE STATUT ===== */
router.put("/:id/status", async (req, res) => {
  try {
    await Ordonnance.findByIdAndUpdate(req.params.id, {
      statut: req.body.statut
    });

    res.json({ message: "Statut mis à jour" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
