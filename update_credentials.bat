@echo off
echo ========================================
echo   MISE A JOUR DES IDENTIFIANTS ADMIN
echo ========================================
echo.
echo Modification des fichiers...

:: Créer le fichier config.js
echo // config.js - Configuration OrdoPass > config.js
echo module.exports = { >> config.js
echo     port: process.env.PORT || 3000, >> config.js
echo     nodeEnv: process.env.NODE_ENV || 'development', >> config.js
echo     mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ordopass', >> config.js
echo     adminUsername: 'Habibatou', >> config.js
echo     adminPassword: 'Haby15', >> config.js
echo     adminToken: 'ordopass_admin_secure_token', >> config.js
echo     appName: 'OrdoPass', >> config.js
echo     supportPhone: '+221 78 929 92 04' >> config.js
echo }; >> config.js

echo.
echo ✅ Fichiers mis à jour avec succès !
echo.
echo Nouveaux identifiants :
echo -----------------------
echo 👤 Username: Habibatou
echo 🔐 Password: Haby15
echo.
echo ⚠️  Redémarrez le serveur avec :
echo node server.js
echo.
pause