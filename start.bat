@echo off
echo ========================================
echo   Démarrage d'OrdoPass - Administration
echo ========================================

REM Vérifier si Node.js est installé
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js n'est pas installé!
    echo Téléchargez depuis: https://nodejs.org/
    pause
    exit /b 1
)

REM Vérifier si MongoDB est installé
where mongod >nul 2>&1
if errorlevel 1 (
    echo ⚠️ MongoDB n'est pas installé ou n'est pas dans le PATH
    echo Installation recommandée pour le mode multi-utilisateurs
    echo Téléchargez depuis: https://www.mongodb.com/try/download/community
    echo.
    echo Le serveur démarrera en mode développement (données locales seulement)
)

REM Installer les dépendances si nécessaire
if not exist "node_modules" (
    echo 📦 Installation des dépendances...
    npm install
)

REM Démarrer le serveur
echo 🚀 Démarrage du serveur OrdoPass...
echo 📁 Port: 3000
echo 👑 Administration: Activée
echo 🌐 Accès: http://localhost:3000
echo 🔐 Identifiants admin: Voir fichier .env
echo.

node server.js