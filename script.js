/* =========================================================
ONDA LIVRE
PLAYER + AUTOPLAY + EVANGELIZAÇÃO
========================================================= */

/* =========================================================
CONFIGURAÇÃO
========================================================= */

const STREAM_URL =
"https://archive.org/download/futuro-do-homem-e-o-final-dos-tempos_202609/Futuro%20do%20homem%20e%20o%20final%20dos%20tempos.mp3";

const VOLUME_INICIAL = 1.0;

/* =========================================================
PLAYLIST
Posteriormente você poderá colocar os 500 MP3 aqui.
========================================================= */

const playlist = [


{
    title: "Futuro do homem e o final dos tempos",
    artist: "Onda Livre",
    url: STREAM_URL
}


];

/* =========================================================
VARIÁVEIS
========================================================= */

let currentIndex = 0;

let shuffleEnabled = false;

let autoplayTentado = false;

let primeiroCliqueAtivado = false;

/* =========================================================
ELEMENTOS
========================================================= */

const audio =
document.getElementById("audio");

const playBtn =
document.getElementById("playBtn");

const playIcon =
document.getElementById("playIcon");

const heroPlayBtn =
document.getElementById("heroPlayBtn");

const volume =
document.getElementById("volume");

const prevBtn =
document.getElementById("prevBtn");

const nextBtn =
document.getElementById("nextBtn");

const shuffleBtn =
document.getElementById("shuffleBtn");

const trackTitle =
document.getElementById("trackTitle");

const trackArtist =
document.getElementById("trackArtist");

const bottomPlayBtn =
document.getElementById("bottomPlayBtn");

const bottomPlayIcon =
document.getElementById("bottomPlayIcon");

const bottomPrevBtn =
document.getElementById("bottomPrevBtn");

const bottomNextBtn =
document.getElementById("bottomNextBtn");

const bottomTrackTitle =
document.getElementById("bottomTrackTitle");

const bottomTrackArtist =
document.getElementById("bottomTrackArtist");

const requestForm =
document.getElementById("requestForm");

const requestStatus =
document.getElementById("requestStatus");

/* =========================================================
VERIFICAÇÃO
========================================================= */

if (!audio) {


console.error(
    "Onda Livre: elemento #audio não encontrado."
);


}

/* =========================================================
CONFIGURAÇÃO INICIAL DO ÁUDIO
========================================================= */

function configurarAudio() {


audio.autoplay = true;

audio.muted = false;

audio.volume = VOLUME_INICIAL;

audio.playsInline = true;

volume.value = VOLUME_INICIAL;


}

/* =========================================================
CARREGAR MÚSICA
========================================================= */

function carregarMusica(index, tocar = false) {


if (!playlist.length) {
    return;
}

if (index < 0) {
    index = playlist.length - 1;
}

if (index >= playlist.length) {
    index = 0;
}

currentIndex = index;

const musica =
    playlist[currentIndex];

audio.src = musica.url;

audio.load();

atualizarInformacoes();

if (tocar) {

    iniciarAudio();

}


}

/* =========================================================
ATUALIZAR INFORMAÇÕES
========================================================= */

function atualizarInformacoes() {


const musica =
    playlist[currentIndex];

if (!musica) {
    return;
}

if (trackTitle) {

    trackTitle.textContent =
        musica.title || "Onda Livre";

}

if (trackArtist) {

    trackArtist.textContent =
        musica.artist || "Onda Livre";

}

if (bottomTrackTitle) {

    bottomTrackTitle.textContent =
        musica.title || "Onda Livre";

}

if (bottomTrackArtist) {

    bottomTrackArtist.textContent =
        musica.artist || "Onda Livre";

}


}

/* =========================================================
INICIAR ÁUDIO
========================================================= */

async function iniciarAudio() {


if (!audio) {
    return false;
}

try {

    audio.muted = false;

    audio.volume =
        Number(volume?.value || VOLUME_INICIAL);

    const promessa =
        audio.play();

    if (promessa !== undefined) {

        await promessa;

    }

    atualizarBotoes(true);

    removerDetectorPrimeiroClique();

    return true;

} catch (erro) {

    console.log(
        "O navegador bloqueou o autoplay:",
        erro
    );

    atualizarBotoes(false);

    return false;

}


}

