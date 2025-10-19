(function () {
  const $ = (sel) => document.querySelector(sel);

  const nameInput = $("#name");
  const tierInput = $("#tier");
  const dedicationInput = $("#dedication");

  const nameOut = $("#cert-name");
  const tierOut = $("#cert-tier");
  const dedicationOut = $("#cert-dedication");
  const dateOut = $("#cert-date");
  const idOut = $("#cert-id");

  const certEl = $("#cert");
  const formEl = $("#cert-form");
  const btnPng = $("#btn-png");
  const btnPdf = $("#btn-pdf");

  // Init defaults
  function formatDate(d = new Date()) {
    // Locale NZ with month name; supports macrons in user input but date is standard
    return d.toLocaleDateString("en-NZ", { year: "numeric", month: "long", day: "numeric" });
  }

  function shortId() {
    const rand = crypto.getRandomValues(new Uint8Array(8));
    return Array.from(rand, b => b.toString(16).padStart(2, "0")).join("").slice(0, 10);
  }

  function updatePreview() {
    const nm = (nameInput.value || "Your Name").trim();
    const tier = (tierInput.value || "Single Feather").trim();
    const ded = (dedicationInput.value || "").trim();

    nameOut.textContent = nm;
    tierOut.textContent = tier;
    dedicationOut.textContent = ded ? `“${ded}”` : "";

    // date & id once if empty
    if (!dateOut.textContent) dateOut.textContent = formatDate();
    if (!idOut.textContent) idOut.textContent = shortId();
  }

  async function toCanvas() {
    // Ensure fonts/layout settled
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    return html2canvas(certEl, {
      backgroundColor: null,
      scale: 2, // nice crisp export
      useCORS: true
    });
  }

  async function downloadPNG() {
    updatePreview();
    const canvas = await toCanvas();
    const url = canvas.toDataURL("image/png");
    const nm = (nameInput.value || "Your Name").trim().replace(/\s+/g, "_");
    const a = document.createElement("a");
    a.href = url;
    a.download = `Tutu_Certificate_${nm}.png`;
    a.click();
  }

  async function downloadPDF() {
    updatePreview();
    const canvas = await toCanvas();
    const imgData = canvas.toDataURL("image/png");

    const { jsPDF } = window.jspdf;
    // A4 portrait in mm
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();

    // Calculate fit while preserving aspect ratio
    const imgWpx = canvas.width;
    const imgHpx = canvas.height;
    const imgRatio = imgWpx / imgHpx;
    let w = pageW, h = w / imgRatio;
    if (h > pageH) { h = pageH; w = h * imgRatio; }

    const x = (pageW - w) / 2;
    const y = (pageH - h) / 2;

    pdf.addImage(imgData, "PNG", x, y, w, h, undefined, "FAST");

    const nm = (nameInput.value || "Your Name").trim().replace(/\s+/g, "_");
    pdf.save(`Tutu_Certificate_${nm}.pdf`);
  }

  // Events
  formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    updatePreview();
  });
  nameInput.addEventListener("input", updatePreview);
  tierInput.addEventListener("change", updatePreview);
  dedicationInput.addEventListener("input", updatePreview);
  btnPng.addEventListener("click", (e) => { e.preventDefault(); downloadPNG(); });
  btnPdf.addEventListener("click", (e) => { e.preventDefault(); downloadPDF(); });

  // First render
  updatePreview();
})();

