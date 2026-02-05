const express = require("express");
const router = express.Router();
const Pharmacy = require("../models/Pharmacy");

/* TEST */
router.get("/test", (req, res) => {
  res.json({ message: "pharmacies route OK" });
});

/* CREATE */
router.post("/", async (req, res) => {
  try {
    const pharmacy = await Pharmacy.create(req.body);
    res.status(201).json(pharmacy);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* GET ALL */
router.get("/", async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find();
    res.json(pharmacies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;