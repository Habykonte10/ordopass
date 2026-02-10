const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

router.post("/register-medecin", async (req, res) => {
  try {
    const {
      nom,
      prenom,
      email,
      username,
      password,
      dateNaissance,
      specialite,
      numeroInscription,
      etablissement
    } = req.body;

    const exist = await User.findOne({ username });
    if (exist)
      return res.status(400).json({ error: "Utilisateur déjà existant" });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      nom,
      prenom,
      email,
      username,
      password: hash,
      role: "medecin",
      dateNaissance,
      specialite,
      numeroInscription,
      etablissement
    });

    res.json({
      message: "Compte médecin créé",
      user
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
