require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

/* ===== MIDDLEWARE ===== */
app.use(cors());
app.use(express.json());

/* ===== API TEST ===== */
app.get("/api/test", (req, res) => {
  res.json({ status: "API OK" });
});

/* ===== ROUTES API ===== */
app.use("/api/auth", require("./routes/auth"));
app.use("/api/pharmacies", require("./routes/pharmacies"));

/* ===== FRONTEND STATIC ===== */
// ton frontend est dans le dossier racine "ordopass"
const frontendPath = path.join(__dirname, "..");
app.use(express.static(frontendPath));

/* Page d'accueil */
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

/* ⚠️ PAS DE app.get("*") */

/* ===== DB ===== */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connecté"))
  .catch(err => console.error("❌ MongoDB erreur :", err));

/* ===== START ===== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Serveur lancé sur http://localhost:" + PORT);
});
