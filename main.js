import {
  Runtime,
  Inspector,
} from "https://cdn.jsdelivr.net/npm/@observablehq/runtime@5/dist/runtime.js";

import define from "https://api.observablehq.com/@data-vis29/visualizacoes-trabalho@1067.js?v=4";

const runtime = new Runtime();

const main = runtime.module(define, (name) => {
  // 1. O MAPA (Se ele ainda existir com esse nome no notebook novo)
  if (name === "viewof selecaoMapa") {
    return new Inspector(document.querySelector("#map-target"));
  }

  // 2. O RANKING (Novo!)
  if (name === "viewof ranking") {
    return new Inspector(document.querySelector("#ranking-target"));
  }

  // 3. A SÉRIE TEMPORAL (Novo!)
  if (name === "viewof serieTemporal") {
    return new Inspector(document.querySelector("#time-series-target"));
  }

  if (name === "viewof graficoPizzaFinal") {
    return new Inspector(document.querySelector("#graph-pizza-target"));
  }

  if (name === "viewof anoScatter") {
    return new Inspector(document.querySelector("#scatter-year"));
  }

  // 2. Seletor Eixo X
  if (name === "viewof eixoX") {
    return new Inspector(document.querySelector("#scatter-x"));
  }

  // 3. Seletor Eixo Y
  if (name === "viewof eixoY") {
    return new Inspector(document.querySelector("#scatter-y"));
  }

  // 4. O Gráfico em si
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

  // 2. Série Temporal
  if (name === "viewof insegurancatemporal")
    return new Inspector(document.querySelector("#brasil-temporal-target"));

  // 3. Distribuição
  if (name === "viewof distribuicao")
    return new Inspector(document.querySelector("#brasil-distribuicao-target"));

  // 4. Composição
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
      }
    };}

  // Esconde o resto
  return true;
});
const nomesMetricas = {
  "Prevalence of unaffordability (PUA), percent": "Prevalência de Inacessibilidade (PUA) - %",
  "Number of people unable to afford a healthy diet (NUA), million": "Pessoas sem Acesso (Milhões)",
  "Cost of a healthy diet (CoHD), PPP dollar per person per day": "Custo da Dieta Saudável (CoHD) - Dólar PPP",
  "Cost of animal source foods, PPP dollar per person per day": "Custo: Alimentos de Origem Animal - Dólar PPP",
  "Cost of fruits, PPP dollar per person per day": "Custo: Frutas - Dólar PPP",
  "Cost of vegetables, PPP dollar per person per day": "Custo: Vegetais e Hortaliças - Dólar PPP",
  "Cost of starchy staples, PPP dollar per person per day": "Custo: Amidos e Féculas (Starchy Staples) - Dólar PPP",
  "Cost of oils and fats, PPP dollar per person per day": "Custo: Óleos e Gorduras - Dólar PPP",
  "Cost of legumes, nuts and seeds, PPP dollar per person per day": "Custo: Leguminosas, Nozes e Sementes - Dólar PPP"
};

// Elementos do DOM
const anoInput = document.querySelector("#input-ano");
const anoDisplay = document.querySelector("#ano-valor"); // O texto ao lado do slider
const metricaInput = document.querySelector("#input-metrica");
const spansAno = document.querySelectorAll(".lbl-ano"); // Todos os spans de ano nos títulos
const tituloMetrica = document.querySelector("#lbl-titulo-metrica"); // Título do Mapa Global

// --- FUNÇÃO PARA ATUALIZAR TODOS OS TÍTULOS DE ANO ---
function atualizarTitulosAno(ano) {
  // Atualiza o texto pequeno ao lado do input
  anoDisplay.textContent = ano;
  
  // Atualiza todos os títulos dos gráficos (Global e Brasil)
  spansAno.forEach(span => {
    span.textContent = ano;
  });
}

// --- EVENTO: MUDANÇA DE ANO ---
anoInput.addEventListener("input", (event) => {
  const valor = Number(event.target.value);
  
  // 1. Atualiza visual (HTML)
  atualizarTitulosAno(valor);

  // 2. Atualiza dados (Observable)
  main.redefine("anoSelecionado", valor);
});

// --- EVENTO: MUDANÇA DE MÉTRICA ---
metricaInput.addEventListener("change", (event) => {
  const valorRaw = event.target.value;
  
  // 1. Atualiza visual (HTML) - Pega o nome bonito do dicionário ou usa o original se falhar
  tituloMetrica.textContent = nomesMetricas[valorRaw] || "Indicador";

  // 2. Atualiza dados (Observable)
  main.redefine("metrica", valorRaw);
});

// --- CAPTURAR O NOME DO PAÍS SELECIONADO (Avançado) ---
// Como o seletor de país é feito dentro do Observable ("viewof paisFocado"),
// precisamos "escutar" a mudança dele para atualizar o título do HTML.
main.value("paisFocado").then(paisInicial => {
    document.querySelector("#lbl-pais-atual").textContent = paisInicial || "País";
});

// Para ouvir mudanças contínuas do país (caso queira o título dinâmico):
// Isso exige que você tenha uma célula no observable retornando apenas o valor do país
// Exemplo: no notebook, crie uma célula chamada `paisAtualTexto = paisFocado`
// E aqui no JS use:
/*
if (name === "paisFocado") {
   return new Inspector(document.querySelector("#pais-control-target"));
}
// Se quiser pegar o valor para o título:
if (name === "paisFocado") {
    return {
        fulfilled: (value) => { 
             // O Inspector padrão desenha o dropdown
             new Inspector(document.querySelector("#pais-control-target")).fulfilled(value);
             // E aqui atualizamos o título
             document.querySelector("#lbl-pais-atual").textContent = value;
        }
    };
} 
*/

// --- INICIALIZAÇÃO ---
// Garante que os títulos estejam corretos ao carregar a página
atualizarTitulosAno(anoInput.value);
tituloMetrica.textContent = nomesMetricas[metricaInput.value];

// --- CONTROLE DE ABAS (MANTIDO) ---
const tabButtons = document.querySelectorAll(".tab-btn");
const views = document.querySelectorAll(".view-section");
const globalControls = document.getElementById("global-controls");

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.dataset.target;

    // ativa botão
    tabButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    // troca views
    views.forEach((view) => {
      view.style.display = "none";
    });
    document.getElementById(targetId).style.display = "block";

    // 🔥 MOSTRA / ESCONDE FILTROS
    if (targetId === "view-brasil") {
      globalControls.style.display = "none";
    } else {
      globalControls.style.display = "block";
    }
  });
});

// Referências
const sliderAno = document.querySelector("#input-ano");
const displayAno = document.querySelector("#ano-valor");

sliderAno.addEventListener("input", (event) => {
  const valor = Number(event.target.value);

  // 1. Atualiza Visual
  displayAno.textContent = valor;
  atualizarTitulosAno(valor); // Função dos títulos que criamos antes

  // 2. Manda para o Observable
  main.redefine("anoSelecionado", valor);
});