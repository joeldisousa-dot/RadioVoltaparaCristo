/* ============================================================
ONDA LIVRE FM
SCRIPT PRINCIPAL DO PLAYER
============================================================ */

document.addEventListener("DOMContentLoaded", function () {


/* ========================================================
   ELEMENTOS
======================================================== */

const audio = document.getElementById("audio");

const playBtn = document.getElementById("playBtn");
const playIcon = document.getElementById("playIcon");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const volumeControl = document.getElementById("volume");

const trackTitle = document.getElementById("trackTitle");
const trackArtist = document.getElementById("trackArtist");

const onair = document.getElementById("onair");

const shuffleBtn = document.getElementById("shuffleBtn");


/* ========================================================
   VERIFICAÇÃO
   ======================================================== */

if (!audio) {
    console.error("ERRO: elemento #audio não encontrado.");
    return;
}


/* ========================================================
   CONFIGURAÇÃO DA TRANSMISSÃO
   ======================================================== */

/*
 * ATENÇÃO:
 *
 * Esta variável PRECISA conter a URL REAL DO STREAM
 * DE ÁUDIO da Onda Livre FM.
 *
 * A URL anterior do Google Apps Script NÃO deve ser usada
 * aqui, pois ela não é uma transmissão de áudio.
 */

const STREAM_URL = "";


/* ========================================================
   CONFIGURAÇÕES
   ======================================================== */

const VOLUME_INICIAL = 1.0;

let tentandoReproduzir = false;
let usuarioInteragiu = false;


/* ========================================================
   CONFIGURAÇÃO INICIAL
   ======================================================== */

audio.autoplay = true;
audio.playsInline = true;
audio.preload = "auto";
audio.volume = VOLUME_INICIAL;


if (volumeControl) {
    volumeControl.value = 100;
}


/* ========================================================
   CONFIGURAR STREAM
   ======================================================== */

function configurarStream() {

    if (!STREAM_URL) {

        console.error(
            "A URL REAL da transmissão não foi configurada."
        );

        atualizarStatus(false);

        return false;
    }


    /*
     * Evita recarregar o mesmo endereço várias vezes.
     */

    if (audio.src !== STREAM_URL) {
        audio.src = STREAM_URL;
    }


    try {
        audio.load();
    } catch (erro) {

        console.error(
            "Erro ao carregar transmissão:",
            erro
        );

        return false;
    }


    return true;
}


/* ========================================================
   ÍCONE PLAY / PAUSE
   ======================================================== */

function atualizarBotao(tocando) {

    if (!playIcon) {
        return;
    }


    if (tocando) {

        playIcon.innerHTML = `
            <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true">

                <rect
                    x="6"
                    y="5"
                    width="4"
                    height="14"
                    rx="1">
                </rect>

                <rect
                    x="14"
                    y="5"
                    width="4"
                    height="14"
                    rx="1">
                </rect>

            </svg>
        `;

    } else {

        playIcon.innerHTML = `
            <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true">

                <path d="M8 5v14l11-7z"></path>

            </svg>
        `;
    }
}


/* ========================================================
   STATUS DA RÁDIO
   ======================================================== */

function atualizarStatus(tocando) {

    if (!onair) {
        return;
    }


    if (tocando) {

        onair.textContent = "AO VIVO";

        onair.classList.add("active");

    } else {

        onair.textContent = "OFFLINE";

        onair.classList.remove("active");
    }
}


/* ========================================================
   PLAY
   ======================================================== */

async function tocar() {

    if (tentandoReproduzir) {
        return;
    }


    tentandoReproduzir = true;


    try {

        /*
         * Se ainda não existe uma fonte de áudio,
         * tenta configurar.
         */

        if (!audio.src) {

            if (!configurarStream()) {
                throw new Error(
                    "URL da transmissão não configurada."
                );
            }
        }


        /*
         * Volume máximo do elemento.
         */

        audio.volume = 1.0;


        /*
         * Inicia a transmissão.
         */

        await audio.play();


        atualizarBotao(true);
        atualizarStatus(true);


        console.log(
            "Onda Livre FM: transmissão iniciada."
        );


    } catch (erro) {

        atualizarBotao(false);
        atualizarStatus(false);


        console.error(
            "Não foi possível iniciar a transmissão:",
            erro
        );


        /*
         * Mensagens específicas para facilitar diagnóstico.
         */

        if (erro.name === "NotAllowedError") {

            console.warn(
                "O navegador bloqueou o autoplay. " +
                "Clique no botão Play."
            );

        } else if (erro.name === "NotSupportedError") {

            console.error(
                "O navegador não suporta o formato " +
                "ou a URL informada não é um stream de áudio."
            );

        } else {

            console.error(
                "Verifique se a URL da transmissão está correta."
            );
        }


    } finally {

        tentandoReproduzir = false;
    }
}


/* ========================================================
   PAUSE
   ======================================================== */

function pausar() {

    try {
        audio.pause();
    } catch (erro) {

        console.error(
            "Erro ao pausar áudio:",
            erro
        );
    }


    atualizarBotao(false);
    atualizarStatus(false);
}


/* ========================================================
   PLAY / PAUSE
   ======================================================== */

function alternarPlay(event) {

    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }


    usuarioInteragiu = true;


    if (audio.paused) {

        tocar();

    } else {

        pausar();
    }
}


/* ========================================================
   BOTÃO PLAY
   ======================================================== */

if (playBtn) {

    playBtn.addEventListener(
        "click",
        alternarPlay
    );

} else {

    console.warn(
        "Botão #playBtn não encontrado."
    );
}


/* ========================================================
   BOTÃO ANTERIOR
   ======================================================== */

if (prevBtn) {

    prevBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            console.log(
                "Rádio ao vivo: não é possível voltar a faixa."
            );

        }
    );
}


