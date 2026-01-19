require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/ordopass";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'Habibatou';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Haby15';

async function seedAdmin() {
  try {
    console.log('🔧 Initialisation de la base de données...');
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Connecté à MongoDB');
    
    // Créer le schéma temporairement
    const userSchema = new mongoose.Schema({
      username: String,
      password: String,
      role: String,
      email: String,
      nom: String,
      prenom: String,
      isActive: Boolean,
      createdAt: Date
    });
    
    const User = mongoose.model('User', userSchema);
    
    // Vérifier si l'admin existe déjà
    const existingAdmin = await User.findOne({ 
      username: ADMIN_USERNAME, 
      role: 'admin' 
    });
    
    if (existingAdmin) {
      console.log(`✅ Compte admin existe déjà: ${ADMIN_USERNAME}`);
      
      // Mettre à jour le mot de passe si nécessaire
      const match = await bcrypt.compare(ADMIN_PASSWORD, existingAdmin.password);
      if (!match) {
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
        existingAdmin.password = hashedPassword;
        await existingAdmin.save();
        console.log('✅ Mot de passe admin mis à jour');
      }
    } else {
      // Créer le compte admin
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
      
      const adminUser = new User({
        username: ADMIN_USERNAME,
        password: hashedPassword,
        role: 'admin',
        email: 'admin@ordopass.com',
        nom: 'Administrateur',
        prenom: 'Système',
        isActive: true,
        createdAt: new Date()
      });
      
      await adminUser.save();
      console.log('✅ Compte admin créé avec succès');
    }
    
    console.log('👤 Username:', ADMIN_USERNAME);
    console.log('🔑 Password:', ADMIN_PASSWORD);
    console.log('✅ Initialisation terminée!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    process.exit(1);
  }
}

seedAdmin();