require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

/* ===== MIDDLEWARE ===== */
app.use(cors({
  origin: "*",
  methods: ["GET","POST","PUT","DELETE"],
  allowedHeaders: ["Content-Type","Authorization"]
}));

app.use(express.json());

/* ===== API ===== */
app.get("/api/test", (req, res) => {
  res.json({ status: "API OK" });
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/pharmacies", require("./routes/pharmacies"));
app.use("/api/ordonnances", require("./routes/ordonnances"));

/* ===== FRONTEND RENDER FIX ===== */
const frontendPath = path.join(__dirname, "..");

/* servir fichiers statiques immédiatement */
app.use(express.static(frontendPath, {
  index: "index.html"
}));

/* fallback pour SPA ou routes directes */
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

/* ===== DATABASE ===== */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connecté"))
  .catch(err => console.error("❌ MongoDB erreur:", err));

/* ===== START ===== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Serveur lancé sur https://ordopass.onrender.com");
});
