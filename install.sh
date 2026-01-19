#!/bin/bash

echo "📦 Installation d'OrdoPass..."
echo "================================"

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

# Copier le fichier .env.example si .env n'existe pas
if [ ! -f .env ]; then
    echo "⚙️  Création du fichier .env..."
    cat > .env << EOL
# ============================================
# ADMINISTRATION
# ============================================
ADMIN_USERNAME=Habibatou
ADMIN_PASSWORD=Haby15
ADMIN_TOKEN=ordopass_admin_habibatou_token

# ============================================
# SERVEUR
# ============================================
PORT=3000
NODE_ENV=development

# ============================================
# BASE DE DONNÉES
# ============================================
MONGODB_URI=mongodb://localhost:27017/ordopass

# ============================================
# SÉCURITÉ
# ============================================
JWT_SECRET=ordopass_secret_key_2024_secure_random_chars_here
SESSION_SECRET=session_secret_2024_secure_random_chars_here

# ============================================
# APPLICATION
# ============================================
APP_NAME=OrdoPass
APP_VERSION=2.0.0
DEFAULT_LANGUAGE=fr
TIMEZONE=Africa/Dakar
EOL
    echo "✅ Fichier .env créé avec les configurations par défaut"
fi

# Créer le dossier uploads si nécessaire
if [ ! -d "uploads" ]; then
    echo "📁 Création du dossier uploads..."
    mkdir -p uploads
fi

# Vérifier si MongoDB est installé
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB n'est pas installé."
    echo "Pour installer MongoDB:"
    echo "  Ubuntu: sudo apt install mongodb"
    echo "  macOS: brew install mongodb-community"
    echo "  Windows: Téléchargez depuis https://www.mongodb.com/try/download/community"
else
    echo "✅ MongoDB détecté"
fi

echo ""
echo "✅ Installation terminée !"
echo ""
echo "Pour démarrer le serveur:"
echo "   npm start      # Production"
echo "   npm run dev    # Développement (recharge automatique)"
echo ""
echo "Accès: http://localhost:3000"
echo "Admin: http://localhost:3000/admin_login.html"
echo "Identifiants admin: Habibatou / Haby15"
echo ""
echo "Pour tester la création de compte:"
echo "  - Connectez-vous en tant qu'admin"
echo "  - Allez dans 'Créer un compte'"
echo "  - Remplissez le formulaire"
echo "  - Cliquez sur 'Créer le compte'"