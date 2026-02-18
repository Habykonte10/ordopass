const express = require("express");
const router = express.Router();
const Ordonnance = require("../models/Ordonnance");

/* =========================
   CREATE ORDONNANCE
========================= */
router.post("/", async (req, res) => {
  try {
    const {
      patientNom,
      age,
      genre,
      adresse,
      medicaments,
      medecinNom,
      pharmacieId,
      pharmacieNom
    } = req.body;

    const ordonnance = new Ordonnance({
      code: "ORD" + Date.now(),
      patientNom,
      age,
      genre,
      adresse,
      medicaments,
      statut: "envoyee",
      createdAt: new Date(),

      medecin: {
        nom: medecinNom
      },

      pharmacie: {
        id: pharmacieId,
        nom: pharmacieNom
      }
    });

    await ordonnance.save();
    res.json(ordonnance);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur création ordonnance" });
  }
});

/* =========================
   ORDONNANCES PHARMACIE
========================= */
router.get("/pharmacie/:id", async (req, res) => {
  try {
    const ordonnances = await Ordonnance.find({
      "pharmacie.id": req.params.id
    }).sort({ createdAt: -1 });

    res.json(ordonnances);
  } catch (err) {
    res.status(500).json({ error: "Erreur récupération" });
  }
});

/* =========================
   UPDATE STATUT
========================= */
router.put("/:id/status", async (req, res) => {
  try {
    await Ordonnance.findByIdAndUpdate(req.params.id, {
      statut: req.body.statut
    });
    res.json({ message: "Statut mis à jour" });
  } catch (err) {
    res.status(500).json({ error: "Erreur update" });
  }
});

module.exports = router;
