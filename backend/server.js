require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

/* ===== MIDDLEWARE ===== */
app.use(cors());
app.use(express.json());

/* ===== TEST API ===== */
app.get("/api/test", (req, res) => {
  res.json({ message: "API OK" });
});

/* ===== ROUTES ===== */
app.use("/api/auth", require("./routes/auth"));
app.use("/api/pharmacies", require("./routes/pharmacies"));

/* ===== FRONTEND ===== */
const frontendPath = path.join(__dirname, "..");
app.use(express.static(frontendPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

/* ❌ PAS DE app.get("*") */

/* ===== DB ===== */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connecté"))
  .catch(err => console.error("❌ MongoDB erreur :", err));

/* ===== START ===== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Serveur lancé sur http://localhost:" + PORT);
});
