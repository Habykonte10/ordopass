// public/js/details_ordonnance.js

function qs(name){ 
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function nl2rows(meds){
  // Expect medicaments text with lines: "Doliprane 1000 mg - posologie - qty?"
  // We'll split by newline and attempt to parse "med - pos - qty"
  if(!meds) return [];
  return meds.split('\n').map(line => line.trim()).filter(Boolean).map((line, i) => {
    // try split by ' - ' or ' | '
    const parts = line.split(' - ');
    return {
      medicament: parts[0] || line,
      posologie: parts[1] || '',
      qte: parts[2] || ''
    };
  });
}

async function loadDetails(){
  const id = qs('id');
  if(!id) {
    alert('ID manquant');
    return;
  }
  try{
    const res = await fetch(`/api/ordonnances/${id}`);
    if(!res.ok) throw new Error('Ordonnance introuvable');
    const ord = await res.json();

    document.getElementById('ticket').textContent = ord.code || (ord._id? ord._id.slice(-6): 'N/A');
    document.getElementById('patient').textContent = ord.patientNom || ord.patientName || '—';
    document.getElementById('statut').textContent = ord.statut === 'active' ? 'À traiter' : ord.statut === 'delivree' ? 'En cours' : 'Terminée';
    document.getElementById('date').textContent = ord.dateOrd || (new Date(ord.dateCreation)).toLocaleString('fr-FR');
    document.getElementById('medecin').textContent = ord.medecinNom || '—';
    document.getElementById('hopital').textContent = ord.hopital || ord.patientAdresse || '—';

    // medicaments: either ord.medicaments (string with newlines) or list fields
    const medsText = ord.medicaments || ord.medicament || '';
    const rows = nl2rows(medsText);

    const tbody = document.getElementById('medicBody');
    tbody.innerHTML = '';
    if(rows.length === 0){
      tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;color:#6b7f8e;padding:14px">Aucun médicament listé</td></tr>`;
    } else {
      rows.forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${r.medicament}</td><td>${r.posologie || '—'}</td><td>${r.qte || '—'}</td>`;
        tbody.appendChild(tr);
      });
    }

    // bind action buttons
    document.getElementById('markProcessing').onclick = () => updateStatus(id, 'delivree');
    document.getElementById('confirmGive').onclick = () => updateStatus(id, 'delivree'); // same action
    document.getElementById('cancelOrd').onclick = () => {
      if(confirm('Confirmer l\'annulation de cette ordonnance ?')) updateStatus(id, 'annulee');
    };

  }catch(err){
    console.error(err);
    alert('Erreur chargement ordonnance');
  }
}

async function updateStatus(id, statut){
  try{
    const res = await fetch(`/api/ordonnances/${id}/status`, {
      method:'PUT',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ statut })
    });
    if(!res.ok) throw new Error('Erreur maj statut');
    alert('Statut mis à jour');
    // after update go back to dashboard or reload page to reflect
    window.location.href = '/pharmacien_dashboard.html';
  }catch(e){
    console.error(e);
    alert('Erreur lors de la mise à jour');
  }
}

document.addEventListener('DOMContentLoaded', loadDetails);
