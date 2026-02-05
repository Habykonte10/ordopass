const express = require("express");
const router = express.Router();
const Pharmacy = require("../models/Pharmacy");

/* CREATE pharmacy */
router.post("/", async (req, res) => {
  console.log("📨 POST /api/pharmacies - Corps reçu:", JSON.stringify(req.body, null, 2));
  
  try {
    // Validation des champs requis
    const requiredFields = ["nom", "adresse", "telephone", "pharmacien"];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      console.log("❌ Champs manquants:", missingFields);
      return res.status(400).json({ 
        error: "Champs requis manquants", 
        missing: missingFields,
        required: requiredFields 
      });
    }
    
    // Création de la pharmacie
    const pharmacy = new Pharmacy({
      nom: req.body.nom,
      adresse: req.body.adresse,
      telephone: req.body.telephone,
      pharmacien: req.body.pharmacien,
      services: req.body.services || []
    });
    
    await pharmacy.save();
    
    console.log("✅ Pharmacie créée avec succès - ID:", pharmacy._id);
    res.status(201).json({
      success: true,
      message: "Pharmacie créée avec succès",
      data: pharmacy,
      id: pharmacy._id
    });
    
  } catch (err) {
    console.error("❌ Erreur création pharmacie:", err.message);
    
    // Erreur de validation MongoDB
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: "Erreur de validation", 
        details: err.message 
      });
    }
    
    // Erreur de duplication (si vous avez des contraintes d'unicité)
    if (err.code === 11000) {
      return res.status(400).json({ 
        error: "Doublon détecté", 
        details: "Une pharmacie avec ces informations existe déjà" 
      });
    }
    
    res.status(500).json({ 
      error: "Erreur serveur lors de la création",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });  
  }
});

/* GET all pharmacies */
router.get("/", async (req, res) => {
  console.log("📥 GET /api/pharmacies");
  
  try {
    const pharmacies = await Pharmacy.find().sort({ createdAt: -1 });
    console.log(`✅ ${pharmacies.length} pharmacies trouvées`);
    
    res.json({
      success: true,
      count: pharmacies.length,
      data: pharmacies
    });
    
  } catch (err) {
    console.error("❌ Erreur récupération pharmacies:", err.message);
    res.status(500).json({ 
      error: "Erreur serveur lors de la récupération",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

/* GET one pharmacy */
router.get("/:id", async (req, res) => {
  console.log(`📥 GET /api/pharmacies/${req.params.id}`);
  
  try {
    // Vérification du format de l'ID
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        error: "Format d'ID invalide",
        suggestion: "L'ID doit être une chaîne de 24 caractères hexadécimaux" 
      });
    }
    
    const pharmacy = await Pharmacy.findById(req.params.id);
    
    if (!pharmacy) {
      console.log(`❌ Pharmacie ${req.params.id} non trouvée`);
      return res.status(404).json({ 
        error: "Pharmacie non trouvée",
        id: req.params.id 
      });
    }
    
    console.log(`✅ Pharmacie trouvée: ${pharmacy.nom}`);
    res.json({
      success: true,
      data: pharmacy
    });
    
  } catch (err) {
    console.error("❌ Erreur récupération pharmacie:", err.message);
    res.status(500).json({ 
      error: "Erreur serveur",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

/* TEST route */
router.get("/test", (req, res) => {
  console.log("✅ Route test pharmacies appelée");
  res.json({ 
    message: "Route pharmacies fonctionnelle",
    timestamp: new Date(),
    method: "GET"
  });
});

module.exports = router;
