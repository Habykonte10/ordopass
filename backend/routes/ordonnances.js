router.post("/", async (req, res) => {
  try {
    const {
      patientNom,
      age,
      genre,
      adresse,
      medicaments,
      medecinNom,
      pharmacieId,
      pharmacieNom
    } = req.body;

    const ordonnance = new Ordonnance({
      code: "ORD" + Date.now(),
      patientNom,
      age,
      genre,
      adresse,
      medicaments,
      statut: "envoyee",
      createdAt: new Date(),

      medecin: {
        nom: medecinNom
      },

      pharmacie: {
        id: pharmacieId,
        nom: pharmacieNom
      }
    });

    await ordonnance.save();
    res.json(ordonnance);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur création ordonnance" });
  }
});
