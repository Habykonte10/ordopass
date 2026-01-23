@echo off
chcp 65001 >nul
echo.
echo ========================================
echo        🚀 ORDOPASS - PRODUCTION
echo ========================================
echo.

echo 📦 Vérification des dépendances...
if not exist "node_modules" (
    echo ❌ node_modules non trouvé, installation...
    npm install
)

echo.
echo 🌍 Configuration de l'environnement...
set NODE_ENV=production
set PORT=3000

echo.
echo 🗄️  Vérification de MongoDB...
where mongod >nul 2>nul
if errorlevel 1 (
    echo ⚠️  MongoDB non détecté, mode développement
) else (
    echo ✅ MongoDB détecté
)

echo.
echo 🚀 Démarrage du serveur...
echo 🌐 URL: http://localhost:3000
echo 👑 Admin: Habibatou
echo.

node server.js

if errorlevel 1 (
    echo.
    echo ❌ Erreur lors du démarrage
    echo.
    pause
)