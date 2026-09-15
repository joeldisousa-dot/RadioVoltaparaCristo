const STREAM_URL =
"https://archive.org/download/futuro-do-homem-e-o-final-dos-tempos_202609/Futuro%20do%20homem%20e%20o%20final%20dos%20tempos.mp3";

const VOLUME_INICIAL = 1.0;

document.addEventListener("DOMContentLoaded", () => {


const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const playIcon = document.getElementById("playIcon");
const heroPlayBtn = document.getElementById("heroPlayBtn");
const volume = document.getElementById("volume");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const onair = document.getElementById("onair");

if (!audio) {
    console.error("Elemento #audio não encontrado.");
    return;
}

/* =========================================================
   CONFIGURAÇÃO DO ÁUDIO
========================================================= */

audio.src = STREAM_URL;
audio.preload = "auto";
audio.autoplay = true;
audio.playsInline = true;

// Áudio sempre começa ligado
audio.muted = false;
audio.volume = VOLUME_INICIAL;

if (volume) {
    volume.value = VOLUME_INICIAL;
}

/* =========================================================
   CONTROLE DO BOTÃO PLAY
========================================================= */

function atualizarInterface() {

    const tocando = !audio.paused && !audio.ended;

    if (playIcon) {
        playIcon.textContent = tocando ? "❚❚" : "▶";
    }

    if (playBtn) {
        playBtn.setAttribute(
            "aria-label",
            tocando ? "Pausar" : "Reproduzir"
        );
    }

    if (onair) {
        onair.classList.toggle("active", tocando);
    }
}

/* =========================================================
   AUTOPLAY
========================================================= */

let autoplayBloqueado = false;
let aguardandoPrimeiroClique = false;

async function tentarAutoplay() {

    try {

        // Garante que não está mutado
        audio.muted = false;
        audio.volume = VOLUME_INICIAL;

        await audio.play();

        // Autoplay funcionou
        autoplayBloqueado = false;

        removerDesbloqueioClique();

        atualizarInterface();

        console.log("Áudio iniciado automaticamente.");

    } catch (erro) {

        // Chrome/navegador bloqueou o autoplay
        autoplayBloqueado = true;
        aguardandoPrimeiroClique = true;

        atualizarInterface();

        adicionarDesbloqueioClique();

        console.log(
            "Autoplay bloqueado pelo navegador. " +
            "Aguardando primeiro clique do usuário."
        );
    }
}

/* =========================================================
   PRIMEIRO CLIQUE EM QUALQUER LUGAR
   DESBLOQUEIA O ÁUDIO
========================================================= */

async function desbloquearAudio() {

    if (!autoplayBloqueado || !aguardandoPrimeiroClique) {
        return;
    }

    try {

        audio.muted = false;
        audio.volume = VOLUME_INICIAL;

        await audio.play();

        autoplayBloqueado = false;
        aguardandoPrimeiroClique = false;

        removerDesbloqueioClique();

        atualizarInterface();

        console.log("Áudio desbloqueado pelo primeiro clique.");

    } catch (erro) {

        console.error(
            "Não foi possível iniciar o áudio:",
            erro
        );
    }
}

function adicionarDesbloqueioClique() {

    if (!aguardandoPrimeiroClique) {
        return;
    }

    // Usa captura para funcionar em qualquer elemento da página
    document.addEventListener(
        "click",
        desbloquearAudio,
        true
    );
}

function removerDesbloqueioClique() {

    document.removeEventListener(
        "click",
        desbloquearAudio,
        true
    );
}

/* =========================================================
   PLAY / PAUSE
========================================================= */

async function alternarAudio() {

    if (audio.paused) {

        try {

            audio.muted = false;
            audio.volume = VOLUME_INICIAL;

            await audio.play();

        } catch (erro) {

            console.error(
                "Erro ao reproduzir o áudio:",
                erro
            );
        }

    } else {

        audio.pause();
    }

    atualizarInterface();
}

/* =========================================================
   BOTÃO PRINCIPAL
========================================================= */

if (playBtn) {

    playBtn.addEventListener("click", (event) => {

        event.stopPropagation();

        alternarAudio();

    });
}

/* =========================================================
   BOTÃO HERO
========================================================= */

if (heroPlayBtn) {

    heroPlayBtn.addEventListener("click", (event) => {

        event.stopPropagation();

        alternarAudio();

    });
}

/* =========================================================
   VOLUME
========================================================= */

if (volume) {

    volume.addEventListener("input", () => {

        audio.volume = Number(volume.value);

        // Se o usuário aumentar o volume, garante que não
        // permaneça mutado.
        if (audio.volume > 0) {
            audio.muted = false;
        }
    });
}

/* =========================================================
   ANTERIOR
========================================================= */

if (prevBtn) {

    prevBtn.addEventListener("click", (event) => {

        event.stopPropagation();

        audio.currentTime = 0;

        if (audio.paused) {
            alternarAudio();
        }
    });
}

/* =========================================================
   PRÓXIMA
========================================================= */

if (nextBtn) {

    nextBtn.addEventListener("click", (event) => {

        event.stopPropagation();

        audio.currentTime = 0;

        if (audio.paused) {
            alternarAudio();
        }
    });
}

/* =========================================================
   SHUFFLE
========================================================= */

if (shuffleBtn) {

    shuffleBtn.addEventListener("click", (event) => {

        event.stopPropagation();

        shuffleBtn.classList.toggle("active");

    });
}

/* =========================================================
   EVENTOS DO ÁUDIO
========================================================= */

audio.addEventListener("play", atualizarInterface);

audio.addEventListener("playing", () => {

    autoplayBloqueado = false;
    aguardandoPrimeiroClique = false;

    removerDesbloqueioClique();

    atualizarInterface();
});

audio.addEventListener("pause", atualizarInterface);

audio.addEventListener("ended", () => {

    atualizarInterface();

    // Como atualmente existe apenas uma música,
    // volta para o início.
    audio.currentTime = 0;
});

audio.addEventListener("canplay", () => {

    // Se o navegador ainda não deixou tocar,
    // tenta novamente quando o áudio estiver disponível.
    if (audio.paused && !autoplayBloqueado) {
        tentarAutoplay();
    }
});

audio.addEventListener("error", () => {

    console.error(
        "Erro ao carregar o áudio:",
        audio.error
    );

    atualizarInterface();
});

/* =========================================================
   TENTATIVA INICIAL
========================================================= */

// Primeira tentativa imediatamente
tentarAutoplay();

// Segunda tentativa após o carregamento inicial
setTimeout(() => {

    if (audio.paused && !audio.ended) {
        tentarAutoplay();
    }

}, 500);

/* =========================================================
   TECLA ESPAÇO
========================================================= */

document.addEventListener("keydown", (event) => {

    if (event.code === "Space") {

        const elemento = document.activeElement;

        // Não interfere em campos de texto
        if (
            elemento &&
            (
                elemento.tagName === "INPUT" ||
                elemento.tagName === "TEXTAREA" ||
                elemento.tagName === "SELECT"
            )
        ) {
            return;
        }

        event.preventDefault();

        alternarAudio();
    }
});

/* =========================================================
   CABEÇALHO AO ROLAR
========================================================= */

const header = document.querySelector("header");

if (header) {

    window.addEventListener("scroll", () => {

        if (window.scrollY > 20) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

    });
}

/* =========================================================
   FORMULÁRIO DE PEDIDOS
========================================================= */

const requestForm = document.getElementById("requestForm");
const requestStatus = document.getElementById("requestStatus");

if (requestForm) {

    requestForm.addEventListener("submit", (event) => {

        event.preventDefault();

        if (requestStatus) {

            requestStatus.textContent =
                "Pedido enviado com sucesso!";

            requestStatus.classList.add("show");
        }

        requestForm.reset();

        setTimeout(() => {

            if (requestStatus) {
                requestStatus.classList.remove("show");
            }

        }, 4000);
    });
}

/* =========================================================
   INFORMAÇÕES INICIAIS
========================================================= */

const trackTitle = document.getElementById("trackTitle");
const trackArtist = document.getElementById("trackArtist");

if (trackTitle) {
    trackTitle.textContent =
        "Futuro do homem e o final dos tempos";
}

if (trackArtist) {
    trackArtist.textContent =
        "Onda Livre FM";
}

atualizarInterface();


});
