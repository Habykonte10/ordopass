const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Fichier de données
const DATA_FILE = 'data.json';

// Charger les données
function loadData() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Erreur chargement données:', error);
    }
    
    return {
        users: [
            {
                id: 'admin_001',
                username: 'admin',
                email: 'admin@ordopass.com',
                password: 'admin123',
                nom: 'Administrateur',
                prenom: 'System',
                role: 'admin',
                createdAt: new Date().toISOString(),
                lastLogin: null
            },
            {
                id: 'medecin_001',
                username: 'testmedecin',
                email: 'test@medecin.com',
                password: 'test123',
                nom: 'Dupont',
                prenom: 'Jean',
                dateNaissance: '1980-01-01',
                specialite: 'Généraliste',
                numeroInscription: 'MED123456',
                etablissement: 'Cabinet Test',
                role: 'medecin',
                createdAt: new Date().toISOString(),
                lastLogin: null
            },
            {
                id: 'pharmacien_001',
                username: 'testpharmacien',
                email: 'test@pharmacie.com',
                password: 'test123',
                nom: 'Pharmacie du Centre',
                adresse: '1 Rue de la Paix, Paris',
                telephone: '+33123456789',
                licenseNumber: 'PHARM12345',
                experience: 10,
                role: 'pharmacien',
                createdAt: new Date().toISOString(),
                lastLogin: null
            }
        ],
        consultations: [],
        ordonnances: [],
        pharmacies: [
            {
                id: 'pharmacie_centrale_123',
                nom: 'Pharmacie Centrale',
                adresse: '123 Avenue Bourguiba, Dakar',
                telephone: '+221 33 821 45 67',
                online: true,
                horaires: '08:00-20:00'
            },
            {
                id: 'pharmacie_marche_456',
                nom: 'Pharmacie du Marché',
                adresse: '45 Rue du Marché, Dakar',
                telephone: '+221 33 822 34 56',
                online: false,
                horaires: '07:30-21:00'
            }
        ]
    };
}

// Sauvegarder les données
function saveData() {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify({
            users,
            consultations,
            ordonnances,
            pharmacies
        }, null, 2));
    } catch (error) {
        console.error('Erreur sauvegarde données:', error);
    }
}

// Initialiser les données
let { users, consultations, ordonnances, pharmacies } = loadData();

// ✅ Route de test
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'OrdoPass API en ligne',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        users_count: users.length,
        consultations_count: consultations.length,
        ordonnances_count: ordonnances.length
    });
});

// ✅ Inscription médecin
app.post('/api/register-medecin', (req, res) => {
    try {
        console.log('📝 Inscription médecin reçue:', req.body);
        
        const {
            username,
            password,
            email,
            nom,
            prenom,
            dateNaissance,
            specialite,
            numeroInscription,
            etablissement
        } = req.body;

        // Validation
        if (!username || !password || !email) {
            return res.status(400).json({
                success: false,
                error: 'Tous les champs obligatoires doivent être remplis'
            });
        }

        // Vérifier si l'utilisateur existe déjà
        const existingUser = users.find(u => u.email === email || u.username === username);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'Un utilisateur avec cet email ou nom d\'utilisateur existe déjà'
            });
        }

        // Créer l'utilisateur
        const newUser = {
            id: 'medecin_' + Date.now().toString(),
            username,
            email,
            password, // Note: En production, il faut hasher le mot de passe
            nom,
            prenom,
            dateNaissance,
            specialite,
            numeroInscription,
            etablissement,
            role: 'medecin',
            createdAt: new Date().toISOString(),
            lastLogin: null
        };

        users.push(newUser);
        saveData();

        // Retourner l'utilisateur sans le mot de passe
        const { password: _, ...userWithoutPassword } = newUser;

        res.json({
            success: true,
            user: userWithoutPassword,
            message: 'Compte médecin créé avec succès'
        });

    } catch (error) {
        console.error('❌ Erreur inscription médecin:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur interne du serveur'
        });
    }
});