/* =========================================================
TENTAR AUTOPLAY
========================================================= */

function tentarAutoplay() {


if (autoplayTentado) {
    return;
}

autoplayTentado = true;

configurarAudio();

iniciarAudio();


}

/* =========================================================
PRIMEIRA INTERAÇÃO
========================================================= */

function ativarNoPrimeiroClique(evento) {


if (primeiroCliqueAtivado) {
    return;
}

primeiroCliqueAtivado = true;

iniciarAudio();


}

/* =========================================================
DETECTOR DE PRIMEIRO CLIQUE
========================================================= */

function adicionarDetectorPrimeiroClique() {


document.addEventListener(
    "click",
    ativarNoPrimeiroClique,
    {
        capture: true,
        passive: true
    }
);

document.addEventListener(
    "touchstart",
    ativarNoPrimeiroClique,
    {
        capture: true,
        passive: true
    }
);


}

/* =========================================================
REMOVER DETECTOR
========================================================= */

function removerDetectorPrimeiroClique() {


document.removeEventListener(
    "click",
    ativarNoPrimeiroClique,
    true
);

document.removeEventListener(
    "touchstart",
    ativarNoPrimeiroClique,
    true
);


}

/* =========================================================
ATUALIZAR BOTÕES
========================================================= */

function atualizarBotoes(tocando) {


if (playIcon) {

    playIcon.textContent =
        tocando ? "❚❚" : "▶";

}

if (bottomPlayIcon) {

    bottomPlayIcon.textContent =
        tocando ? "❚❚" : "▶";

}

if (playBtn) {

    playBtn.setAttribute(
        "aria-label",
        tocando
            ? "Pausar"
            : "Reproduzir"
    );

}

if (bottomPlayBtn) {

    bottomPlayBtn.setAttribute(
        "aria-label",
        tocando
            ? "Pausar"
            : "Reproduzir"
    );

}


}

/* =========================================================
PLAY / PAUSE
========================================================= */

function alternarPlay() {


if (audio.paused) {

    iniciarAudio();

} else {

    audio.pause();

    atualizarBotoes(false);

}


}

/* =========================================================
PRÓXIMA
========================================================= */

function proximaMusica() {


if (!playlist.length) {
    return;
}

if (shuffleEnabled && playlist.length > 1) {

    let novoIndex;

    do {

        novoIndex =
            Math.floor(
                Math.random() *
                playlist.length
            );

    } while (
        novoIndex === currentIndex
    );

    currentIndex = novoIndex;

} else {

    currentIndex++;

    if (
        currentIndex >= playlist.length
    ) {

        currentIndex = 0;

    }

}

carregarMusica(
    currentIndex,
    true
);


}

/* =========================================================
MÚSICA ANTERIOR
========================================================= */

function musicaAnterior() {


if (!playlist.length) {
    return;
}

if (audio.currentTime > 5) {

    audio.currentTime = 0;

    return;

}

currentIndex--;

if (currentIndex < 0) {

    currentIndex =
        playlist.length - 1;

}

carregarMusica(
    currentIndex,
    true
);


}

/* =========================================================
EVENTOS DOS BOTÕES
========================================================= */

if (playBtn) {


playBtn.addEventListener(
    "click",
    alternarPlay
);


}

if (bottomPlayBtn) {


bottomPlayBtn.addEventListener(
    "click",
    alternarPlay
);


}

if (heroPlayBtn) {


heroPlayBtn.addEventListener(
    "click",
    iniciarAudio
);


}

if (prevBtn) {


prevBtn.addEventListener(
    "click",
    musicaAnterior
);


}

if (bottomPrevBtn) {


bottomPrevBtn.addEventListener(
    "click",
    musicaAnterior
);


}

if (nextBtn) {


nextBtn.addEventListener(
    "click",
    proximaMusica
);


}

