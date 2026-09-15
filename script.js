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
        "Onda Livre FM: elemento de áudio não encontrado."
    );

    return;
}


/* =========================================================
   CONFIGURAÇÃO DO ÁUDIO
========================================================= */

audio.src = STREAM_URL;

audio.preload = "auto";

audio.volume = VOLUME_INICIAL;


if (volume) {

    volume.value =
        String(VOLUME_INICIAL);
}


/* =========================================================
   INFORMAÇÕES DA MÚSICA
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
   ATUALIZAR VISUAL DO PLAYER
========================================================= */

function atualizarPlayer() {

    if (!audio.paused && !audio.ended) {


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
   PLAY
========================================================= */

async function tocarAudio() {

    try {

        /*
         * Garante volume audível.
         */
        if (audio.volume <= 0) {

            audio.volume =
                VOLUME_INICIAL;

            if (volume) {

                volume.value =
                    String(VOLUME_INICIAL);
            }
        }


        /*
         * IMPORTANTE:
         *
         * O navegador recebe diretamente
         * a chamada play() do elemento <audio>.
         */
        await audio.play();


        atualizarPlayer();


        console.log(
            "Onda Livre FM: reprodução iniciada."
        );


    } catch (erro) {

        console.error(
            "Onda Livre FM: não foi possível reproduzir o áudio.",
            erro
        );


        atualizarPlayer();


        /*
         * Mostra uma mensagem no console
         * para facilitar o diagnóstico.
         */
        if (erro && erro.name) {

            console.error(
                "Tipo do erro:",
                erro.name
            );
        }
    }
}


/* =========================================================
   PAUSE
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
   BOTÃO PLAY PRINCIPAL
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
   BOTÃO "OUVIR AGORA"
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

            const novoVolume =
                Number(this.value);


            audio.volume =
                novoVolume;

        }
    );
}


/* =========================================================
   BOTÃO ANTERIOR
========================================================= */

if (prevBtn) {

    prevBtn.addEventListener(
        "click",
        async function () {

            /*
             * Como atualmente temos uma única música,
             * o botão retorna ao início.
             */

            audio.currentTime = 0;


            if (audio.paused) {

                await tocarAudio();

            }

        }
    );
}


/* =========================================================
   BOTÃO PRÓXIMO
========================================================= */

if (nextBtn) {

    nextBtn.addEventListener(
        "click",
        async function () {

            /*
             * Atualmente temos uma única faixa.
             *
             * Quando as 500 músicas forem adicionadas,
             * este botão será ligado à playlist.
             */

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
    "loadstart",
    function () {

        console.log(
            "Onda Livre FM: carregando áudio..."
        );

    }
);


audio.addEventListener(
    "loadedmetadata",
    function () {

        console.log(
            "Onda Livre FM: informações do áudio carregadas."
        );

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

        console.log(
            "Onda Livre FM: pausado."
        );

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
    "ended",
    function () {

        atualizarPlayer();

        console.log(
            "Onda Livre FM: música terminou."
        );

    }
);


audio.addEventListener(
    "error",
    function () {

        atualizarPlayer();


        console.error(
            "Onda Livre FM: ERRO AO CARREGAR O ÁUDIO."
        );


        if (audio.error) {

            console.error(
                "Código do erro:",
                audio.error.code
            );

            console.error(
                "Detalhes:",
                audio.error.message
            );
        }

    }
);


/* =========================================================
   AUTOPLAY
========================================================= */

/*
 * Fazemos apenas uma tentativa.
 *
 * Se o navegador permitir autoplay,
 * a música começa automaticamente.
 *
 * Se bloquear, o botão Play continua
 * funcionando normalmente.
 */

setTimeout(
    function () {

        if (audio.paused) {

            tocarAudio();

        }

    },
    500
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

        /*
         * Não interfere em campos de texto.
         */

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
