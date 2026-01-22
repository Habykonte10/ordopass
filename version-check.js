// Force le rechargement sans cache si la version est ancienne
const APP_VERSION = '2.0';

if (localStorage.getItem('appVersion') !== APP_VERSION) {
    localStorage.setItem('appVersion', APP_VERSION);
    
    // Vider le localStorage des données obsolètes
    const keysToKeep = ['token', 'currentUser', 'ordoPass_currentUser'];
    Object.keys(localStorage).forEach(key => {
        if (!keysToKeep.includes(key)) {
            localStorage.removeItem(key);
        }
    });
    
    // Forcer le rechargement sans cache
    if (window.performance && window.performance.navigation.type === 1) {
        // La page a été rechargée, ne rien faire
    } else {
        window.location.reload(true);
    }
}