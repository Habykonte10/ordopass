#!/bin/bash

echo "🚀 Démarrage d'OrdoPass..."

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js v14 ou supérieur."
    exit 1
fi

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé. Veuillez installer npm."
    exit 1
fi

# Vérifier la version de Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 14 ]; then
    echo "❌ Node.js version $NODE_VERSION n'est pas supportée. Version minimale: v14"
    exit 1
fi

echo "✅ Node.js v$(node -v) détecté"

# Vérifier si le fichier .env existe
if [ ! -f ".env" ]; then
    echo "⚠️  Fichier .env non trouvé, création à partir de .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ Fichier .env créé. Veuillez configurer les variables d'environnement."
    else
        echo "❌ Fichier .env.example non trouvé."
        exit 1
    fi
fi

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Échec de l'installation des dépendances."
        exit 1
    fi
    echo "✅ Dépendances installées."
fi

# Vérifier si MongoDB est disponible (optionnel)
if command -v mongod &> /dev/null; then
    echo "🗄️  MongoDB détecté"
else
    echo "⚠️  MongoDB n'est pas installé. Le mode développement sera activé."
fi

# Démarrer le serveur
echo "🌍 Démarrage du serveur OrdoPass..."
echo "📂 Répertoire: $(pwd)"
echo "🔧 Mode: ${NODE_ENV:-development}"
echo "🚪 Port: ${PORT:-3000}"
echo "👑 Admin: ${ADMIN_USERNAME:-Habibatou}"

# Démarrer avec nodemon en développement, node en production
if [ "$NODE_ENV" = "production" ]; then
    echo "⚡ Mode production"
    node server.js
else
    echo "🔧 Mode développement"
    npx nodemon server.js
fi