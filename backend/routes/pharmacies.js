const express = require("express");
const router = express.Router();
const Pharmacy = require("../models/Pharmacy");

/* ✅ CREATE PHARMACY (POSTMAN) */
router.post("/", async (req, res) => {
  try {
    const pharmacy = new Pharmacy(req.body);
    await pharmacy.save();
    res.status(201).json(pharmacy);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ✅ GET ALL PHARMACIES (médecin) */
router.get("/", async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find().sort({ createdAt: -1 });
    res.json(pharmacies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ✅ UPDATE ONLINE / OFFLINE */
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
