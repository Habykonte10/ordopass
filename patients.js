const tbody = document.querySelector("#patientsTable tbody");
const modal = document.getElementById("modal");
const saveBtn = document.getElementById("saveBtn");

let editId = null;

// --- Affichage liste ---
async function loadPatients() {
  const res = await fetch("/api/patients");
  const data = await res.json();
  tbody.innerHTML = "";
  data.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.name}</td>
      <td>${p.age}</td>
      <td>${p.phone || "-"}</td>
      <td>${p.address || "-"}</td>
      <td>${new Date(p.createdAt).toLocaleDateString()}</td>
      <td>
        <button onclick='editPatient("${p._id}")'>Modifier</button>
        <button onclick='deletePatient("${p._id}")'>Supprimer</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

// --- Ajouter / Modifier ---
function showAddForm() {
  editId = null;
  modal.style.display = "block";
  document.getElementById("modalTitle").innerText = "Ajouter patient";
  ["name","age","phone","address"].forEach(id=>document.getElementById(id).value="");
}

function closeForm() { modal.style.display="none"; }

async function savePatient() {
  const patient = {
    name: document.getElementById("name").value.trim(),
    age: document.getElementById("age").value,
    phone: document.getElementById("phone").value.trim(),
    address: document.getElementById("address").value.trim()
  };
  if(editId) {
    await fetch("/api/patients/"+editId, {
      method:"PUT", headers:{"Content-Type":"application/json"}, body: JSON.stringify(patient)
    });
  } else {
    await fetch("/api/patients", {
      method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(patient)
    });
  }
  closeForm();
  loadPatients();
}

async function editPatient(id) {
  editId = id;
  const res = await fetch("/api/patients/"+id);
  const p = await res.json();
  ["name","age","phone","address"].forEach(id=>{
    document.getElementById(id).value = p[id];
  });
  document.getElementById("modalTitle").innerText = "Modifier patient";
  modal.style.display = "block";
}

async function deletePatient(id) {
  if(!confirm("Supprimer ce patient ?")) return;
  await fetch("/api/patients/"+id, { method:"DELETE" });
  loadPatients();
}

saveBtn.addEventListener("click", savePatient);

// --- Init ---
loadPatients();
