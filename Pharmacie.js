const mongoose = require('mongoose');

module.exports = mongoose.model("Pharmacie",{
  nom:String,
  adresse:String,
  telephone:String
});
