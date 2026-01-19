# 🚀 OrdoPass - Plateforme Médicale

## 📋 Description
Plateforme sécurisée pour la gestion des ordonnances médicales, consultations et pharmacies.

## 🔧 Installation en Production

### Prérequis
- Serveur Ubuntu 20.04+ (2+ CPU, 4+ GB RAM)
- Node.js 18+
- MongoDB Atlas ou MongoDB local
- Nginx
- PM2

### Étapes d'installation

1. **Préparer le serveur**
```bash
# Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# Installer les dépendances
sudo apt install -y curl git build-essential