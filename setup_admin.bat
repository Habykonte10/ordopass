@echo off
echo ========================================
echo   INSTALLATION ADMIN ORDOPASS
echo ========================================
echo.

echo 1. Creation des fichiers d'administration...
copy admin_dashboard.html . > nul
copy admin_login.html . > nul
copy config.js . > nul

echo 2. Installation des dependances...
npm install express mongoose bcryptjs multer cors dotenv socket.io

echo 3. Demarrage du serveur...
echo.
echo IMPORTANT : Modifiez les identifiants admin dans config.js !
echo.
echo Identifiants par defaut :
echo - Username: admin
echo - Password: admin123
echo - Token: ordopass_admin_secure_token
echo.
echo 4. Acces au tableau de bord :
echo http://localhost:3000/admin_dashboard.html
echo.
echo Appuyez sur une touche pour continuer...
pause > nul