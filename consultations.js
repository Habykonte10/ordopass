const express = require("express");
const router = express.Router();

const Consultation = require("../models/Consultation");
const auth = require("../middleware/auth");
const role = require("../middleware/roles");

/*
================================
➕ CRÉER CONSULTATION
Accès : médecin
================================
*/
router.post(
  "/",
  auth,
  role("medecin"),
  async (req, res) => {
    try {
      const consultation = await Consultation.create({
        ...req.body,
        medecinId: req.user.id
      });

      res.status(201).json(consultation);
    } catch (err) {
      res.status(500).json({
        error: "Erreur création consultation",
        details: err.message
      });
    }
  }
);

/*
================================
📄 LISTE CONSULTATIONS
admin → toutes
médecin → les siennes
================================
*/
router.get(
  "/",
  auth,
  role("admin", "medecin"),
  async (req, res) => {
    try {
      let consultations;

      if (req.user.role === "admin") {
        consultations = await Consultation.find()
          .sort({ createdAt: -1 });
      } else {
        consultations = await Consultation.find({
          medecinId: req.user.id
        }).sort({ createdAt: -1 });
      }

      res.json(consultations);
    } catch (err) {
      res.status(500).json({
        error: "Erreur récupération",
        details: err.message
      });
    }
  }
);

/*
================================
🔍 DÉTAIL CONSULTATION
================================
*/
router.get(
  "/:id",
  auth,
  role("admin", "medecin"),
  async (req, res) => {
    try {
      const consultation = await Consultation.findById(
        req.params.id
      );

      if (!consultation) {
        return res.status(404).json({
          error: "Consultation introuvable"
        });
      }

      if (
        req.user.role === "medecin" &&
        consultation.medecinId.toString()
          !== req.user.id
      ) {
        return res.status(403).json({
          error: "Accès interdit"
        });
      }

      res.json(consultation);

    } catch (err) {
      res.status(500).json({
        error: "Erreur serveur",
        details: err.message
      });
    }
  }
);

/*
================================
🗑️ SUPPRIMER
Accès : admin
================================
*/
router.delete(
  "/:id",
  auth,
  role("admin"),
  async (req, res) => {
    try {
      await Consultation.findByIdAndDelete(
        req.params.id
      );
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({
        error: "Erreur suppression",
        details: err.message
      });
    }
  }
);

module.exports = router;
