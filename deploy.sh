#!/bin/bash

echo "========================================="
echo "🚀 DÉPLOIEMENT ORDOPASS - PRODUCTION"
echo "========================================="

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les erreurs
error_exit() {
    echo -e "${RED}❌ ERREUR: $1${NC}" >&2
    exit 1
}

# Vérifier si on est en root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${YELLOW}⚠️  Exécution sans droits root. Certaines opérations peuvent échouer.${NC}"
fi

# 1. Mettre à jour le système
echo -e "\n${GREEN}1. Mise à jour du système...${NC}"
apt-get update && apt-get upgrade -y || echo -e "${YELLOW}⚠️  Mise à jour système ignorée${NC}"

# 2. Installer Node.js si nécessaire
if ! command -v node &> /dev/null; then
    echo -e "\n${GREEN}2. Installation de Node.js 18...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
fi

# 3. Installer PM2 si nécessaire
if ! command -v pm2 &> /dev/null; then
    echo -e "\n${GREEN}3. Installation de PM2...${NC}"
    npm install -g pm2
fi

# 4. Installer Nginx si nécessaire
if ! command -v nginx &> /dev/null; then
    echo -e "\n${GREEN}4. Installation de Nginx...${NC}"
    apt-get install -y nginx
fi

# 5. Installer MongoDB si nécessaire (optionnel pour MongoDB Atlas)
if ! command -v mongod &> /dev/null; then
    echo -e "\n${YELLOW}5. MongoDB n'est pas installé.${NC}"
    echo -e "📝 Pour utiliser MongoDB Atlas, ignorez cette étape."
    echo -e "📝 Pour installer MongoDB localement:"
    echo -e "   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -"
    echo -e "   echo 'deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse' | tee /etc/apt/sources.list.d/mongodb-org-6.0.list"
    echo -e "   apt-get update && apt-get install -y mongodb-org"
fi

# 6. Créer le dossier de l'application
echo -e "\n${GREEN}6. Configuration du dossier d'application...${NC}"
APP_DIR="/var/www/ordopass"
mkdir -p $APP_DIR || error_exit "Impossible de créer le dossier $APP_DIR"

# 7. Copier les fichiers (remplacer cette étape par git clone ou upload)
echo -e "\n${GREEN}7. Copie des fichiers...${NC}"
# Si vous utilisez git:
# cd /tmp && git clone https://github.com/votre-repo/ordopass.git
# cp -r /tmp/ordopass/* $APP_DIR/

# Pour une installation manuelle, copiez vos fichiers dans $APP_DIR
echo -e "📝 Veuillez copier vos fichiers dans: $APP_DIR"
echo -e "📝 Exemple: scp -r ./ordopass/* root@votre-serveur:$APP_DIR/"

# 8. Installer les dépendances
echo -e "\n${GREEN}8. Installation des dépendances Node.js...${NC}"
cd $APP_DIR
npm install --production || error_exit "Échec de l'installation des dépendances"

# 9. Configurer le fichier .env
echo -e "\n${GREEN}9. Configuration de l'environnement...${NC}"
if [ ! -f "$APP_DIR/.env" ]; then
    cat > "$APP_DIR/.env" << EOF
# ============================================
# ADMINISTRATION - PRODUCTION
# ============================================
ADMIN_USERNAME=Habibatou
ADMIN_PASSWORD=Haby15
ADMIN_TOKEN=ordopass_admin_habibatou_token

# ============================================
# SERVEUR
# ============================================
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://ordopass.com

# ============================================
# BASE DE DONNÉES
# ============================================
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/ordopass?retryWrites=true&w=majority

# ============================================
# SÉCURITÉ
# ============================================
JWT_SECRET=$(openssl rand -base64 32)
SESSION_SECRET=$(openssl rand -base64 32)

# ============================================
# APPLICATION
# ============================================
APP_NAME=OrdoPass
APP_VERSION=2.0.0
DEFAULT_LANGUAGE=fr
TIMEZONE=Africa/Dakar
EOF
    echo -e "✅ Fichier .env créé. ${YELLOW}Pensez à modifier les valeurs!${NC}"
else
    echo -e "📝 Fichier .env existant conservé"
