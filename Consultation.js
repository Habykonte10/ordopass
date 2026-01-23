const mongoose = require('mongoose');

module.exports = mongoose.model("Consultation",{
  ticket:String,
  patientName:String,
  motif:String,
  statut:String,
  date:String,
  heure:String,
  medecin:String
});