// ✅ Inscription pharmacien
app.post('/api/register-pharmacien', (req, res) => {
    try {
        console.log('📝 Inscription pharmacien reçue:', req.body);
        
        const {
            username,
            password,
            email,
            nom,
            adresse,
            telephone,
            licenseNumber,
            experience
        } = req.body;

        // Validation
        if (!username || !password || !email || !nom) {
            return res.status(400).json({
                success: false,
                error: 'Tous les champs obligatoires doivent être remplis'
            });
        }

        // Vérifier si l'utilisateur existe déjà
        const existingUser = users.find(u => u.email === email || u.username === username);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'Un utilisateur avec cet email ou nom d\'utilisateur existe déjà'
            });
        }

        // Créer l'utilisateur
        const newUser = {
            id: 'pharmacien_' + Date.now().toString(),
            username,
            email,
            password,
            nom,
            adresse,
            telephone,
            licenseNumber,
            experience: parseInt(experience) || 0,
            role: 'pharmacien',
            createdAt: new Date().toISOString(),
            lastLogin: null
        };

        users.push(newUser);
        
        // Ajouter à la liste des pharmacies
        pharmacies.push({
            id: newUser.id,
            nom: newUser.nom,
            adresse: newUser.adresse,
            telephone: newUser.telephone,
            licenseNumber: newUser.licenseNumber,
            experience: newUser.experience,
            online: true,
            horaires: '08:00-20:00'
        });
        
        saveData();

        // Retourner l'utilisateur sans le mot de passe
        const { password: _, ...userWithoutPassword } = newUser;

        res.json({
            success: true,
            user: userWithoutPassword,
            message: 'Compte pharmacien créé avec succès'
        });

    } catch (error) {
        console.error('❌ Erreur inscription pharmacien:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur interne du serveur'
        });
    }
});

// ✅ Connexion universelle
app.post('/api/login', (req, res) => {
    try {
        console.log('🔐 Tentative connexion:', req.body);
        
        const { username, password, role } = req.body;

        // Chercher l'utilisateur
        const user = users.find(u =>
            (u.username === username || u.email === username) &&
            u.password === password &&
            u.role === role
        );

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Identifiants incorrects'
            });
        }

        // Mettre à jour la dernière connexion
        user.lastLogin = new Date().toISOString();
        saveData();

        // Retourner l'utilisateur sans le mot de passe
        const { password: _, ...userWithoutPassword } = user;

        res.json({
            success: true,
            user: userWithoutPassword,
            message: 'Connexion réussie'
        });

    } catch (error) {
        console.error('❌ Erreur connexion:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur interne du serveur'
        });
    }
});

