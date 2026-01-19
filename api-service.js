class ApiService {
    constructor() {
        this.API_URL = window.APP_CONFIG.getApiUrl();
        console.log("API URL:", this.API_URL);
    }

    async checkServerStatus() {
        try {
            const res = await fetch(`${this.API_URL}/health`);
            const text = await res.text();
            const data = JSON.parse(text);
            return { online: true, data };
        } catch {
            return { online: false };
        }
    }

    async login(username, password, role) {
        const res = await fetch(`${this.API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ username, password, role })
        });

        const text = await res.text();
        const data = JSON.parse(text);

        if (!res.ok) {
            throw new Error(data.error || "Erreur connexion");
        }

        return data;
    }

    async registerMedecin(payload) {
        return this.post("register-medecin", payload);
    }

    async registerPharmacien(payload) {
        return this.post("register-pharmacien", payload);
    }

    async getPharmacies() {
        const res = await fetch(`${this.API_URL}/pharmacies`);
        const text = await res.text();
        return JSON.parse(text);
    }

    async post(endpoint, payload) {
        const res = await fetch(`${this.API_URL}/${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const text = await res.text();
        const data = JSON.parse(text);

        if (!res.ok) {
            throw new Error(data.error || "Erreur serveur");
        }

        return data;
    }
}

window.apiService = new ApiService();
