/* =========================================
   Lógica do jogo
========================================= */

// =========================================
// 1. AS PISTAS DO JOGO
// =========================================
// O jogo aceita letras maiúsculas e minúsculas e ignora acentos.

const enigmas = [
    {
        titulo: "A primeira pista",
        icone: "📜",
        pergunta:
            "Não posso ser tocado, mas posso ser sentido. " +
            "Cresço com confiança e torno momentos simples inesquecíveis. " +
            "O que sou?",
        resposta: "amor",
        dica: "É algo muito especial que existe entre amigas(o)."
    },
    {
        titulo: "Segunda pista",
        icone: "🗝️",
        pergunta:
          "Há bilhões de pessoas nesse mundo e há vários planetas nesta galáxia, e eu tive uma grande sorte de encontrar alguém tão incrível e especial que mudou a minha vida e me tornou a pessoa mais feliz desse mundo e esse alguém é você minha---☺️😘❤️ qual é a palavra que está faltando??",
        resposta: "bebezinha",
        dica: "É uma palavra que eu sempre falo. 💜"
    },
    {
        titulo: "A última chave",
        icone: "🔮",
        pergunta:
            "Há algo que ainda não foi revelado. " +
            "Pode ser guardado em silêncio, escondido numa carta " +
            "e descoberto quando chega a hora certa. O que é?",
        resposta: "Um mistério",
        dica: "É aquilo que você está tentando descobrir nesta aventura."
    }
];

// =========================================
// 2. ASSINATURA DA CARTA
// =========================================
// Mantido em conformidade com o seu texto do HTML
const assinaturaFinal = "Com carinho, Larissa miriele ☺️❤️💜";

// =========================================
// 3. ELEMENTOS DA PÁGINA
// =========================================

const inicio = document.getElementById("inicio");
const jogo = document.getElementById("jogo");
const tesouro = document.getElementById("tesouro");

const btnComecar = document.getElementById("btnComecar");
const btnDica = document.getElementById("btnDica");
const btnAbrirCarta = document.getElementById("btnAbrirCarta");

const numeroFase = document.getElementById("numeroFase");
const chaves = document.getElementById("chaves");
const progresso = document.getElementById("progresso");

const iconeEnigma = document.getElementById("iconeEnigma");
const tituloEnigma = document.getElementById("tituloEnigma");
const textoEnigma = document.getElementById("textoEnigma");

const formResposta = document.getElementById("formResposta");
const respostaInput = document.getElementById("resposta");
const mensagem = document.getElementById("mensagem");
const dica = document.getElementById("dica");

const carta = document.getElementById("carta");
const assinatura = document.getElementById("assinatura");

// =========================================
// 4. ESTADO DO JOGO
// =========================================

let faseAtual = 0;
let totalChaves = 0;
let faseConcluida = false;

// =========================================
// 5. FUNÇÕES AUXILIARES
// =========================================

function mostrarTela(telaEscolhida) {
    [inicio, jogo, tesouro].forEach(function(tela) {
        tela.classList.remove("ativa");
    });

    telaEscolhida.classList.add("ativa");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function normalizar(texto) {
    return texto
        .trim()
        .toLocaleLowerCase("pt-BR")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ");
}

function atualizarProgresso() {
    numeroFase.textContent =
        `ENIGMA ${String(faseAtual + 1).padStart(2, "0")} DE 03`;

    chaves.textContent = `🔑 ${totalChaves}/3`;

    progresso.style.width = `${(totalChaves / 3) * 100}%`;
}

// =========================================
// 6. CARREGAR UMA FASE
// =========================================

function carregarEnigma() {
    const enigma = enigmas[faseAtual];

    faseConcluida = false;

    atualizarProgresso();

    iconeEnigma.textContent = enigma.icone;
    tituloEnigma.textContent = enigma.titulo;
    textoEnigma.textContent = enigma.pergunta;

    respostaInput.value = "";
    respostaInput.disabled = false;

    mensagem.textContent = "";
    mensagem.className = "mensagem";

    dica.textContent = "";
    dica.hidden = true;

    btnDica.disabled = false;
    formResposta.querySelector("button[type='submit']").disabled = false;

    mostrarTela(jogo);

    respostaInput.focus({ preventScroll: true });
}

// =========================================
// 7. INICIAR A AVENTURA
// =========================================

btnComecar.addEventListener("click", function() {
    faseAtual = 0;
    totalChaves = 0;

    carregarEnigma();
});

// =========================================
// 8. CONFERIR AS RESPOSTAS
// =========================================

formResposta.addEventListener("submit", function(event) {
    event.preventDefault();

    if (faseConcluida) {
        return;
    }

    const respostaUsuario = normalizar(respostaInput.value);
    const respostaCorreta = normalizar(enigmas[faseAtual].resposta);

    if (!respostaUsuario) {
        mensagem.textContent = "Digite uma resposta para continuar.";
        mensagem.className = "mensagem erro";
        return;
    }

    if (respostaUsuario === respostaCorreta) {
        faseConcluida = true;
        totalChaves++;

        respostaInput.disabled = true;
        formResposta.querySelector("button[type='submit']").disabled = true;
        btnDica.disabled = true;

        mensagem.textContent =
            "✨ Resposta correta! Você encontrou uma chave!";

        mensagem.className = "mensagem sucesso";

        chaves.textContent = `🔑 ${totalChaves}/3`;
        progresso.style.width = `${(totalChaves / 3) * 100}%`;

        setTimeout(function() {
            faseAtual++;

            if (faseAtual < enigmas.length) {
                carregarEnigma();
            } else {
                abrirTesouro();
            }
        }, 1100);

    } else {
        mensagem.textContent =
            "Ainda não! Pense mais um pouquinho ou peça uma dica. 💭";

        mensagem.className = "mensagem erro";
    }
});

// =========================================
// 9. MOSTRAR UMA DICA
// =========================================

btnDica.addEventListener("click", function() {
    dica.textContent = "💡 " + enigmas[faseAtual].dica;
    dica.hidden = false;
});

// =========================================
// 10. ABRIR O TESOURO
// =========================================

function abrirTesouro() {
    progresso.style.width = "100%";
    chaves.textContent = "🔑 3/3";

    mostrarTela(tesouro);
}

// =========================================
// 11. REVELAR A CARTA
// =========================================

btnAbrirCarta.addEventListener("click", function() {
    assinatura.textContent = assinaturaFinal;

    carta.hidden = false;
    btnAbrirCarta.hidden = true;

    carta.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});