/* ========================================================
   BOTÃO PRÓXIMA
   ======================================================== */

if (nextBtn) {

    nextBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            console.log(
                "Rádio ao vivo: próxima faixa controlada pela emissora."
            );

        }
    );
}


/* ========================================================
   SHUFFLE
   ======================================================== */

let shuffleAtivo = false;


if (shuffleBtn) {

    shuffleBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            shuffleAtivo = !shuffleAtivo;

            shuffleBtn.classList.toggle(
                "active",
                shuffleAtivo
            );

        }
    );
}


/* ========================================================
   VOLUME
   ======================================================== */

function alterarVolume(valor) {

    let nivel = Number(valor);


    if (Number.isNaN(nivel)) {
        nivel = 100;
    }


    nivel = Math.max(
        0,
        Math.min(100, nivel)
    );


    audio.volume = nivel / 100;


    atualizarIconeVolume(nivel);
}


if (volumeControl) {

    volumeControl.addEventListener(
        "input",
        function () {

            alterarVolume(this.value);

        }
    );
}


/* ========================================================
   ÍCONE DO VOLUME
   ======================================================== */

function atualizarIconeVolume(nivel) {

    const volumeIcon =
        document.getElementById("volumeIcon");


    if (!volumeIcon) {
        return;
    }


    if (nivel === 0) {

        volumeIcon.innerHTML = `
            <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2">

                <path
                    d="M11 5L6 9H2v6h4l5 4V5z">
                </path>

                <line
                    x1="23"
                    y1="9"
                    x2="17"
                    y2="15">
                </line>

                <line
                    x1="17"
                    y1="9"
                    x2="23"
                    y2="15">
                </line>

            </svg>
        `;

    } else if (nivel < 50) {

        volumeIcon.innerHTML = `
            <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2">

                <path
                    d="M11 5L6 9H2v6h4l5 4V5z">
                </path>

                <path
                    d="M15.5 8.5a5 5 0 0 1 0 7">
                </path>

            </svg>
        `;

    } else {

        volumeIcon.innerHTML = `
            <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2">

                <path
                    d="M11 5L6 9H2v6h4l5 4V5z">
                </path>

                <path
                    d="M15.5 8.5a5 5 0 0 1 0 7">
                </path>

                <path
                    d="M19 5a10 10 0 0 1 0 14">
                </path>

            </svg>
        `;
    }
}


