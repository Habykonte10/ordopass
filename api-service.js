class ApiService {
  constructor() {
    this.API_URL = window.APP_CONFIG.API_URL;
  }

  async registerMedecin(data) {
    const res = await fetch(
      `${this.API_URL}/api/register-medecin`,
      {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(data)
      }
    );

    const result = await res.json();
    if(!res.ok) throw new Error(result.error);
    return result;
  }

  async login(username, password, role) {
    const res = await fetch(
      `${this.API_URL}/api/auth/login`,
      {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ username, password, role })
      }
    );

    const data = await res.json();
    if(!res.ok) throw new Error(data.error || "Erreur connexion");
    return data;
  }
}

window.apiService = new ApiService();
