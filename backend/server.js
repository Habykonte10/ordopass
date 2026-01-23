require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
app.enable("trust proxy");

/* =====================
   FORCE HTTPS (Render)
===================== */
app.use((req, res, next) => {
  if (
    process.env.NODE_ENV === "production" &&
    req.headers["x-forwarded-proto"] !== "https"
  ) {
    return res.redirect("https://" + req.headers.host + req.url);
  }
  next();
});

/* =====================
   CORS — STABLE & SAFE
===================== */
const allowedOrigins = [
  "https://ordopass.com",
  "https://www.ordopass.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // autorise Postman + navigateur
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// IMPORTANT : répondre aux requêtes OPTIONS (preflight)
app.options("*", cors());

app.use(express.json());

/* =====================
   API
===================== */
app.get("/api/test", (req, res) => {
  res.json({ status: "API OK" });
});

app.use("/api/auth", require("./routes/auth"));

/* =====================
   FRONTEND (RACINE)
===================== */
// 👉 servir les fichiers HTML depuis la racine ordopass
app.use(express.static(path.join(__dirname, "..")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

/* =====================
   DATABASE
===================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connecté"))
  .catch((err) => console.error("❌ MongoDB erreur:", err));

/* =====================
   START
===================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Serveur lancé sur le port", PORT);
});
