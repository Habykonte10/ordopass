const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Schémas
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
    
    // Supprimer la base de données existante (optionnel - pour réinitialisation)
    if (process.argv.includes('--reset')) {
      await mongoose.connection.dropDatabase();
      console.log('🗑️ Base de données réinitialisée');
    }
    
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
    
    // Créer des données de test (optionnel)
    if (process.argv.includes('--test-data')) {
      console.log('🧪 Création des données de test...');
      
      // Créer un médecin test
      const medecin = new User({
        username: 'dr.test',
        password: await bcrypt.hash('test123', 10),
        role: 'medecin',
        nom: 'Test',
        prenom: 'Docteur',
        email: 'dr.test@ordopass.com',
        specialite: 'Généraliste',
        numeroInscription: 'MED123456',
        etablissement: 'CHU Test',
        telephone: '+221 70 123 45 67',
        isActive: true
      });
      await medecin.save();
      console.log('✅ Médecin test créé: dr.test / test123');
      
      // Créer un pharmacien test
      const pharmacien = new User({
        username: 'pharma.test',
        password: await bcrypt.hash('test123', 10),
        role: 'pharmacien',
        nom: 'Pharmacie Test',
        email: 'pharma.test@ordopass.com',
        telephone: '+221 70 987 65 43',
        adresse: '123 Rue Test, Dakar',
        licenseNumber: 'PHARM123456',
        experience: 5,
        isActive: true
      });
      await pharmacien.save();
      console.log('✅ Pharmacien test créé: pharma.test / test123');
    }
    
    console.log('\n🎉 Initialisation terminée avec succès!');
    console.log('👉 Pour démarrer le serveur: npm start');
    console.log('👉 Pour le mode développement: npm run dev\n');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    process.exit(1);
  }
}

// Exécuter le setup
setup();