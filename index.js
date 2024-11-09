const convertButton = document.querySelector(".convert-button");
const currencySelectToConvert = document.querySelector(".currency-select-to-convert");
const currencySelectConverted = document.querySelector(".currency-select-converted");

document.body.style.backgroundImage = "url('assets/dolar-fundo.png')"; // Fundo inicial padrão

// Função para buscar a taxa de câmbio da API do Banco Central
async function getExchangeRate(currencyCode) {
    try {
        const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${currencyCode}/dados?formato=application/json`;
        const response = await fetch(url);
        const data = await response.json();

        // Retorna a taxa de câmbio mais recente (último valor)
        return parseFloat(data[data.length - 1].valor);
    } catch (error) {
        console.error("Erro ao buscar taxa de câmbio: ", error);
        return null; // Se houver erro, retorna null
    }
}

// Função para realizar a conversão de moedas
async function convertValues() {
    // Exibe a tela de carregando
    document.getElementById("loading-overlay").style.display = "flex";

    // Pega o valor de entrada e remove qualquer formatação não numérica
    const inputCurrencyValue = parseFloat(
        document.querySelector(".input-currency").value
            .replace("R$", "")          // Remove o símbolo 'R$'
            .replace(".", "")           // Remove pontos (se existir)
            .replace(",", ".")          // Substitui vírgula por ponto
    ); 

    // Garantir que o valor seja um número válido
    if (isNaN(inputCurrencyValue)) {
        alert("Por favor, insira um valor válido.");
        document.getElementById("loading-overlay").style.display = "none";  // Esconde o "Carregando" no caso de erro
        return;
    }

    const currencyValueToConvert = document.querySelector(".currency-value-to-convert");
    const currencyValueConverted = document.querySelector(".currency-value");

    // Taxas fixas para as conversões
    const dolarToday = await getExchangeRate(1); // Dólar - Código 1
    // Ajustes manuais para Euro, Libra Esterlina e Iene Japonês com base nos valores que você pediu
    const euroToday = 6.15; // R$1.000 = 162,50 EUR -> 1000 / 162.50 = 6.15
    const librasToday = 7.41; // R$1.000 = 134,90 GBP -> 1000 / 134.90 = 7.41
    const ieneToday = 0.0375; // Correção: R$1.000 = 26.601,79 JPY -> 1000 / 26.601.79 = 0.0375

    if (!dolarToday) {
        alert("Erro ao carregar taxas de câmbio.");
        document.getElementById("loading-overlay").style.display = "none";  // Esconde o "Carregando" no caso de erro
        return;
    }

    // Determinar o fundo de acordo com a moeda convertida
    let backgroundImageUrl = "";
    let convertedValue = "";

    switch (currencySelectConverted.value) {
        case "dolar":
            convertedValue = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD"
            }).format(inputCurrencyValue / dolarToday); // Dólar: dividir pelo valor da taxa de câmbio
            backgroundImageUrl = "url('assets/dolar-fundo.png')";
            break;
        case "euro":
            convertedValue = new Intl.NumberFormat("de-DE", {
                style: "currency",
                currency: "EUR"
            }).format(inputCurrencyValue / euroToday); // Euro: dividir pelo valor da taxa fixa
            backgroundImageUrl = "url('assets/euro-fundo.png')";
            break;
        case "libras":
            convertedValue = new Intl.NumberFormat("en-GB", {
                style: "currency",
                currency: "GBP"
            }).format(inputCurrencyValue / librasToday); // Libras: dividir pelo valor da taxa fixa
            backgroundImageUrl = "url('assets/libras-fundo.webp')";
            break;
        case "ienejp":
            convertedValue = new Intl.NumberFormat("ja-JP", {
                style: "currency",
                currency: "JPY"
            }).format(inputCurrencyValue / ieneToday); // Iene Japonês, mas mantendo a nomenclatura de Bitcoin
            backgroundImageUrl = "url('assets/fundo-iene.png')";
            break;
        case "real":
            convertedValue = new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL"
            }).format(inputCurrencyValue); // No caso de REAL, não há conversão
            backgroundImageUrl = "url('assets/real-fundo.png')";
            break;
        default:
            convertedValue = "Valor inválido";
            backgroundImageUrl = "url('assets/default-fundo.png')";
            break;
    }

    // Atualiza o valor convertido e o fundo da página
    currencyValueConverted.innerHTML = convertedValue;
    document.body.style.backgroundImage = backgroundImageUrl;

    // Atualiza o valor na caixa de moeda a ser convertida
    switch (currencySelectToConvert.value) {
        case "real":
            currencyValueToConvert.innerHTML = new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL"
            }).format(inputCurrencyValue);
            break;
        case "dolar":
            currencyValueToConvert.innerHTML = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD"
            }).format(inputCurrencyValue);
            break;
        case "euro":
            currencyValueToConvert.innerHTML = new Intl.NumberFormat("de-DE", {
                style: "currency",
                currency: "EUR"
            }).format(inputCurrencyValue);
            break;
        case "libras":
            currencyValueToConvert.innerHTML = new Intl.NumberFormat("en-GB", {
                style: "currency",
                currency: "GBP"
            }).format(inputCurrencyValue);
            break;
        case "ienejp":
            currencyValueToConvert.innerHTML = new Intl.NumberFormat("ja-JP", {
                style: "currency",
                currency: "JPY"
            }).format(inputCurrencyValue);
            break;
            
        default:
            currencyValueToConvert.innerHTML = "Selecione uma moeda";
            break;
    }

    // Esconde o overlay de carregando após a conversão
    document.getElementById("loading-overlay").style.display = "none";
}


// Função para mudar a moeda selecionada
function changeCurrency() {
    const currencyName = document.getElementById("currency-name");
    const currencyImage = document.querySelector(".logo-moeda-convertida");

    // Muda o nome e a imagem da moeda convertida
    switch (currencySelectConverted.value) {
        case "dolar":
            currencyName.innerHTML = "Dólar Americano";
            currencyImage.src = "./assets/logo-dolar.png";
            break;
        case "euro":
            currencyName.innerHTML = "Euro";
            currencyImage.src = "./assets/logo-europeu.png";
            break;
        case "libras":
            currencyName.innerHTML = "Libras Esterlinas";
            currencyImage.src = "./assets/logo-reino-unido.png";
            break;
        case "ienejp":
            currencyName.innerHTML = "Iene Japonês";
            currencyImage.src = "./assets/logo-iene.png";
            break;
        case "real":
            currencyName.innerHTML = "Real Brasileiro";
            currencyImage.src = "./assets/logo-R-br.png";
            break;
        default:
            currencyName.innerHTML = "Moeda não identificada";
            currencyImage.src = "./assets/logo-default.png";
            break;
    }

    // Chama a função de conversão ao mudar a moeda
    convertValues();
}

// Função para mudar a moeda a ser convertida
function changeCurrencyTop() {
    const currencyTopName = document.getElementById("currency-top-name");
    const currencyTopImage = document.querySelector(".logo-moeda-a-converter");

    // Muda o nome e a imagem da moeda a ser convertida
    switch (currencySelectToConvert.value) {
        case "dolar":
            currencyTopName.innerHTML = "Dólar Americano";
            currencyTopImage.src = "./assets/logo-dolar.png";
            break;
        case "euro":
            currencyTopName.innerHTML = "Euro";
            currencyTopImage.src = "./assets/logo-europeu.png";
            break;
        case "libras":
            currencyTopName.innerHTML = "Libras Esterlinas";
            currencyTopImage.src = "./assets/logo-reino-unido.png";
            break;
        case "ienejp":
            currencyTopName.innerHTML = "Iene Japonês";
            currencyTopImage.src = "./assets/logo-iene.png";
            break;
        case "real":
            currencyTopName.innerHTML = "Real Brasileiro";
            currencyTopImage.src = "./assets/logo-R-br.png";
            break;
        default:
            currencyTopName.innerHTML = "Moeda não identificada";
            currencyTopImage.src = "./assets/logo-default.png";
            break;
    }

    // Chama a função de conversão ao mudar a moeda
    convertValues();
}

const inputCurrency = document.querySelector(".input-currency");

// Define o valor inicial
inputCurrency.value = "R$10.000,00";

// Adiciona o evento para apagar o valor quando o usuário clicar no campo
inputCurrency.addEventListener("focus", function() {
    // Verifica se o valor é o valor inicial e apaga
    if (inputCurrency.value === "R$10.000,00") {
        inputCurrency.value = "";
    }
});

// Se o campo ficar vazio, coloca o valor de volta (caso o usuário não tenha inserido nada)
inputCurrency.addEventListener("blur", function() {
    if (inputCurrency.value === "") {
        inputCurrency.value = "R$10.000,00";
    }
});

// Adiciona os eventos de mudança
currencySelectConverted.addEventListener("change", changeCurrency);
currencySelectToConvert.addEventListener("change", changeCurrencyTop);
convertButton.addEventListener("click", convertValues);
