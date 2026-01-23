// === VÉRIFICATION D'AUTHENTIFICATION GLOBALE ===
function checkAuth() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const currentPage = window.location.pathname;
  
  // Pages publiques
  const publicPages = ['/index.html', '/register.html', '/'];
  const isPublicPage = publicPages.some(page => currentPage.includes(page));
  
  if (!user && !isPublicPage) {
    window.location.href = 'index.html';
    return null;
  }
  
  if (user) {
    // Vérification des rôles
    if (currentPage.includes('medecin_') && user.role !== 'medecin') {
      window.location.href = 'index.html';
      return null;
    }
    
    if (currentPage.includes('pharmacien_') && user.role !== 'pharmacien') {
      window.location.href = 'index.html';
      return null;
    }
    
    // Afficher le nom d'utilisateur
    const usernameElements = document.querySelectorAll('#usernameDisplay, #userName');
    usernameElements.forEach(el => {
      if (el) el.textContent = user.username;
    });
  }
  
  return user;
}

// Déconnexion automatique après 24h
function setupAutoLogout() {
  const lastActivity = localStorage.getItem('lastActivity');
  const now = Date.now();
  
  if (lastActivity && (now - lastActivity > 24 * 60 * 60 * 1000)) {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('lastActivity');
    window.location.href = 'index.html';
  }
  
  localStorage.setItem('lastActivity', now);
}

// Initialisation de la sécurité
document.addEventListener('DOMContentLoaded', function() {
  setupAutoLogout();
  const user = checkAuth();
  
  // Gestion déconnexion manuelle
  const logoutButtons = document.querySelectorAll('#logout, [href*="logout"]');
  logoutButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('lastActivity');
        window.location.href = 'index.html';
      }
    });
  });
  
  // Mettre à jour le dernier timestamp d'activité
  document.addEventListener('click', function() {
    localStorage.setItem('lastActivity', Date.now());
  });
});