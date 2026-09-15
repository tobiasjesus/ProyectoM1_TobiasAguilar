function colorAleatorioHSL() {
  const h = Math.floor(Math.random() * 360);
  const s = Math.floor(Math.random() * 30) + 60;
  const l = Math.floor(Math.random() * 30) + 40;
  return { h, s, l };
}

function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;

  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  const r = Math.round(255 * f(0));
  const g = Math.round(255 * f(8));
  const b = Math.round(255 * f(4));

  return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
}

function generarPaleta(cantidad) {
  const paleta = [];
  for (let i = 0; i < cantidad; i++) {
    paleta.push(colorAleatorioHSL());
  }
  return paleta;
}

const selectTamano = document.querySelector("#tamano");
const selectFormato = document.querySelector("#formato");
const botonGenerar = document.querySelector("#generar");
const contenedorPaleta = document.querySelector("#paleta");
const feedback = document.querySelector("#feedback");

let feedbackTimeoutId = null;

function formatearColor(color, formato) {
  if (formato === "hex") {
    return hslToHex(color.h, color.s, color.l);
  }
  return `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
}

function renderizarPaleta(paleta, formato) {
  contenedorPaleta.textContent = "";

  paleta.forEach(color => {
    const card = document.createElement("div");
    card.classList.add("color-card");
    card.style.backgroundColor = `hsl(${color.h}, ${color.s}%, ${color.l}%)`;

    const codigo = document.createElement("span");
    codigo.classList.add("color-codigo");
    codigo.textContent = formatearColor(color, formato);

    card.appendChild(codigo);
    contenedorPaleta.appendChild(card);
  });
}

function mostrarFeedback(mensaje) {
  feedback.textContent = mensaje;
  feedback.classList.add("visible");

  if (feedbackTimeoutId) {
    clearTimeout(feedbackTimeoutId);
  }

  feedbackTimeoutId = setTimeout(() => {
    feedback.classList.remove("visible");
  }, 2500);
}

botonGenerar.addEventListener("click", () => {
  const cantidad = parseInt(selectTamano.value);
  const formato = selectFormato.value;

  const paleta = generarPaleta(cantidad);
  renderizarPaleta(paleta, formato);
  mostrarFeedback("Paleta generada");
});