fi

# 10. Configurer Nginx
echo -e "\n${GREEN}10. Configuration de Nginx...${NC}"
NGINX_CONF="/etc/nginx/sites-available/ordopass"
cat > $NGINX_CONF << EOF
server {
    listen 80;
    server_name ordopass.com www.ordopass.com;
    
    # Redirection vers HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ordopass.com www.ordopass.com;
    
    # SSL certificates (à générer avec certbot)
    ssl_certificate /etc/letsencrypt/live/ordopass.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ordopass.com/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
    }
    
    # Static files cache
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API caching
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_cache api_cache;
        proxy_cache_valid 200 1m;
        proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
        add_header X-Cache-Status \$upstream_cache_status;
    }
}
EOF

# Activer le site Nginx
ln -sf $NGINX_CONF /etc/nginx/sites-enabled/ || true
nginx -t && systemctl reload nginx || echo -e "${YELLOW}⚠️  Nginx configuration test failed${NC}"

# 11. Configurer le firewall
echo -e "\n${GREEN}11. Configuration du firewall...${NC}"
if command -v ufw &> /dev/null; then
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw --force enable
    echo -e "✅ Firewall configuré"
fi

# 12. Démarrer l'application avec PM2
echo -e "\n${GREEN}12. Démarrage de l'application...${NC}"
cd $APP_DIR
pm2 delete ordopass 2>/dev/null || true
pm2 start server.js --name ordopass --time || error_exit "Échec du démarrage de PM2"

# 13. Configurer le démarrage automatique
pm2 startup
pm2 save

# 14. Installer SSL avec Let's Encrypt
echo -e "\n${GREEN}14. Configuration SSL (Let's Encrypt)...${NC}"
read -p "Voulez-vous configurer SSL avec Let's Encrypt? (y/n): " ssl_choice
if [[ $ssl_choice == "y" || $ssl_choice == "Y" ]]; then
    apt-get install -y certbot python3-certbot-nginx
    certbot --nginx -d ordopass.com -d www.ordopass.com --non-interactive --agree-tos --email admin@ordopass.com
    echo "0 3 * * * certbot renew --quiet" | crontab -
fi

# 15. Créer un script de backup
echo -e "\n${GREEN}15. Création du script de backup...${NC}"
BACKUP_SCRIPT="/usr/local/bin/backup-ordopass.sh"
cat > $BACKUP_SCRIPT << 'EOF'
#!/bin/bash
BACKUP_DIR="/backup/ordopass"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Backup MongoDB
if command -v mongodump &> /dev/null; then
    mongodump --out $BACKUP_DIR/mongodb_$DATE
fi

# Backup application files
tar -czf $BACKUP_DIR/app_$DATE.tar.gz /var/www/ordopass --exclude=node_modules --exclude=uploads

# Backup PM2 configuration
pm2 save
cp ~/.pm2/dump.pm2 $BACKUP_DIR/pm2_$DATE.pm2

# Clean old backups (keep last 7 days)
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR"
EOF

chmod +x $BACKUP_SCRIPT

# 16. Résumé
echo -e "\n${GREEN}=========================================${NC}"
echo -e "${GREEN}✅ DÉPLOIEMENT TERMINÉ AVEC SUCCÈS!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo -e "\n${YELLOW}📋 RÉCAPITULATIF:${NC}"
echo -e "🌐 Application: http://localhost:3000"
echo -e "📁 Dossier: $APP_DIR"
echo -e "🔧 PM2 Status: pm2 status ordopass"
echo -e "📊 Logs: pm2 logs ordopass"
echo -e "🔄 Redémarrage: pm2 restart ordopass"
echo -e "💾 Backup: $BACKUP_SCRIPT"
echo -e "\n${YELLOW}🔐 INFORMATIONS DE CONNEXION ADMIN:${NC}"
echo -e "👤 Utilisateur: Habibatou"
echo -e "🔑 Mot de passe: Haby15"
echo -e "🔑 Token: ordopass_admin_habibatou_token"
echo -e "\n${YELLOW}📞 SUPPORT: +221 78 929 92 04${NC}"
echo -e "${GREEN}=========================================${NC}"