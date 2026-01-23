// scripts/backup.js
const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

async function backup() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ordopass");
    
    const Consultation = require('../models/Consultation');
    const Ordonnance = require('../models/Ordonnance');
    const Facture = require('../models/Facture');
    const Patient = require('../models/Patient');
    const User = require('../models/User');

    const backupData = {
      consultations: await Consultation.find(),
      ordonnances: await Ordonnance.find(),
      factures: await Facture.find(),
      patients: await Patient.find(),
      users: await User.find().select('-password'),
      backupDate: new Date(),
      version: '1.0.0'
    };

    if (!fs.existsSync('backups')) {
      fs.mkdirSync('backups');
    }

    const filename = `backups/backup-${new Date().toISOString().replace(/:/g, '-')}.json`;
    fs.writeFileSync(filename, JSON.stringify(backupData, null, 2));
    
    console.log(`✅ Backup créé: ${filename}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur backup:', error);
    process.exit(1);
  }
}

backup();