/* ========================================================
   EVENTOS DO ÁUDIO
   ======================================================== */

audio.addEventListener(
    "play",
    function () {

        atualizarBotao(true);
        atualizarStatus(true);

    }
);


audio.addEventListener(
    "playing",
    function () {

        atualizarBotao(true);
        atualizarStatus(true);

        console.log(
            "Onda Livre FM: áudio tocando."
        );

    }
);


audio.addEventListener(
    "pause",
    function () {

        atualizarBotao(false);

        /*
         * Não altera imediatamente para OFFLINE se
         * o usuário simplesmente pausou.
         */

    }
);


audio.addEventListener(
    "waiting",
    function () {

        console.log(
            "Aguardando transmissão..."
        );
    }
);


audio.addEventListener(
    "stalled",
    function () {

        console.warn(
            "A transmissão foi interrompida temporariamente."
        );
    }
);


audio.addEventListener(
    "canplay",
    function () {

        console.log(
            "Stream disponível para reprodução."
        );


        /*
         * Se o usuário já interagiu, inicia.
         */

        if (
            usuarioInteragiu &&
            audio.paused
        ) {

            tocar();
        }

    }
);


audio.addEventListener(
    "error",
    function () {

        atualizarBotao(false);
        atualizarStatus(false);


        console.error(
            "ERRO NO ÁUDIO:",
            audio.error
        );


        if (audio.error) {

            console.error(
                "Código do erro:",
                audio.error.code
            );
        }
    }
);


/* ========================================================
   METADADOS
   ======================================================== */

if (trackTitle) {

    trackTitle.textContent =
        "Onda Livre FM";
}


if (trackArtist) {

    trackArtist.textContent =
        "Ao vivo";
}


/* ========================================================
   AUTOPLAY
   ======================================================== */

function tentarAutoplay() {

    /*
     * Não tenta novamente se o usuário já estiver
     * ouvindo a rádio.
     */

    if (!audio.paused) {
        return;
    }


    /*
     * Se não houver URL, não há o que tocar.
     */

    if (!audio.src) {

        if (!configurarStream()) {
            return;
        }
    }


    tocar();
}


/*
 * Primeira tentativa.
 */

setTimeout(
    tentarAutoplay,
    300
);


/*
 * Segunda tentativa.
 */

setTimeout(
    tentarAutoplay,
    1500
);


/*
 * Terceira tentativa.
 */

setTimeout(
    tentarAutoplay,
    3000
);


/*
 * Quarta tentativa.
 */

setTimeout(
    tentarAutoplay,
    5000
);


/* ========================================================
   PRIMEIRA INTERAÇÃO
   ======================================================== */

function primeiraInteracao() {

    usuarioInteragiu = true;


    /*
     * Se o áudio estiver parado,
     * aproveita a interação para iniciar.
     */

    if (audio.paused) {

        tocar();
    }
}


document.addEventListener(
    "click",
    primeiraInteracao,
    {
        once: true
    }
);


document.addEventListener(
    "touchstart",
    primeiraInteracao,
    {
        once: true,
        passive: true
    }
);


document.addEventListener(
    "keydown",
    primeiraInteracao,
    {
        once: true
    }
);


/* ========================================================
   VISIBILIDADE DA PÁGINA
   ======================================================== */

document.addEventListener(
    "visibilitychange",
    function () {

        if (
            document.visibilityState === "visible" &&
            usuarioInteragiu &&
            audio.paused
        ) {

            setTimeout(
                tocar,
                300
            );
        }
    }
);


/* ========================================================
   INICIALIZAÇÃO
   ======================================================== */

atualizarBotao(false);
atualizarStatus(false);


/*
 * Configura o stream somente se existir
 * uma URL real.
 */

if (STREAM_URL) {

    configurarStream();

} else {

    console.error(
        "================================================"
    );

    console.error(
        "ONDA LIVRE FM"
    );

    console.error(
        "URL DO STREAM NÃO CONFIGURADA."
    );

    console.error(
        "Informe a URL REAL da transmissão em STREAM_URL."
    );

    console.error(
        "================================================"
    );
}


});
