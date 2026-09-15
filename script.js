document.addEventListener("DOMContentLoaded", function () {


"use strict";


/* =========================================================
   CONFIGURAÇÃO
========================================================= */

const STREAM_URL =
    "https://archive.org/download/futuro-do-homem-e-o-final-dos-tempos_202609/Futuro%20do%20homem%20e%20o%20final%20dos%20tempos.mp3";


const VOLUME_INICIAL = 1;


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

const onair =
    document.getElementById("onair");

const trackTitle =
    document.getElementById("trackTitle");

const trackArtist =
    document.getElementById("trackArtist");

const requestForm =
    document.getElementById("requestForm");

const requestStatus =
    document.getElementById("requestStatus");

const header =
    document.getElementById("header");


/* =========================================================
   VERIFICAÇÃO
========================================================= */

if (!audio) {

    console.error(
        "Onda Livre FM: elemento #audio não encontrado."
    );

    return;
}


/* =========================================================
   CONFIGURAÇÃO DO ÁUDIO
========================================================= */

audio.src = STREAM_URL;

audio.preload = "auto";

audio.autoplay = true;

audio.playsInline = true;

audio.volume = VOLUME_INICIAL;


if (volume) {

    volume.value =
        String(VOLUME_INICIAL);
}


/* =========================================================
   INFORMAÇÕES DA FAIXA
========================================================= */

if (trackTitle) {

    trackTitle.textContent =
        "Futuro do homem e o final dos tempos";
}


if (trackArtist) {

    trackArtist.textContent =
        "Onda Livre FM";
}


/* =========================================================
   ATUALIZAR PLAYER
========================================================= */

function atualizarPlayer() {

    const tocando =
        !audio.paused &&
        !audio.ended;


    if (tocando) {


        if (playIcon) {

            playIcon.textContent =
                "❚❚";
        }


        if (onair) {

            onair.textContent =
                "ON AIR";

            onair.classList.add(
                "active"
            );
        }


    } else {


        if (playIcon) {

            playIcon.textContent =
                "▶";
        }


        if (onair) {

            onair.textContent =
                "OFF AIR";

            onair.classList.remove(
                "active"
            );
        }

    }
}


/* =========================================================
   TOCAR
========================================================= */

async function tocarAudio() {

    try {

        /*
         * O volume deve estar acima de zero.
         */
        if (audio.volume <= 0) {

            audio.volume =
                VOLUME_INICIAL;

            if (volume) {

                volume.value =
                    String(VOLUME_INICIAL);
            }
        }


        await audio.play();


        atualizarPlayer();


        console.log(
            "Onda Livre FM: áudio reproduzindo."
        );


    } catch (erro) {

        /*
         * Se aparecer aqui ao abrir a página,
         * normalmente é somente o bloqueio de
         * autoplay do navegador.
         *
         * O botão Play continua funcionando.
         */

        console.warn(
            "Onda Livre FM: autoplay bloqueado pelo navegador."
        );

        console.warn(erro);


        atualizarPlayer();
    }
}


/* =========================================================
   PAUSAR
========================================================= */

function pausarAudio() {

    audio.pause();

    atualizarPlayer();
}


/* =========================================================
   PLAY / PAUSE
========================================================= */

async function alternarAudio() {

    if (audio.paused) {

        await tocarAudio();

    } else {

        pausarAudio();
    }
}


/* =========================================================
   BOTÃO PLAY
========================================================= */

if (playBtn) {

    playBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();

            alternarAudio();

        }
    );
}


/* =========================================================
   BOTÃO OUVIR AGORA
========================================================= */

if (heroPlayBtn) {

    heroPlayBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            alternarAudio();

        }
    );
}


/* =========================================================
   VOLUME
========================================================= */

if (volume) {

    volume.addEventListener(
        "input",
        function () {

            audio.volume =
                Number(this.value);

        }
    );
}


/* =========================================================
   ANTERIOR
========================================================= */

if (prevBtn) {

    prevBtn.addEventListener(
        "click",
        async function () {

            audio.currentTime = 0;


            if (audio.paused) {

                await tocarAudio();

            }

        }
    );
}


/* =========================================================
   PRÓXIMO
========================================================= */

if (nextBtn) {

    nextBtn.addEventListener(
        "click",
        async function () {

            audio.currentTime = 0;


            if (audio.paused) {

                await tocarAudio();

            }

        }
    );
}


/* =========================================================
   SHUFFLE
========================================================= */

if (shuffleBtn) {

    shuffleBtn.addEventListener(
        "click",
        function () {

            this.classList.toggle(
                "active"
            );

        }
    );
}


/* =========================================================
   EVENTOS DO ÁUDIO
========================================================= */

audio.addEventListener(
    "play",
    function () {

        atualizarPlayer();

    }
);


audio.addEventListener(
    "playing",
    function () {

        atualizarPlayer();

        console.log(
            "Onda Livre FM: TOCANDO."
        );

    }
);


audio.addEventListener(
    "pause",
    function () {

        atualizarPlayer();

    }
);


audio.addEventListener(
    "waiting",
    function () {

        if (onair) {

            onair.textContent =
                "CARREGANDO...";
        }

    }
);


audio.addEventListener(
    "canplay",
    function () {

        console.log(
            "Onda Livre FM: áudio pronto."
        );

    }
);


audio.addEventListener(
    "ended",
    function () {

        atualizarPlayer();

    }
);


audio.addEventListener(
    "error",
    function () {

        atualizarPlayer();


        console.error(
            "Onda Livre FM: erro ao carregar o MP3."
        );


        if (audio.error) {

            console.error(
                "Código:",
                audio.error.code
            );

            console.error(
                "Mensagem:",
                audio.error.message
            );
        }

    }
);


/* =========================================================
   AUTOPLAY
========================================================= */

/*
 * Tenta tocar logo após o carregamento.
 *
 * Se o navegador permitir:
 *      começa automaticamente.
 *
 * Se bloquear:
 *      o player continua normal e o
 *      botão Play fica disponível.
 */

setTimeout(
    function () {

        if (audio.paused) {

            tocarAudio();

        }

    },
    300
);


/* =========================================================
   HEADER
========================================================= */

if (header) {

    window.addEventListener(
        "scroll",
        function () {

            if (window.scrollY > 20) {

                header.classList.add(
                    "scrolled"
                );

            } else {

                header.classList.remove(
                    "scrolled"
                );
            }

        }
    );
}


/* =========================================================
   FORMULÁRIO DE PEDIDOS
========================================================= */

if (requestForm) {

    requestForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            if (requestStatus) {

                requestStatus.textContent =
                    "Pedido enviado com sucesso!";

                requestStatus.style.display =
                    "block";
            }


            requestForm.reset();

        }
    );
}


/* =========================================================
   TECLA ESPAÇO
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.code === "Space" &&
            event.target.tagName !== "INPUT" &&
            event.target.tagName !== "TEXTAREA"
        ) {

            event.preventDefault();

            alternarAudio();

        }

    }
);


/* =========================================================
   ESTADO INICIAL
========================================================= */

atualizarPlayer();


console.log(
    "Onda Livre FM: player carregado."
);


});