// ✅ Obtenir la liste des pharmacies
app.get('/api/pharmacies', (req, res) => {
    try {
        res.json(pharmacies);
    } catch (error) {
        console.error('❌ Erreur récupération pharmacies:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

// ✅ Créer une consultation
app.post('/api/consultations', (req, res) => {
    try {
        const consultation = req.body;
        consultation.id = Date.now().toString();
        consultation.createdAt = new Date().toISOString();
        consultation.statut = 'En attente';

        consultations.push(consultation);
        saveData();

        res.json({
            success: true,
            consultation: consultation,
            message: 'Consultation créée avec succès'
        });

    } catch (error) {
        console.error('❌ Erreur création consultation:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

app.get('/api/consultations', (req, res) => {
    try {
        res.json(consultations);
    } catch (error) {
        console.error('❌ Erreur récupération consultations:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

// ✅ Créer une ordonnance
app.post('/api/ordonnances', (req, res) => {
    try {
        const ordonnance = req.body;
        ordonnance.id = Date.now().toString();
        ordonnance.createdAt = new Date().toISOString();
        ordonnance.statut = 'active';
        ordonnance.code = 'ORD' + Date.now().toString(36).toUpperCase();

        ordonnances.push(ordonnance);
        saveData();

        res.json({
            success: true,
            ordonnance: ordonnance,
            message: 'Ordonnance créée avec succès'
        });

    } catch (error) {
        console.error('❌ Erreur création ordonnance:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

app.get('/api/ordonnances', (req, res) => {
    try {
        res.json(ordonnances);
    } catch (error) {
        console.error('❌ Erreur récupération ordonnances:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

// ✅ Obtenir les ordonnances d'une pharmacie
app.get('/api/pharmacien/ordonnances', (req, res) => {
    try {
        const { nom } = req.query;
        
        // Filtrer les ordonnances pour cette pharmacie
        const ordonnancesPharmacie = ordonnances.filter(ord => 
            ord.pharmacieNom === nom
        );
        
        res.json(ordonnancesPharmacie);
    } catch (error) {
        console.error('❌ Erreur récupération ordonnances pharmacien:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// ✅ Mettre à jour le statut d'une ordonnance
app.put('/api/ordonnances/:id/status', (req, res) => {
    try {
        const { id } = req.params;
        const { statut } = req.body;
        
        const ordonnanceIndex = ordonnances.findIndex(ord => ord.id === id);
        
        if (ordonnanceIndex === -1) {
            return res.status(404).json({ error: 'Ordonnance non trouvée' });
        }
        
        ordonnances[ordonnanceIndex].statut = statut;
        saveData();
        
        res.json({
            success: true,
            message: 'Statut mis à jour',
            ordonnance: ordonnances[ordonnanceIndex]
        });
    } catch (error) {
        console.error('❌ Erreur mise à jour statut:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// ✅ Obtenir tous les utilisateurs (admin)
app.get('/api/users', (req, res) => {
    try {
        const usersWithoutPasswords = users.map(({ password, ...user }) => user);
        res.json(usersWithoutPasswords);
    } catch (error) {
        console.error('❌ Erreur récupération utilisateurs:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// ✅ Statistiques admin
app.get('/api/admin/stats', (req, res) => {
    try {
        const stats = {
            totalUsers: users.length,
            medecins: users.filter(u => u.role === 'medecin').length,
            pharmaciens: users.filter(u => u.role === 'pharmacien').length,
            consultations: consultations.length,
            ordonnances: ordonnances.length,
            pharmacies: pharmacies.length
        };
        
        res.json(stats);
    } catch (error) {
        console.error('❌ Erreur statistiques:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// ✅ Réinitialiser les données de test
app.post('/api/reset-test-data', (req, res) => {
    try {
        const defaultData = loadData();
        
        users = defaultData.users;
        consultations = [];
        ordonnances = [];
        pharmacies = defaultData.pharmacies;
        
        saveData();
        
        res.json({
            success: true,
            message: 'Données réinitialisées avec succès',
            users_count: users.length
        });
    } catch (error) {
        console.error('❌ Erreur réinitialisation:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// ✅ Route par défaut pour le SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ✅ Démarrer le serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur OrdoPass démarré sur http://localhost:${PORT}`);
    console.log(`📞 Support: +221 78 929 92 04`);
    console.log(`📊 Données:`);
    console.log(`   👥 ${users.length} utilisateurs`);
    console.log(`   👨‍⚕️ ${users.filter(u => u.role === 'medecin').length} médecins`);
    console.log(`   💊 ${users.filter(u => u.role === 'pharmacien').length} pharmacies`);
    console.log(`💾 Fichier données: ${DATA_FILE}`);
    console.log(``);
    console.log(`✅ TESTS RAPIDES :`);
    console.log(`   👉 http://localhost:${PORT}/api/health`);
    console.log(`   👉 http://localhost:${PORT}/admin_login.html?test=true`);
    console.log(`   👉 http://localhost:${PORT}/debug.html`);
});