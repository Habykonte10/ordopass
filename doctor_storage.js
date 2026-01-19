// doctor_storage.js - Version simplifiée

class UserManager {
  static STORAGE_KEY = 'ordoPass_users';
  static CURRENT_USER_KEY = 'currentUser';
  
  static init() {
    console.log('🔧 Initialisation de UserManager...');
    
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
      console.log('✅ Stockage des utilisateurs initialisé');
    }
  }
  
  static getAllUsers() {
    try {
      const users = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
      return Array.isArray(users) ? users : [];
    } catch (error) {
      console.error('❌ Erreur lecture utilisateurs:', error);
      return [];
    }
  }
  
  static userExists(username, email, numeroInscription) {
    const users = this.getAllUsers();
    return users.find(user => 
      user.username === username || 
      user.email === email ||
      user.numeroInscription === numeroInscription
    );
  }
  
  static createUser(userData) {
    const users = this.getAllUsers();
    
    // Vérifier les doublons
    const existingUser = this.userExists(userData.username, userData.email, userData.numeroInscription);
    if (existingUser) {
      let errorMessage = '';
      if (existingUser.username === userData.username) {
        errorMessage = 'Nom d\'utilisateur déjà pris';
      } else if (existingUser.email === userData.email) {
        errorMessage = 'Adresse email déjà utilisée';
      } else if (existingUser.numeroInscription === userData.numeroInscription) {
        errorMessage = 'Ce numéro d\'inscription est déjà utilisé';
      }
      return { success: false, error: errorMessage };
    }
    
    // Générer un ID unique
    userData.id = 'medecin_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    userData.role = 'medecin';
    userData.createdAt = new Date().toISOString();
    userData.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.prenom + ' ' + userData.nom)}&background=2a5298&color=fff&size=128`;
    
    // Ajouter l'utilisateur
    users.push(userData);
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
      console.log('✅ Utilisateur créé:', userData.username);
      return { success: true, user: userData };
    } catch (error) {
      console.error('❌ Erreur création utilisateur:', error);
      return { success: false, error: 'Erreur création compte' };
    }
  }
  
  static authenticate(username, password) {
    console.log(`🔐 Authentification pour: ${username}`);
    
    const users = this.getAllUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      // Ne pas stocker le mot de passe dans currentUser
      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password;
      
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      console.log(`✅ Connexion réussie pour: ${username}`);
      return { success: true, user: userWithoutPassword };
    }
    
    console.warn(`❌ Échec authentification pour: ${username}`);
    return { success: false, error: 'Identifiants incorrects' };
  }
  
  static getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem(this.CURRENT_USER_KEY));
    } catch (error) {
      console.error('❌ Erreur récupération utilisateur:', error);
      return null;
    }
  }
  
  static logout() {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      console.log(`👋 Déconnexion de: ${currentUser.username}`);
    }
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }
}

class DoctorStorage {
  static getKey(baseKey) {
    const currentUser = UserManager.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      console.warn('⚠️ Aucun utilisateur connecté');
      return baseKey;
    }
    return `${baseKey}_${currentUser.id}`;
  }
  
  static get(baseKey, defaultValue = []) {
    try {
      const key = this.getKey(baseKey);
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error(`❌ Erreur récupération ${baseKey}:`, error);
      return defaultValue;
    }
  }
  
  static set(baseKey, data) {
    try {
      const key = this.getKey(baseKey);
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`❌ Erreur sauvegarde ${baseKey}:`, error);
      return false;
    }
  }
  
  static add(baseKey, item) {
    const data = this.get(baseKey);
    
    if (!item.id) {
      item.id = Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }
    
    item.createdAt = item.createdAt || new Date().toISOString();
    item.medecinId = this.getCurrentUserId();
    item.medecinNom = this.getCurrentUserUsername();
    
    data.push(item);
    this.set(baseKey, data);
    return item;
  }
  
  static update(baseKey, id, updates) {
    const data = this.get(baseKey);
    const index = data.findIndex(item => item.id === id);
    
    if (index !== -1) {
      data[index] = { ...data[index], ...updates, updatedAt: new Date().toISOString() };
      this.set(baseKey, data);
      return data[index];
    }
    
    return null;
  }
  
  static remove(baseKey, id) {
    const data = this.get(baseKey);
    const filtered = data.filter(item => item.id !== id);
    this.set(baseKey, filtered);
    return filtered;
  }
  
  static getCurrentUserId() {
    const currentUser = UserManager.getCurrentUser();
    return currentUser ? currentUser.id : null;
  }
  
  static getCurrentUserUsername() {
    const currentUser = UserManager.getCurrentUser();
    return currentUser ? currentUser.username : null;
  }
  
  static getCurrentUserFullName() {
    const currentUser = UserManager.getCurrentUser();
    if (currentUser) {
      return `Dr. ${currentUser.prenom} ${currentUser.nom}`;
    }
    return "Médecin";
  }
  
  static initializeIfNeeded() {
    const currentUser = UserManager.getCurrentUser();
    if (!currentUser || !currentUser.id) return false;
    
    const metadataKey = `doctor_metadata_${currentUser.id}`;
    if (!localStorage.getItem(metadataKey)) {
      this.initForDoctor(currentUser.id, currentUser);
      return true;
    }
    return false;
  }
  
  static initForDoctor(doctorId, doctorData) {
    console.log(`🔧 Initialisation données pour médecin ${doctorId}`);
    
    const keys = ['consultations', 'patients', 'ordonnances', 'factures', 'teleconsultations'];
    
    keys.forEach(key => {
      const specificKey = `${key}_${doctorId}`;
      if (!localStorage.getItem(specificKey)) {
        localStorage.setItem(specificKey, JSON.stringify([]));
      }
    });
    
    const metadata = {
      id: doctorId,
      username: doctorData.username,
      nom: doctorData.nom,
      prenom: doctorData.prenom,
      specialite: doctorData.specialite,
      numeroInscription: doctorData.numeroInscription,
      etablissement: doctorData.etablissement,
      createdAt: new Date().toISOString(),
      initialized: true
    };
    
    localStorage.setItem(`doctor_metadata_${doctorId}`, JSON.stringify(metadata));
    console.log('✅ Données médecin initialisées');
    return metadata;
  }
}

// Initialiser au chargement
document.addEventListener('DOMContentLoaded', function() {
  UserManager.init();
});

// Exporter
window.UserManager = UserManager;
window.DoctorStorage = DoctorStorage;

console.log('✅ doctor_storage.js chargé');