// create-admin.js - Créer un compte admin
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  try {
    // Connexion MongoDB
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/ordopass";
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Connecté à MongoDB');
    
    // Définir le schéma
    const userSchema = new mongoose.Schema({
      username: String,
      password: String,
      role: String,
      nom: String,
      prenom: String,
      email: String,
      online: Boolean,
      createdAt: Date
    });
    
    const User = mongoose.model('User', userSchema);
    
    // Vérifier si l'admin existe déjà
    const existingAdmin = await User.findOne({ 
      username: process.env.ADMIN_USERNAME || 'Habibatou', 
      role: 'admin' 
    });
    
    if (existingAdmin) {
      console.log('⚠️  Compte admin existe déjà');
      console.log(`👤 Username: ${existingAdmin.username}`);
      console.log(`📧 Email: ${existingAdmin.email || 'N/A'}`);
      console.log(`📅 Créé le: ${existingAdmin.createdAt}`);
    } else {
      // Créer le compte admin
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Haby15', 10);
      
      const adminUser = new User({
        username: process.env.ADMIN_USERNAME || 'Habibatou',
        password: hashedPassword,
        role: 'admin',
        nom: 'Administrateur',
        prenom: 'Système',
        email: 'admin@ordopass.com',
        online: false,
        createdAt: new Date()
      });
      
      await adminUser.save();
      console.log('✅ Compte admin créé avec succès');
      console.log(`👤 Username: ${adminUser.username}`);
      console.log(`🔑 Password: ${process.env.ADMIN_PASSWORD || 'Haby15'}`);
      console.log(`📧 Email: ${adminUser.email}`);
      console.log('⚠️  Gardez ces informations en sécurité!');
    }
    
    // Afficher tous les admins
    const allAdmins = await User.find({ role: 'admin' });
    console.log('\n📋 Liste des administrateurs:');
    allAdmins.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.username} - ${admin.email} - Créé le: ${admin.createdAt}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur création admin:', error);
    process.exit(1);
  }
}

createAdmin();