if (bottomNextBtn) {


bottomNextBtn.addEventListener(
    "click",
    proximaMusica
);


}

/* =========================================================
ALEATÓRIO
========================================================= */

if (shuffleBtn) {


shuffleBtn.addEventListener(
    "click",
    () => {

        shuffleEnabled =
            !shuffleEnabled;

        shuffleBtn.style.opacity =
            shuffleEnabled
                ? "1"
                : "0.55";

        shuffleBtn.title =
            shuffleEnabled
                ? "Aleatório ativado"
                : "Aleatório desativado";

    }
);


}

/* =========================================================
VOLUME
========================================================= */

if (volume) {


volume.addEventListener(
    "input",
    () => {

        audio.volume =
            Number(volume.value);

        if (
            audio.paused &&
            Number(volume.value) > 0
        ) {

            iniciarAudio();

        }

    }
);


}

/* =========================================================
EVENTOS DO ÁUDIO
========================================================= */

audio.addEventListener(
"play",
() => {


    atualizarBotoes(true);

}


);

audio.addEventListener(
"pause",
() => {


    atualizarBotoes(false);

}


);

audio.addEventListener(
"ended",
() => {


    proximaMusica();

}


);

audio.addEventListener(
"error",
() => {


    console.error(
        "Erro ao carregar o áudio."
    );

    atualizarBotoes(false);

}


);

/* =========================================================
PRIMEIRO CLIQUE
========================================================= */

adicionarDetectorPrimeiroClique();

/* =========================================================
CARREGAMENTO INICIAL
========================================================= */

document.addEventListener(
"DOMContentLoaded",
() => {


    configurarAudio();

    carregarMusica(
        0,
        false
    );

    setTimeout(
        tentarAutoplay,
        150
    );

}


);

/* =========================================================
FORMULÁRIO DE ORAÇÃO
========================================================= */

if (requestForm) {


requestForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        const nome =
            document
                .getElementById("reqName")
                ?.value
                .trim();

        const assunto =
            document
                .getElementById("reqSong")
                ?.value
                .trim();

        const mensagem =
            document
                .getElementById("reqMessage")
                ?.value
                .trim();

        if (
            !nome ||
            !assunto ||
            !mensagem
        ) {

            requestStatus.textContent =
                "Preencha todos os campos.";

            return;

        }

        /*
         * Neste momento o formulário funciona
         * localmente.
         *
         * Posteriormente podemos conectar este
         * formulário ao Google Sheets / Apps Script
         * para armazenar os pedidos de oração.
         */

        requestStatus.textContent =
            "Seu pedido foi preparado com carinho. Deus abençoe você!";

        requestForm.reset();

    }
);


}

/* =========================================================
ATALHO DE TECLADO
Espaço = Play / Pause
========================================================= */

document.addEventListener(
"keydown",
(event) => {


    const elemento =
        event.target;

    const digitando =
        elemento &&
        (
            elemento.tagName === "INPUT" ||
            elemento.tagName === "TEXTAREA"
        );

    if (digitando) {
        return;
    }

    if (event.code === "Space") {

        event.preventDefault();

        alternarPlay();

    }

}


);

/* =========================================================
BOTÕES "OUVIR AGORA" DOS CARDS
========================================================= */

document
.querySelectorAll(
"[data-play-index]"
)
.forEach(
(botao) => {


        botao.addEventListener(
            "click",
            () => {

                const index =
                    Number(
                        botao.dataset.playIndex
                    );

                carregarMusica(
                    index,
                    true
                );

                const player =
                    document.querySelector(
                        ".listen-section"
                    );

                if (player) {

                    player.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                }

            }
        );

    }
);


/* =========================================================
GARANTIR VOLUME
========================================================= */

window.addEventListener(
"load",
() => {


    audio.volume =
        VOLUME_INICIAL;

    if (volume) {

        volume.value =
            VOLUME_INICIAL;

    }

}


);

/* =========================================================
FINAL
========================================================= */

console.log(
"Onda Livre carregada."
);

console.log(
"Tentando iniciar o áudio automaticamente..."
);
