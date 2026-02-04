const express = require("express");
const router = express.Router();
const Pharmacy = require("../models/Pharmacy");

/* CREATE pharmacy (Postman) */
router.post("/", async (req, res) => {
  try {
    const pharmacy = new Pharmacy(req.body);
    await pharmacy.save();
    res.status(201).json(pharmacy);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* GET all pharmacies */
router.get("/", async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find();
    res.json(pharmacies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GET one pharmacy */
router.get("/:id", async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id);
    res.json(pharmacy);
  } catch (err) {
    res.status(404).json({ error: "Pharmacie non trouvée" });
  }
});

module.exports = router;
