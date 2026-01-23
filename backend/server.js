require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
app.enable("trust proxy");

// HTTPS (Render)
app.use((req, res, next) => {
  if (
    process.env.NODE_ENV === "production" &&
    req.headers["x-forwarded-proto"] !== "https"
  ) {
    return res.redirect("https://" + req.headers.host + req.url);
  }
  next();
});

// CORS
app.use(cors({
  origin: "*"
}));

app.use(express.json());

/* ========= API ========= */
app.get("/api/test", (req, res) => {
  res.json({ status: "API OK" });
});

app.use("/api/auth", require("./routes/auth"));

/* ========= FRONT ========= */
app.use(express.static(path.join(__dirname, "..")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

/* ========= DB ========= */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connecté"))
  .catch(err => console.log(err));

/* ========= START ========= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Serveur lancé sur " + PORT);
});
