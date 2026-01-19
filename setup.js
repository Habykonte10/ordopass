const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Schéma utilisateur
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'medecin', 'pharmacien'], required: true },
  nom: String,
  prenom: String,
  email: String,
  telephone: String,
  specialite: String,
  numeroInscription: String,
  etablissement: String,
  adresse: String,
  licenseNumber: String,
  experience: Number,
  isActive: { type: Boolean, default: true },
  online: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

async function setup() {
  try {
    console.log('🔧 Initialisation d\'OrdoPass...');
    
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ordopass');
    console.log('✅ Connecté à MongoDB');
    
    // Vérifier si l'admin existe
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (!existingAdmin) {
      console.log('👑 Création du compte administrateur...');
      
      const admin = new User({
        username: process.env.ADMIN_USERNAME || 'Habibatou',
        password: await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Haby15', 10),
        role: 'admin',
        nom: 'Administrateur',
        prenom: 'OrdoPass',
        email: 'admin@ordopass.com',
        isActive: true
      });
      
      await admin.save();
      console.log('✅ Compte admin créé avec succès');
      console.log(`   👤 Username: ${admin.username}`);
      console.log(`   🔐 Mot de passe: ${process.env.ADMIN_PASSWORD || 'Haby15'}`);
    } else {
      console.log('⚠️ Compte admin existe déjà');
      console.log(`   👤 Username: ${existingAdmin.username}`);
    }
    
    console.log('\n🎉 Initialisation terminée!');
    console.log('👉 Pour démarrer le serveur: npm start');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    process.exit(1);
  }
}

setup();