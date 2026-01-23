require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
app.enable("trust proxy");

/* =========================
   FORCER HTTPS (Render)
   ========================= */
app.use((req, res, next) => {
  if (
    process.env.NODE_ENV === "production" &&
    req.headers["x-forwarded-proto"] !== "https"
  ) {
    return res.redirect("https://" + req.headers.host + req.url);
  }
  next();
});

/* =========================
   CORS
   ========================= */
app.use(
  cors({
    origin: [
      "https://ordopass.com",
      "https://ordopass.onrender.com",
    ],
    credentials: true,
  })
);

app.use(express.json());

/* =========================
   ROUTES API (AVANT LE FRONT)
   ========================= */

// ✅ test API
app.get("/api/test", (req, res) => {
  res.json({ status: "API OK" });
});

// ⚠️ activer SEULEMENT si le fichier existe sur GitHub
app.use("/api/auth", require("./routes/auth"));

/*
app.use("/api/admin", require("./routes/admin"));
app.use("/api/consultations", require("./routes/consultations"));
app.use("/api/ordonnance", require("./routes/ordonnance"));
app.use("/api/pharmacie", require("./routes/pharmacies"));
app.use("/api", require("./routes/register"));
*/

/* =========================
   FRONTEND
   ========================= */
app.use(express.static(__dirname));

// ❗ NE BLOQUE PAS /api
app.get("*", (req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(404).json({ error: "API route not found" });
  }

  res.sendFile(path.join(__dirname, "index.html"));
});

/* =========================
   DATABASE
   ========================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connecté"))
  .catch((err) => console.log("❌ MongoDB error:", err));

/* =========================
   START SERVER
   ========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Serveur lancé sur " + PORT);
});