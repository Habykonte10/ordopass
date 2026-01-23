// medecin.js
(() => {
  // ensure user present
  const user = JSON.parse(sessionStorage.getItem("ordopass_user") || "null");
  if (!user) {
    // try asking server whoami
    fetch("/api/whoami").then(r => r.json()).then(j => {
      if (!j.user) location.href = "/";
      else init(j.user);
    }).catch(()=> {
      // fallback: if not present go to login
      location.href = "/";
    });
  } else {
    init(user);
  }

  function init(user) {
    document.getElementById("userInfo").innerText = `${user.name} — ${user.role}`;

    // tab navigation
    document.querySelectorAll(".sidebar .nav-link").forEach(a => {
      a.addEventListener("click", (ev) => {
        const tab = a.dataset.tab;
        if (!tab) return;
        document.querySelectorAll(".sidebar .nav-link").forEach(x => x.classList.remove("active"));
        a.classList.add("active");
        showTab(tab);
      });
    });

    // logout
    document.getElementById("logoutBtn").addEventListener("click", (e) => {
      e.preventDefault();
      // try server logout
      fetch("/api/logout", { method: "POST" }).finally(() => {
        sessionStorage.removeItem("ordopass_user");
        location.href = "/";
      });
    });

    // initialize data
    loadConsultations();
    loadPatients();
    loadPharmacies();

    // filters
    document.querySelectorAll(".tab-filter").forEach(btn => btn.addEventListener("click", (e)=>{
      document.querySelectorAll(".tab-filter").forEach(x=>x.classList.remove("active"));
      btn.classList.add("active");
      filterConsults(btn.dataset.filter);
    }));
    document.getElementById("consultSearch").addEventListener("input", ()=>filterConsults(document.querySelector(".tab-filter.active").dataset.filter));

    // new consult button (demo)
    document.getElementById("newConsultBtn").addEventListener("click", ()=>alert("Formulaire de nouvelle consultation à implémenter."));

    // teleconsult
    document.getElementById("createRoomBtn").addEventListener("click", ()=>{
      const name = document.getElementById("teleRoomName").value.trim() || `Ordo-${Date.now()}`;
      document.getElementById("jitsiBox").style.display = "block";
      document.getElementById("jitsiFrame").src = `https://meet.jit.si/${encodeURIComponent(name)}`;
    });
    document.getElementById("closeJitsi").addEventListener("click", ()=>{
      document.getElementById("jitsiFrame").src = "";
      document.getElementById("jitsiBox").style.display = "none";
    });
  }

  function showTab(tab) {
    document.querySelectorAll(".tab-content").forEach(s => s.style.display = "none");
    const el = document.getElementById(tab);
    if (el) el.style.display = "block";
  }

  // demo datasets (replace by API calls)
  const CONSULTS = [
    { id: 1456, patient: "Awa Diop", date: "13 Juil 2025 08:45", motif: "Fièvre persistante", statut: "En attente" },
    { id: 1457, patient: "Leslie Alexander", date: "16 Juil 2025 18:45", motif: "Douleurs thoraciques", statut: "En attente" },
    { id: 1458, patient: "Ralph Edwards", date: "03 Août 2025 18:45", motif: "Nausées", statut: "En attente" },
    { id: 1459, patient: "Esther Howard", date: "03 Août 2025 18:45", motif: "Céphalées", statut: "Terminé" }
  ];
  const PATIENTS = [
    { nom: "Diop", prenom: "Mamadou", dob: "15/04/1990", phone:"+221771234567", email:"mamadou@example.com" },
    { nom: "Sarr", prenom: "Fatou", dob: "02/02/1988", phone:"+221776543210", email:"fatou.sarr@example.com" }
  ];
  const PHARMAS = [
    { id: "PHARMA1", name: "Pharmacie Liberté", address: "Liberté 6, Dakar", phone:"+221774567890" },
    { id: "PHARMA2", name: "Pharmacie Centrale", address: "Rue X, Dakar", phone:"+221772233445" }
  ];

  function loadConsultations() {
    const tbody = document.getElementById("consultBody");
    tbody.innerHTML = "";
    CONSULTS.forEach(c => {
      const tr = document.createElement("tr");
      tr.dataset.status = c.statut === "En attente" ? "pending" : (c.statut === "Terminé" ? "done" : "other");
      tr.innerHTML = `<td>#${c.id}</td>
        <td>${escapeHtml(c.patient)}</td>
        <td>${escapeHtml(c.date)}</td>
        <td>${escapeHtml(c.motif)}</td>
        <td><span class="status status-${c.statut==='Terminé'?'done':'pending'}">${c.statut}</span></td>
        <td>
          <button class="btn-outline small" onclick="openDetails(${c.id})">Détails</button>
          <button class="btn-primary small" onclick="startTele('${c.id}')">📹 Téléconsult</button>
          <button class="btn-outline small" onclick="openChatForOrder(${c.id})">💬 Chat</button>
        </td>`;
      tbody.appendChild(tr);
    });
    window.openDetails = (id) => alert("Ouvrir la fiche détail pour #" + id);
    window.startTele = (id) => {
      document.querySelector(`[data-tab="teleconsult"]`).click?.(); // try to switch
      document.getElementById("teleRoomName").value = `Ordo-${id}`;
      document.getElementById("createRoomBtn").click();
    };
    window.openChatForOrder = (id) => {
      // store context and open chat page
      sessionStorage.setItem("chat_context", JSON.stringify({ type:"order", id }));
      location.href = "chat.html";
    };
  }

  function filterConsults(filter) {
    const q = document.getElementById("consultSearch").value.toLowerCase();
    document.querySelectorAll("#consultBody tr").forEach(r=>{
      const status = r.dataset.status;
      let visible = (filter === 'all') || (filter === 'pending' && status==='pending') || (filter === 'done' && status==='done');
      if (q) {
        visible = visible && r.innerText.toLowerCase().includes(q);
      }
      r.style.display = visible ? "" : "none";
    });
  }

  function loadPatients() {
    const b = document.getElementById("patientsBody");
    b.innerHTML = "";
    PATIENTS.forEach(p=>{
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${escapeHtml(p.nom)}</td><td>${escapeHtml(p.prenom)}</td><td>${escapeHtml(p.dob)}</td><td>${escapeHtml(p.phone)}</td><td>${escapeHtml(p.email)}</td><td><button class="btn-outline small" onclick="viewPatient('${p.nom}')">Voir</button></td>`;
      b.appendChild(tr);
    });
    window.viewPatient = (n) => alert("Afficher dossier patient: " + n);
  }

  function loadPharmacies(){
    const b = document.getElementById("pharmaBody");
    b.innerHTML = "";
    PHARMAS.forEach(p=>{
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${escapeHtml(p.id)}</td><td>${escapeHtml(p.name)}</td><td>${escapeHtml(p.address)}</td><td>${escapeHtml(p.phone)}</td><td><button class="btn-primary small" onclick="sendOrderTo('${p.id}')">Envoyer ordonnance</button></td>`;
      b.appendChild(tr);
    });
    window.sendOrderTo = (id) => alert("Ordonnance envoyée à " + id + " (simulation)");
  }

  function escapeHtml(s){ if(!s) return ""; return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
})();
