const mongoose = require("mongoose");

const PrescriptionSchema = new mongoose.Schema({
  pharmacyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pharmacy"
  },
  ordonnance: Object,
  fromMedecin: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Prescription", PrescriptionSchema);
