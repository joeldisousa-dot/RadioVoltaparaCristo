document.addEventListener("DOMContentLoaded", function () {


"use strict";


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

const autoplayOverlay =
    document.getElementById("autoplayOverlay");

const autoplayButton =
    document.getElementById("autoplayButton");

const volume =
    document.getElementById("volume");

const onair =
    document.getElementById("onair");

const trackTitle =
    document.getElementById("trackTitle");

const trackArtist =
    document.getElementById("trackArtist");

const prevBtn =
    document.getElementById("prevBtn");

const nextBtn =
    document.getElementById("nextBtn");

const shuffleBtn =
    document.getElementById("shuffleBtn");

const requestForm =
    document.getElementById("requestForm");

const requestStatus =
    document.getElementById("requestStatus");


/* =========================================================
   CONFIGURAÇÃO
========================================================= */

const STREAM_URL =
    "https://archive.org/download/futuro-do-homem-e-o-final-dos-tempos_202609/Futuro%20do%20homem%20e%20o%20final%20dos%20tempos.mp3";

const VOLUME_INICIAL = 1;


/* =========================================================
   VALIDAÇÃO
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
    volume.value = VOLUME_INICIAL;
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
   ATUALIZAÇÃO DO PLAYER
========================================================= */

function atualizarPlayer() {

    const tocando =
        !audio.paused &&
        !audio.ended;


    if (tocando) {

        if (playIcon) {
            playIcon.textContent = "❚❚";
        }

        if (onair) {

            onair.textContent =
                "ON AIR";

            onair.classList.add("active");
        }

    } else {

        if (playIcon) {
            playIcon.textContent = "▶";
        }

        if (onair) {

            onair.textContent =
                "OFF AIR";

            onair.classList.remove("active");
        }
    }
}


/* =========================================================
   FECHAR TELA INICIAL
========================================================= */

function fecharAutoplayOverlay() {

    if (!autoplayOverlay) {
        return;
    }

    autoplayOverlay.classList.add("hidden");

    document.body.classList.remove(
        "modal-open"
    );
}


/* =========================================================
   TOCAR ÁUDIO
========================================================= */

async function tocarAudio() {

    try {

        /*
         * Garante que o volume esteja audível.
         */
        if (audio.volume === 0) {
            audio.volume = VOLUME_INICIAL;
        }


        /*
         * Tenta iniciar o MP3.
         */
        await audio.play();


        atualizarPlayer();

        fecharAutoplayOverlay();


        console.log(
            "Onda Livre FM: áudio iniciado."
        );

        return true;

    } catch (erro) {

        console.warn(
            "Onda Livre FM: autoplay bloqueado.",
            erro
        );

        atualizarPlayer();

        return false;
    }
}


/* =========================================================
   TOCAR / PAUSAR
========================================================= */

async function alternarAudio() {

    if (audio.paused) {

        await tocarAudio();

    } else {

        audio.pause();

        atualizarPlayer();
    }
}


/* =========================================================
   BOTÃO DA TELA INICIAL
========================================================= */

if (autoplayButton) {

    autoplayButton.addEventListener(
        "click",
        async function () {

            /*
             * Esta ação é uma interação direta
             * do usuário e normalmente permite
             * reprodução com áudio.
             */

            autoplayButton.disabled = true;

            autoplayButton.textContent =
                "CARREGANDO...";

            const iniciou =
                await tocarAudio();


            if (iniciou) {

                autoplayButton.textContent =
                    "▶ OUVINDO";

            } else {

                autoplayButton.disabled =
                    false;

                autoplayButton.textContent =
                    "▶ TENTAR NOVAMENTE";
            }

        }
    );
}


/* =========================================================
   BOTÃO PLAY PRINCIPAL
========================================================= */

if (playBtn) {

    playBtn.addEventListener(
        "click",
        function () {

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
   ALEATÓRIO
========================================================= */

if (shuffleBtn) {

    shuffleBtn.addEventListener(
        "click",
        function () {

            this.classList.toggle("active");

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
            "Onda Livre FM: reproduzindo."
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
    "ended",
    function () {

        atualizarPlayer();

        /*
         * Atualmente existe apenas uma música.
         * Quando as 500 músicas forem adicionadas,
         * aqui será implementado o avanço automático.
         */

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
            "Onda Livre FM: MP3 pronto para reprodução."
        );

    }
);


audio.addEventListener(
    "error",
    function () {

        console.error(
            "Onda Livre FM: erro ao carregar o MP3.",
            audio.error
        );


        if (onair) {

            onair.textContent =
                "ERRO NO ÁUDIO";

            onair.classList.remove(
                "active"
            );
        }

    }
);


/* =========================================================
   AUTOPLAY AUTOMÁTICO
========================================================= */

function tentarAutoplay() {

    /*
     * Se já estiver tocando, não faz nada.
     */
    if (!audio.paused) {
        return;
    }


    console.log(
        "Onda Livre FM: tentando autoplay..."
    );


    audio.play()
        .then(function () {

            console.log(
                "Onda Livre FM: autoplay autorizado."
            );

            atualizarPlayer();

            fecharAutoplayOverlay();

        })
        .catch(function (erro) {

            /*
             * Normalmente significa que o navegador
             * bloqueou áudio automático.
             */

            console.warn(
                "Onda Livre FM: navegador bloqueou autoplay.",
                erro
            );

            atualizarPlayer();

        });
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
 * Última tentativa.
 */
setTimeout(
    tentarAutoplay,
    5000
);


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
   HEADER FIXO
========================================================= */

const header =
    document.getElementById("header");


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
   ESTADO INICIAL
========================================================= */

atualizarPlayer();


});
