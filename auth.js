// public/js/auth.js - Gestion de l'authentification

// --- INSCRIPTION ---
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;
    const messageBox = document.getElementById("messageBox");

    messageBox.textContent = "";
    messageBox.className = "message-box";

    // Validation basique
    if (!username || !password || !role) {
      messageBox.textContent = "⚠️ Tous les champs sont requis";
      messageBox.classList.add("error");
      return;
    }

    try {
      // Essayer l'API
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
      });

      const data = await res.json();

      if (res.ok) {
        // Succès
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        messageBox.textContent = "✅ Compte créé avec succès ! Redirection...";
        messageBox.classList.add("success");
        
        setTimeout(() => {
          window.location.href = data.user.role === "medecin"
            ? "medecin_dashboard.html"
            : "pharmacien_dashboard.html";
        }, 1000);
      } else {
        messageBox.textContent = "❌ " + (data.error || "Erreur lors de la création");
        messageBox.classList.add("error");
      }

    } catch (err) {
      console.error("Erreur:", err);
      messageBox.textContent = "❌ Erreur de connexion au serveur";
      messageBox.classList.add("error");
    }
  });
}

// --- INSCRIPTION PHARMACIEN SPÉCIFIQUE ---
const registerPharmacienForm = document.getElementById("registerForm");
if (registerPharmacienForm && document.getElementById("pharmacyName")) {
  registerPharmacienForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const telephone = document.getElementById("telephone").value.trim();
    const pharmacyName = document.getElementById("pharmacyName").value.trim();
    const address = document.getElementById("address").value.trim();
    const licenseNumber = document.getElementById("licenseNumber").value.trim();
    const experience = document.getElementById("experience").value;
    const password = document.getElementById("password").value;
    const messageBox = document.getElementById("messageBox");

    messageBox.textContent = "";
    messageBox.className = "message-box";

    // Validation
    if (!email || !telephone || !pharmacyName || !address || !licenseNumber || !experience || !password) {
      messageBox.textContent = "⚠️ Tous les champs sont requis";
      messageBox.classList.add("error");
      return;
    }

    try {
      const res = await fetch("/api/register-pharmacien", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: email,
          password: password, 
          email: email,
          telephone: telephone,
          nom: pharmacyName,
          adresse: address,
          licenseNumber: licenseNumber,
          experience: experience
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        messageBox.textContent = "✅ Compte pharmacien créé avec succès ! Redirection...";
        messageBox.classList.add("success");
        
        setTimeout(() => {
          window.location.href = "pharmacien_dashboard.html";
        }, 1500);
      } else {
        messageBox.textContent = "❌ " + (data.error || "Erreur lors de la création");
        messageBox.classList.add("error");
      }

    } catch (err) {
      console.error("Erreur:", err);
      messageBox.textContent = "❌ Erreur de connexion au serveur";
      messageBox.classList.add("error");
    }
  });
}

// --- CONNEXION ---
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;
    const messageBox = document.getElementById("messageBox");

    messageBox.textContent = "";
    messageBox.className = "message-box";

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        messageBox.textContent = "✅ Connexion réussie — redirection...";
        messageBox.classList.add("success");

        setTimeout(() => {
          window.location.href = data.user.role === "medecin"
            ? "medecin_dashboard.html"
            : "pharmacien_dashboard.html";
        }, 700);
      } else {
        messageBox.textContent = "❌ " + (data.error || "Erreur de connexion");
        messageBox.classList.add("error");
      }

    } catch (err) {
      console.error("Erreur:", err);
      messageBox.textContent = "❌ Erreur de connexion au serveur";
      messageBox.classList.add("error");
    }
  });
}

// --- Gestion des messages ---
document.addEventListener('DOMContentLoaded', function() {
  const msg = document.getElementById('messageBox');
  if (msg) {
    const observer = new MutationObserver(() => {
      if (msg.textContent.trim() !== '') {
        msg.style.display = 'block';
        // Masquer le message après 5 secondes
        setTimeout(() => {
          msg.style.display = 'none';
        }, 5000);
      }
    });
    observer.observe(msg, { childList: true, subtree: true });
  }

  // Afficher le nom d'utilisateur si connecté
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const usernameDisplay = document.getElementById('usernameDisplay');
  if (currentUser && usernameDisplay) {
    usernameDisplay.textContent = currentUser.username;
  }
});

// --- Fonction de déconnexion globale ---
function logout() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
  if (currentUser) {
    // Appeler l'API de déconnexion
    fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: currentUser.username,
        role: currentUser.role
      })
    });
  }
  
  localStorage.removeItem('currentUser');
  window.location.href = 'index.html';
}

// Ajouter le gestionnaire de déconnexion à tous les boutons de déconnexion
document.addEventListener('DOMContentLoaded', function() {
  const logoutButtons = document.querySelectorAll('#logout');
  logoutButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
        logout();
      }
    });
  });
});// auth.js - Gestion centralisée de l'authentification

class AuthManager {
  static CURRENT_USER_KEYS = ['currentUser', 'ordoPass_currentUser'];
  
  // Récupérer l'utilisateur connecté
  static getCurrentUser() {
    for (const key of this.CURRENT_USER_KEYS) {
      const userData = localStorage.getItem(key);
      if (userData) {
        try {
          const user = JSON.parse(userData);
          if (user && user.id) {
            // Normaliser dans currentUser pour compatibilité
            localStorage.setItem('currentUser', JSON.stringify(user));
            return user;
          }
        } catch (e) {
          console.error('Erreur parsing user data:', e);
        }
      }
    }
    return null;
  }
  
  // Vérifier si l'utilisateur est un médecin
  static isMedecin() {
    const user = this.getCurrentUser();
    return user && user.role === 'medecin';
  }
  
  // Vérifier si l'utilisateur est un patient
  static isPatient() {
    const user = this.getCurrentUser();
    return user && user.role === 'patient';
  }
  
  // Déconnecter l'utilisateur
  static logout() {
    this.CURRENT_USER_KEYS.forEach(key => {
      localStorage.removeItem(key);
    });
    window.location.href = 'index.html';
  }
  
  // Rediriger si non connecté
  static requireAuth(role = null) {
    const user = this.getCurrentUser();
    
    if (!user) {
      window.location.href = 'index.html';
      return false;
    }
    
    if (role && user.role !== role) {
      alert(`Accès réservé aux ${role}s`);
      this.logout();
      return false;
    }
    
    return true;
  }
}

// Exporter pour utilisation globale
window.AuthManager = AuthManager;