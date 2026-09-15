function colorAleatorioHSL() {
  const h = Math.floor(Math.random() * 360);
  const s = Math.floor(Math.random() * 101);
  const l = Math.floor(Math.random() * 101);
  return { h, s, l, bloqueado: false };
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

function generarPaleta(cantidad, paletaAnterior = []) {
  const nuevaPaleta = [];
  for (let i = 0; i < cantidad; i++) {
    const anterior = paletaAnterior[i];
    nuevaPaleta.push(anterior && anterior.bloqueado ? anterior : colorAleatorioHSL());
  }
  return nuevaPaleta;
}

const selectTamano = document.querySelector("#tamano");
const selectFormato = document.querySelector("#formato");
const botonGenerar = document.querySelector("#generar");
const contenedorPaleta = document.querySelector("#paleta");
const feedback = document.querySelector("#feedback");

let paletaActual = [];
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
    const hex = hslToHex(color.h, color.s, color.l);

    const card = document.createElement("div");
    card.classList.add("color-card");
    if (color.bloqueado) {
      card.classList.add("bloqueado");
    }
    card.style.backgroundColor = `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", "Copiar código de color");

    card.addEventListener("click", () => copiarAlPortapapeles(hex));
    card.addEventListener("keydown", evento => {
      if (evento.key === "Enter" || evento.key === " ") {
        evento.preventDefault();
        copiarAlPortapapeles(hex);
      }
    });

    const botonBloquear = document.createElement("button");
    botonBloquear.type = "button";
    botonBloquear.classList.add("color-bloquear");
    botonBloquear.setAttribute("aria-pressed", color.bloqueado);
    botonBloquear.setAttribute("aria-label", color.bloqueado ? "Desbloquear color" : "Bloquear color");
    botonBloquear.textContent = color.bloqueado ? "🔒" : "🔓";
    botonBloquear.addEventListener("click", evento => {
      evento.stopPropagation();
      color.bloqueado = !color.bloqueado;
      renderizarPaleta(paletaActual, selectFormato.value);
    });

    const codigo = document.createElement("span");
    codigo.classList.add("color-codigo");
    codigo.textContent = formatearColor(color, formato);

    card.appendChild(botonBloquear);
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

  paletaActual = generarPaleta(cantidad, paletaActual);
  renderizarPaleta(paletaActual, formato);
  mostrarFeedback("Paleta generada");
});

function copiarAlPortapapeles(hex) {
  navigator.clipboard.writeText(hex)
    .then(() => mostrarFeedback(`Copiado: ${hex}`))
    .catch(() => mostrarFeedback("No se pudo copiar el color"));
}

