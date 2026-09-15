/* =========================================================
DE VOLTA PARA CRISTO
PLAYER DE LOUVORES E MENSAGENS
========================================================= */

/* =========================================================
CONFIGURAÇÃO DO ÁUDIO
========================================================= */

const STREAM_URL =
"https://archive.org/download/futuro-do-homem-e-o-final-dos-tempos_202609/Futuro%20do%20homem%20e%20o%20final%20dos%20tempos.mp3";

const VOLUME_INICIAL = 1.0;

/* =========================================================
PLAYLIST
========================================================= */

const playlist = [


{
    title:
        "Futuro do homem e o final dos tempos",

    artist:
        "De Volta para Cristo",

    url:
        STREAM_URL
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

const prevBtn =
document.getElementById("prevBtn");

const nextBtn =
document.getElementById("nextBtn");

const volume =
document.getElementById("volume");

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
CONFIGURAR ÁUDIO
========================================================= */

function configurarAudio() {


audio.autoplay = true;

audio.muted = false;

audio.volume =
    VOLUME_INICIAL;

audio.playsInline = true;

if (volume) {

    volume.value =
        VOLUME_INICIAL;

}


}

/* =========================================================
CARREGAR MÚSICA
========================================================= */

function carregarMusica(
index,
tocar = false
) {


if (!playlist.length) {
    return;
}


if (index < 0) {

    index =
        playlist.length - 1;

}


if (
    index >= playlist.length
) {

    index = 0;

}


currentIndex =
    index;


const musica =
    playlist[currentIndex];


audio.src =
    musica.url;


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
        musica.title;

}


if (trackArtist) {

    trackArtist.textContent =
        musica.artist;

}


if (bottomTrackTitle) {

    bottomTrackTitle.textContent =
        musica.title;

}


if (bottomTrackArtist) {

    bottomTrackArtist.textContent =
        musica.artist;

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


    if (
        volume &&
        Number(volume.value) >= 0
    ) {

        audio.volume =
            Number(volume.value);

    } else {

        audio.volume =
            VOLUME_INICIAL;

    }


    const promessa =
        audio.play();


    if (promessa !== undefined) {

        await promessa;

    }


    atualizarBotoes(true);


    removerDetectorPrimeiroClique();


    return true;

}

catch (erro) {

    console.log(
        "Autoplay bloqueado pelo navegador."
    );


    atualizarBotoes(false);


    return false;

}


}

/* =========================================================
AUTOPLAY
========================================================= */

function tentarAutoplay() {


if (autoplayTentado) {
    return;
}


autoplayTentado =
    true;


configurarAudio();


iniciarAudio();


}

/* =========================================================
PRIMEIRO CLIQUE/TOQUE
========================================================= */

function ativarNoPrimeiroClique() {


if (primeiroCliqueAtivado) {
    return;
}


primeiroCliqueAtivado =
    true;


iniciarAudio();


}

/* =========================================================
ATIVAR DETECTOR
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

function atualizarBotoes(
tocando
) {


const simbolo =
    tocando
        ? "❚❚"
        : "▶";


if (playIcon) {

    playIcon.textContent =
        simbolo;

}


if (bottomPlayIcon) {

    bottomPlayIcon.textContent =
        simbolo;

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

}

else {

    audio.pause();

    atualizarBotoes(false);

}


}

/* =========================================================
PRÓXIMA MÚSICA
========================================================= */

function proximaMusica() {


if (!playlist.length) {
    return;
}


if (
    shuffleEnabled &&
    playlist.length > 1
) {

    let novoIndex;


    do {

        novoIndex =
            Math.floor(
                Math.random() *
                playlist.length
            );

    }

    while (
        novoIndex === currentIndex
    );


    currentIndex =
        novoIndex;

}

else {

    currentIndex++;


    if (
        currentIndex >=
        playlist.length
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


if (
    audio.currentTime > 5
) {

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
BOTÕES
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
                : ".55";


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
        "Não foi possível carregar o áudio."
    );

    atualizarBotoes(false);

}


);

/* =========================================================
CARDS DE LOUVORES
========================================================= */

document
.querySelectorAll(
"[data-play-index]"
)
.forEach(
botao => {


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
                        ".player-card"
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
FORMULÁRIO DE ORAÇÃO
========================================================= */

if (requestForm) {


requestForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const nome =
            document
                .getElementById("reqName")
                .value
                .trim();


        const assunto =
            document
                .getElementById("reqSong")
                .value
                .trim();


        const mensagem =
            document
                .getElementById("reqMessage")
                .value
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
         * Formulário preparado para futura
         * integração com Google Sheets /
         * Apps Script.
         */


        requestStatus.textContent =
            "Seu pedido foi recebido. Deus abençoe você!";


        requestForm.reset();

    }
);


}

/* =========================================================
TECLA ESPAÇO
========================================================= */

document.addEventListener(
"keydown",
event => {


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


    if (
        event.code === "Space"
    ) {

        event.preventDefault();

        alternarPlay();

    }

}


);

/* =========================================================
INICIALIZAÇÃO
========================================================= */

document.addEventListener(
"DOMContentLoaded",
() => {


    configurarAudio();


    carregarMusica(
        0,
        false
    );


    adicionarDetectorPrimeiroClique();


    setTimeout(
        tentarAutoplay,
        150
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
INFORMAÇÃO NO CONSOLE
========================================================= */

console.log(
"De Volta para Cristo carregado."
);

console.log(
"Tentando iniciar o áudio automaticamente..."
);
