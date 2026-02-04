require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

/* ===============================
   MIDDLEWARES
================================ */
app.use(cors({
  origin: "*",
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
}));
app.use(express.json());

/* ===============================
   API ROUTES
================================ */
app.get("/api/test", (req, res) => {
  res.json({ status: "API OK" });
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/pharmacies", require("./routes/pharmacies"));

/* ===============================
   FRONTEND STATIC FILES
================================ */
// ordopass/
app.use(express.static(path.join(__dirname, "..")));

/* page principale */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

/* catch-all pages HTML */
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", req.path));
});

/* ===============================
   DATABASE
================================ */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connecté"))
  .catch(err => console.error("❌ MongoDB erreur :", err));

/* ===============================
   SERVER START
================================ */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Serveur lancé sur http://localhost:" + PORT);
});
