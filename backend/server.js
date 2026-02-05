require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

/* ===== MIDDLEWARE ===== */
app.use(cors());
app.use(express.json());

// Middleware de logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

/* ===== TEST API ===== */
app.get("/api/test", (req, res) => {
  console.log("✅ Test API route appelée");
  res.json({ 
    message: "API OK", 
    env: process.env.NODE_ENV,
    timestamp: new Date() 
  });
});

/* ===== ROUTES ===== */
// Testez d'abord si les routes sont accessibles
app.get("/api/pharmacies/test", (req, res) => {
  console.log("✅ Route pharmacies test");
  res.json({ message: "Route pharmacies accessible" });
});

// Import des routes
try {
  app.use("/api/auth", require("./routes/auth"));
  console.log("✅ Route /api/auth chargée");
} catch (error) {
  console.error("❌ Erreur chargement route /api/auth:", error.message);
}

try {
  app.use("/api/pharmacies", require("./routes/pharmacies"));
  console.log("✅ Route /api/pharmacies chargée");
} catch (error) {
  console.error("❌ Erreur chargement route /api/pharmacies:", error.message);
}

/* ===== FRONTEND ===== */
const frontendPath = path.join(__dirname, "..", "frontend");
if (require("fs").existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
  app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
  console.log("✅ Frontend configuré");
} else {
  console.log("⚠️  Frontend non trouvé, mode API seulement");
}

/* ===== ERROR HANDLING ===== */
// Route API 404
app.use("/api/*", (req, res) => {
  console.log(`❌ Route API non trouvée: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: "Route API non trouvée",
    path: req.originalUrl,
    method: req.method,
    availableRoutes: ["GET /api/test", "POST /api/pharmacies", "GET /api/pharmacies"]
  });
});

// Route générale 404 (uniquement pour les routes non-API)
app.use("*", (req, res) => {
  console.log(`❌ Route non trouvée: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: "Route non trouvée",
    suggestion: "Utilisez les routes API: /api/*"
  });
});

/* ===== DB CONNECTION ===== */
console.log("🔄 Tentative de connexion à MongoDB...");
console.log("📝 URI MongoDB:", process.env.MONGO_URI ? "✓ Définie" : "✗ Non définie");

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log("✅ MongoDB connecté avec succès");
  console.log("📁 Base de données:", mongoose.connection.db?.databaseName || "ordopass");
})
.catch(err => {
  console.error("❌ ERREUR MongoDB:", err.message);
  console.log("🔧 Solution: Vérifiez votre MONGO_URI dans .env");
  console.log("💡 Exemple correct: mongodb+srv://user:password@cluster.mongodb.net/dbname");
  process.exit(1); // Arrête le serveur si MongoDB n'est pas connecté
});

/* ===== START SERVER ===== */
const PORT = process.env.PORT || 3000;

// Vérification des variables d'environnement
console.log("\n📋 CONFIGURATION:");
console.log("   NODE_ENV:", process.env.NODE_ENV || "non défini");
console.log("   PORT:", PORT);
console.log("   JWT_SECRET:", process.env.JWT_SECRET ? "✓ Définie" : "✗ Non définie");

app.listen(PORT, () => {
  console.log(`\n🚀 Serveur démarré avec succès!`);
  console.log(`   Local: http://localhost:${PORT}`);
  console.log(`   Test API: http://localhost:${PORT}/api/test`);
  console.log(`\n📡 Routes API disponibles:`);
  console.log(`   GET  http://localhost:${PORT}/api/test`);
  console.log(`   POST http://localhost:${PORT}/api/pharmacies`);
  console.log(`   GET  http://localhost:${PORT}/api/pharmacies`);
  console.log(`   GET  http://localhost:${Port}/api/pharmacies/test`);
  console.log(`\n⚡ Mode: ${process.env.NODE_ENV || 'development'}`);
});
