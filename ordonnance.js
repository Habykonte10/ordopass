// routes/ordonnance.js
const router = require("express").Router();
const multer = require("multer");
const Ordonnance = require("../models/Ordonnance");
const auth = require("../middleware/auth");

// UPLOAD CONFIG
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  }
});
const upload = multer({ storage });

// AJOUT ORDONNANCE (protection auth)
router.post("/", auth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Fichier manquant" });

    const ord = await Ordonnance.create({
      patient: req.body.patient,
      fichier: req.file.filename,
      medecin: req.user.id
    });

    res.json(ord);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LISTE (protégé)
router.get("/", auth, async (req, res) => {
  try {
    const data = await Ordonnance.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  try {
    await Ordonnance.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
