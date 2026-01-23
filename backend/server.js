require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
app.enable("trust proxy");

/* ======================
   HTTPS (Render)
   ====================== */
app.use((req, res, next) => {
  if (
    process.env.NODE_ENV === "production" &&
    req.headers["x-forwarded-proto"] !== "https"
  ) {
    return res.redirect("https://" + req.headers.host + req.url);
  }
  next();
});

/* ======================
   CORS
   ====================== */
app.use(
  cors({
    origin: "https://ordopass.com",
    credentials: true,
  })
);

app.use(express.json());

/* ======================
   API ROUTES (AVANT FRONT)
   ====================== */

// test global
app.get("/api/test", (req, res) => {
  res.json({ status: "API OK" });
});

// test auth
app.get("/api/auth/test", (req, res) => {
  res.json({ status: "AUTH API OK" });
});

// vraie route auth (le fichier DOIT exister)
app.use("/api/auth", require("./routes/auth"));

/* ======================
   FRONTEND (index.html)
   ====================== */

// 👉 remonte d’un niveau : backend → ordopass
const FRONT_PATH = path.join(__dirname, "..");

// fichiers statiques
app.use(express.static(FRONT_PATH));

// toutes les autres routes → index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(FRONT_PATH, "index.html"));
});

/* ======================
   DATABASE
   ====================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connecté"))
  .catch((err) => console.error("❌ MongoDB erreur :", err));

/* ======================
   START SERVER
   ====================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Serveur lancé sur le port " + PORT);
});
