// check-admin.js - Vérifie si l'admin est connecté sur les pages protégées
async function checkAdminSession() {
    try {
        const token = localStorage.getItem('adminToken');
        
        if (!token) {
            console.log('❌ Aucun token admin trouvé');
            return false;
        }
        
        const response = await fetch('/api/admin/check-session', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            console.log('✅ Session admin valide');
            return true;
        } else {
            console.log('❌ Session admin invalide');
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminLoggedIn');
            return false;
        }
    } catch (error) {
        console.error('❌ Erreur vérification session:', error);
        return false;
    }
}

// Fonction pour ajouter le token aux requêtes
function getAuthHeaders() {
    const token = localStorage.getItem('adminToken');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
}

// Vérifier la session au chargement des pages admin
if (window.location.pathname.includes('admin_dashboard') || 
    window.location.pathname.includes('admin_dashowg')) {
    
    document.addEventListener('DOMContentLoaded', async () => {
        const isAdmin = await checkAdminSession();
        
        if (!isAdmin) {
            alert('❌ Session expirée ou non autorisée. Veuillez vous reconnecter.');
            window.location.href = '/admin_login.html';
        }
    });
}

// Export pour usage dans d'autres fichiers
window.checkAdminSession = checkAdminSession;
window.getAuthHeaders = getAuthHeaders;