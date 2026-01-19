import {
  Runtime,
  Inspector,
} from "https://cdn.jsdelivr.net/npm/@observablehq/runtime@5/dist/runtime.js";

import define from "https://api.observablehq.com/@data-vis29/visualizacoes-trabalho@1133.js?v=4";

const runtime = new Runtime();

const main = runtime.module(define, (name) => {
  if (name === "viewof selecaoMapa") {
    return new Inspector(document.querySelector("#map-target"));
  }
  if (name === "viewof ranking") {
    return new Inspector(document.querySelector("#ranking-target"));
  }

  if (name === "viewof serieTemporal") {
    return new Inspector(document.querySelector("#time-series-target"));
  }

  if (name === "viewof graficoPizzaFinal") {
    return new Inspector(document.querySelector("#graph-pizza-target"));
  }

  if (name === "viewof anoScatter") {
    return new Inspector(document.querySelector("#scatter-year"));
  }

  if (name === "viewof eixoX") {
    return new Inspector(document.querySelector("#scatter-x"));
  }

  if (name === "viewof eixoY") {
    return new Inspector(document.querySelector("#scatter-y"));
  }

  if (name === "viewof scatter") {
    return new Inspector(document.querySelector("#scatter-target"));
  }

  if (name === "viewof anoSelecionado" || name === "viewof metrica") {
    return true;
  }

  if (name === "viewof paisFocado") {
    return new Inspector(document.querySelector("#pais-control-target"));
  }

  if (name === "viewof mapainseguranca")
    return new Inspector(document.querySelector("#mapa-brasil-target"));

  if (name === "viewof insegurancatemporal")
    return new Inspector(document.querySelector("#brasil-temporal-target"));

  if (name === "viewof distribuicao")
    return new Inspector(document.querySelector("#brasil-distribuicao-target"));

  if (name === "viewof composicao")
    return new Inspector(document.querySelector("#brasil-composicao-target"));

  if (name === "limitesAno") {
    return {
      fulfilled: (value) => {
        const slider = document.querySelector("#input-ano");
        const display = document.querySelector("#ano-valor");
        slider.min = value.min;
        slider.max = value.max;

        let anoAtual = Number(slider.value);

        if (anoAtual > value.max) {
          slider.value = value.max;
          anoAtual = value.max;
        } else if (anoAtual < value.min) {
          slider.value = value.min;
          anoAtual = value.min;
        }

        display.textContent = anoAtual;
        atualizarTitulosAno(anoAtual);
        main.redefine("anoSelecionado", anoAtual);
      },
    };
  }

  return true;
});
const nomesMetricas = {
  "Prevalence of unaffordability (PUA), percent":
    "Prevalência de Inacessibilidade (PUA) - %",
  "Number of people unable to afford a healthy diet (NUA), million":
    "Pessoas sem Acesso (Milhões)",
  "Cost of a healthy diet (CoHD), PPP dollar per person per day":
    "Custo da Dieta Saudável (CoHD) - Dólar PPP",
  "Cost of animal source foods, PPP dollar per person per day":
    "Custo: Alimentos de Origem Animal - Dólar PPP",
  "Cost of fruits, PPP dollar per person per day": "Custo: Frutas - Dólar PPP",
  "Cost of vegetables, PPP dollar per person per day":
    "Custo: Vegetais e Hortaliças - Dólar PPP",
  "Cost of starchy staples, PPP dollar per person per day":
    "Custo: Amidos e Féculas (Starchy Staples) - Dólar PPP",
  "Cost of oils and fats, PPP dollar per person per day":
    "Custo: Óleos e Gorduras - Dólar PPP",
  "Cost of legumes, nuts and seeds, PPP dollar per person per day":
    "Custo: Leguminosas, Nozes e Sementes - Dólar PPP",
};

const anoInput = document.querySelector("#input-ano");
const anoDisplay = document.querySelector("#ano-valor");
const metricaInput = document.querySelector("#input-metrica");
const spansAno = document.querySelectorAll(".lbl-ano");
const tituloMetrica = document.querySelector("#lbl-titulo-metrica");

function atualizarTitulosAno(ano) {
  anoDisplay.textContent = ano;

  spansAno.forEach((span) => {
    span.textContent = ano;
  });
}

anoInput.addEventListener("input", (event) => {
  const valor = Number(event.target.value);

  atualizarTitulosAno(valor);

  main.redefine("anoSelecionado", valor);
});

metricaInput.addEventListener("change", (event) => {
  const valorRaw = event.target.value;

  tituloMetrica.textContent = nomesMetricas[valorRaw] || "Indicador";

  main.redefine("metrica", valorRaw);
});

main.value("paisFocado").then((paisInicial) => {
  document.querySelector("#lbl-pais-atual").textContent = paisInicial || "País";
});

atualizarTitulosAno(anoInput.value);
tituloMetrica.textContent = nomesMetricas[metricaInput.value];

const tabButtons = document.querySelectorAll(".tab-btn");
const views = document.querySelectorAll(".view-section");
const globalControls = document.getElementById("global-controls");

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.dataset.target;

    tabButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    views.forEach((view) => {
      view.style.display = "none";
    });
    document.getElementById(targetId).style.display = "flex";

    if (targetId === "view-brasil") {
      globalControls.style.display = "none";
    } else {
      globalControls.style.display = "flex";
    }
  });
});

const sliderAno = document.querySelector("#input-ano");
const displayAno = document.querySelector("#ano-valor");

sliderAno.addEventListener("input", (event) => {
  const valor = Number(event.target.value);
  displayAno.textContent = valor;
  atualizarTitulosAno(valor);

  main.redefine("anoSelecionado", valor);
});
