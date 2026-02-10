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

/* ===== ROUTES API ===== */
app.use("/api/auth", require("./routes/auth"));
app.use("/api/ordonnances", require("./routes/ordonnances"));

/* ===== FRONTEND ===== */
const frontendPath = path.join(__dirname, "..");
app.use(express.static(frontendPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

/* ===== DATABASE ===== */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connecté"))
  .catch(err => console.error("❌ MongoDB erreur:", err));

/* ===== START SERVER ===== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Serveur lancé sur http://localhost:" + PORT);
});
