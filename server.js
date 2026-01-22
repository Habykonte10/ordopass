require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
app.enable('trust proxy');

// FORCER HTTPS
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
  origin: "https://ordopass.com",
  credentials: true
}));

app.use(express.json());

// ROUTES
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/consultations", require("./routes/consultations"));
app.use("/api/ordonnance", require("./routes/ordonnance"));
app.use("/api/pharmacie", require("./routes/pharmacies"));
app.use("/api", require("./routes/register")); // 👈 AJOUT

// STATIC
app.use(express.static(__dirname));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// DB
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("✅ MongoDB connecté"))
.catch(err=>console.log(err));

// START
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
  console.log("🚀 Serveur lancé sur "+PORT);
});
