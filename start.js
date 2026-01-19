// start.js - Script de démarrage simplifié
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Démarrage de OrdoPass...');

// Vérifier si package.json existe
if (!fs.existsSync('package.json')) {
  console.log('📦 Création package.json...');
  const packageJson = {
    name: "ordopass",
    version: "1.0.0",
    description: "Plateforme OrdoPass - Gestion des ordonnances médicales",
    main: "server.js",
    scripts: {
      "start": "node server.js",
      "dev": "nodemon server.js",
      "test": "echo \"Error: no test specified\" && exit 1"
    },
    dependencies: {
      "express": "^4.18.2",
      "mongoose": "^7.0.0",
      "bcryptjs": "^2.4.3",
      "cors": "^2.8.5",
      "dotenv": "^16.0.3",
      "socket.io": "^4.6.1"
    },
    devDependencies: {
      "nodemon": "^2.0.22"
    }
  };
  
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
  console.log('✅ package.json créé');
}

// Vérifier si .env existe
if (!fs.existsSync('.env')) {
  console.log('🔧 Création fichier .env...');
  const envContent = `# Configuration OrdoPass
ADMIN_USERNAME=Habibatou
ADMIN_PASSWORD=Haby15
ADMIN_TOKEN=ordopass_admin_token_secure_2024
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ordopass

# Options de sécurité
SESSION_SECRET=ordopass_session_secret_2024
JWT_SECRET=ordopass_jwt_secret_2024
`;
  
  fs.writeFileSync('.env', envContent);
  console.log('✅ Fichier .env créé');
}

// Installer les dépendances si besoin
console.log('📦 Installation des dépendances...');
const npmInstall = spawn('npm', ['install'], { stdio: 'inherit', shell: true });

npmInstall.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Dépendances installées avec succès');
    
    // Démarrer le serveur
    console.log('🚀 Démarrage du serveur...');
    const server = spawn('node', ['server.js'], { stdio: 'inherit', shell: true });
    
    server.on('error', (err) => {
      console.error('❌ Erreur démarrage serveur:', err);
      process.exit(1);
    });
    
  } else {
    console.error('❌ Erreur installation dépendances');
    process.exit(1);
  }
});