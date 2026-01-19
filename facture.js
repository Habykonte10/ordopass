document.getElementById("factureForm").addEventListener("submit", function(e){
  e.preventDefault();

  const patient = document.getElementById("patient").value;
  const age = document.getElementById("age").value;
  const adresse = document.getElementById("adresse").value;
  const description = document.getElementById("description").value;
  const montant = document.getElementById("montant").value;
  const paiement = document.getElementById("paiement").value;
  const paye = document.getElementById("facturePaye").value;

  // Remplir l'aperçu
  document.getElementById("factureId").textContent = "FAC-" + Date.now();
  document.getElementById("factureDate").textContent = new Date().toLocaleDateString();
  document.getElementById("facturePatient").textContent = patient;
  document.getElementById("factureAge").textContent = age;
  document.getElementById("factureAdresse").textContent = adresse;
  document.getElementById("factureDescription").textContent = description;
  document.getElementById("prixRow").textContent = parseInt(montant).toLocaleString();
  document.getElementById("totalRow").textContent = parseInt(montant).toLocaleString();
  document.getElementById("factureMontant").textContent = parseInt(montant).toLocaleString();
  document.getElementById("facturePaiement").textContent = paiement;
  document.getElementById("facturePayeValue").textContent = paye;

  document.getElementById("factureFormCard").style.display = "none";
  document.getElementById("facturePreview").style.display = "block";
});

document.getElementById("downloadPDF").addEventListener("click", () => {
  const content = document.getElementById("factureContent");
  html2canvas(content).then(canvas => {
    const imgData = canvas.toDataURL("image/png");
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "pt", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("facture.pdf");
  });
});

document.getElementById("newFacture").addEventListener("click", () => {
  document.getElementById("facturePreview").style.display = "none";
  document.getElementById("factureFormCard").style.display = "block";
});
