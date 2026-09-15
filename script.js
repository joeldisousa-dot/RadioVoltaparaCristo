/* ============================================================
ONDA LIVRE FM
PLAYER PRINCIPAL
============================================================ */

document.addEventListener("DOMContentLoaded", function () {


/* ========================================================
   ELEMENTOS
======================================================== */

const audio =
    document.getElementById("audio");

const playBtn =
    document.getElementById("playBtn");

const playIcon =
    document.getElementById("playIcon");

const prevBtn =
    document.getElementById("prevBtn");

const nextBtn =
    document.getElementById("nextBtn");

const volumeControl =
    document.getElementById("volume");

const volumeIcon =
    document.getElementById("volumeIcon");

const trackTitle =
    document.getElementById("trackTitle");

const trackArtist =
    document.getElementById("trackArtist");

const onair =
    document.getElementById("onair");

const shuffleBtn =
    document.getElementById("shuffleBtn");

const requestForm =
    document.getElementById("requestForm");

const reqName =
    document.getElementById("reqName");

const reqSong =
    document.getElementById("reqSong");

const requestStatus =
    document.getElementById("requestStatus");


/* ========================================================
   URL DO ÁUDIO
   ======================================================== */

const STREAM_URL =
    "https://archive.org/download/futuro-do-homem-e-o-final-dos-tempos_202609/Futuro%20do%20homem%20e%20o%20final%20dos%20tempos.mp3";


/* ========================================================
   CONFIGURAÇÕES
   ======================================================== */

const VOLUME_INICIAL = 1.0;

let usuarioInteragiu = false;

let tentandoReproduzir = false;

let shuffleAtivo = false;


/* ========================================================
   VERIFICAÇÃO
   ======================================================== */

if (!audio) {

    console.error(
        "ERRO: #audio não encontrado."
    );

    return;
}


/* ========================================================
   CONFIGURAÇÃO DO ÁUDIO
   ======================================================== */

audio.autoplay = true;

audio.playsInline = true;

audio.preload = "auto";

audio.volume =
    VOLUME_INICIAL;


/* ========================================================
   CONFIGURAR FONTE
   ======================================================== */

audio.src =
    STREAM_URL;


/* ========================================================
   STATUS
   ======================================================== */

function atualizarStatus(tocando) {

    if (!onair) {
        return;
    }


    if (tocando) {

        onair.textContent =
            "REPRODUZINDO";

        onair.classList.add(
            "active"
        );

    } else {

        onair.textContent =
            "PAUSADO";

        onair.classList.remove(
            "active"
        );
    }
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
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor">

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


        playBtn.setAttribute(
            "aria-label",
            "Pausar"
        );


    } else {

        playIcon.innerHTML = `
            <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor">

                <path
                    d="M8 5v14l11-7z">
                </path>

            </svg>
        `;


        playBtn.setAttribute(
            "aria-label",
            "Reproduzir"
        );
    }
}


/* ========================================================
   TOCAR
   ======================================================== */

async function tocar() {

    if (tentandoReproduzir) {
        return;
    }


    tentandoReproduzir = true;


    try {

        /*
         * Garante a URL.
         */

        if (
            !audio.src ||
            audio.src !== STREAM_URL
        ) {

            audio.src =
                STREAM_URL;

            audio.load();
        }


        /*
         * Volume.
         */

        if (
            volumeControl &&
            Number.isFinite(
                Number(volumeControl.value)
            )
        ) {

            audio.volume =
                Number(
                    volumeControl.value
                ) / 100;

        } else {

            audio.volume =
                VOLUME_INICIAL;
        }


        /*
         * Reprodução.
         */

        await audio.play();


        atualizarBotao(true);

        atualizarStatus(true);


        console.log(
            "Áudio iniciado com sucesso."
        );


    } catch (erro) {

        atualizarBotao(false);

        atualizarStatus(false);


        console.error(
            "Erro ao iniciar áudio:",
            erro
        );


        if (
            erro &&
            erro.name ===
            "NotAllowedError"
        ) {

            console.warn(
                "O navegador bloqueou o autoplay. " +
                "Clique no botão Play."
            );

        } else {

            console.warn(
                "Não foi possível reproduzir " +
                "o arquivo de áudio."
            );
        }

    } finally {

        tentandoReproduzir =
            false;
    }
}


/* ========================================================
   PAUSAR
   ======================================================== */

function pausar() {

    try {

        audio.pause();

    } catch (erro) {

        console.error(
            "Erro ao pausar:",
            erro
        );
    }


    atualizarBotao(false);

    atualizarStatus(false);
}


/* ========================================================
   PLAY / PAUSE
   ======================================================== */

async function alternarPlay(event) {

    if (event) {

        event.preventDefault();

        event.stopPropagation();
    }


    usuarioInteragiu =
        true;


    if (audio.paused) {

        await tocar();

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

    console.error(
        "ERRO: #playBtn não encontrado."
    );
}


/* ========================================================
   VOLUME
   ======================================================== */

function alterarVolume(valor) {

    let nivel =
        Number(valor);


    if (
        !Number.isFinite(nivel)
    ) {

        nivel = 100;
    }


    nivel =
        Math.max(
            0,
            Math.min(
                100,
                nivel
            )
        );


    audio.volume =
        nivel / 100;


    atualizarIconeVolume(
        nivel
    );
}


if (volumeControl) {

    volumeControl.addEventListener(
        "input",
        function () {

            alterarVolume(
                this.value
            );

        }
    );
}


/* ========================================================
   ÍCONE DO VOLUME
   ======================================================== */

function atualizarIconeVolume(
    nivel
) {

    if (!volumeIcon) {
        return;
    }


    if (nivel <= 0) {

        volumeIcon.innerHTML = `
            <svg
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
   BOTÃO ANTERIOR
   ======================================================== */

if (prevBtn) {

    prevBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            usuarioInteragiu =
                true;

            console.log(
                "Anterior: não disponível para este áudio."
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

            usuarioInteragiu =
                true;

            console.log(
                "Próxima: não disponível para este áudio."
            );

        }
    );
}


/* ========================================================
   SHUFFLE
   ======================================================== */

if (shuffleBtn) {

    shuffleBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            shuffleAtivo =
                !shuffleAtivo;


            shuffleBtn.classList.toggle(
                "active",
                shuffleAtivo
            );


            console.log(
                "Shuffle:",
                shuffleAtivo
                    ? "ativado"
                    : "desativado"
            );

        }
    );
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
            "Áudio está efetivamente reproduzindo."
        );

    }
);


audio.addEventListener(
    "pause",
    function () {

        atualizarBotao(false);

        atualizarStatus(false);

    }
);


audio.addEventListener(
    "ended",
    function () {

        atualizarBotao(false);

        atualizarStatus(false);

        console.log(
            "Áudio terminou."
        );

    }
);


audio.addEventListener(
    "waiting",
    function () {

        console.log(
            "Aguardando dados do áudio..."
        );

    }
);


audio.addEventListener(
    "canplay",
    function () {

        console.log(
            "Áudio disponível para reprodução."
        );


        /*
         * Depois que o usuário interagir,
         * aproveitamos o evento para tocar.
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
            "ERRO DE ÁUDIO:",
            audio.error
        );


        if (audio.error) {

            console.error(
                "Código:",
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
        "Futuro do homem e o final dos tempos";
}


if (trackArtist) {

    trackArtist.textContent =
        "Onda Livre FM";
}


/* ========================================================
   FORMULÁRIO DE PEDIDOS
   ======================================================== */

if (requestForm) {

    requestForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const nome =
                reqName
                    ? reqName.value.trim()
                    : "";


            const musica =
                reqSong
                    ? reqSong.value.trim()
                    : "";


            if (
                !nome ||
                !musica
            ) {

                if (requestStatus) {

                    requestStatus.textContent =
                        "Preencha seu nome e a música.";
                }

                return;
            }


            if (requestStatus) {

                requestStatus.textContent =
                    "Pedido recebido! Obrigado pela participação.";
            }


            requestForm.reset();


        }
    );
}


/* ========================================================
   AUTOPLAY
   ======================================================== */

function tentarAutoplay() {

    if (
        usuarioInteragiu ||
        !audio.paused
    ) {

        return;
    }


    tocar();
}


/*
 * Carrega o áudio.
 */

audio.load();


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
 * Última tentativa.
 */

setTimeout(
    tentarAutoplay,
    5000
);


/* ========================================================
   INTERAÇÃO DO USUÁRIO
   ======================================================== */

function primeiraInteracao() {

    usuarioInteragiu =
        true;


    if (audio.paused) {

        tocar();
    }
}


document.addEventListener(
    "pointerdown",
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
   ESTADO INICIAL
   ======================================================== */

atualizarBotao(false);

atualizarStatus(false);

atualizarIconeVolume(100);


console.log(
    "Onda Livre FM - player inicializado."
);


});
