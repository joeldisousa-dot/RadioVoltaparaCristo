/* =========================================================
   ONDA LIVRE FM
   CONTROLE DO PLAYER
========================================================= */

"use strict";


/* =========================================================
   CONFIGURAÇÃO
========================================================= */

const STREAM_URL =
    "https://archive.org/download/futuro-do-homem-e-o-final-dos-tempos_202609/Futuro%20do%20homem%20e%20o%20final%20dos%20tempos.mp3";

const VOLUME_INICIAL = 1.0;


/* =========================================================
   ELEMENTOS
========================================================= */

let audio;
let playBtn;
let playIcon;
let volume;
let heroPlayBtn;
let onair;
let trackTitle;
let trackArtist;
let volumeIcon;
let requestForm;
let requestStatus;
let prevBtn;
let nextBtn;
let shuffleBtn;
let header;


/* =========================================================
   ÍCONES
========================================================= */

const PLAY_ICON = `
<svg
    viewBox="0 0 24 24"
    fill="currentColor">

    <path d="M8 5v14l11-7z"></path>

</svg>
`;


const PAUSE_ICON = `
<svg
    viewBox="0 0 24 24"
    fill="currentColor">

    <path d="M7 5h4v14H7z"></path>

    <path d="M13 5h4v14h-4z"></path>

</svg>
`;


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    iniciar
);


function iniciar() {

    audio =
        document.getElementById("audio");

    playBtn =
        document.getElementById("playBtn");

    playIcon =
        document.getElementById("playIcon");

    volume =
        document.getElementById("volume");

    heroPlayBtn =
        document.getElementById("heroPlayBtn");

    onair =
        document.getElementById("onair");

    trackTitle =
        document.getElementById("trackTitle");

    trackArtist =
        document.getElementById("trackArtist");

    volumeIcon =
        document.getElementById("volumeIcon");

    requestForm =
        document.getElementById("requestForm");

    requestStatus =
        document.getElementById("requestStatus");

    prevBtn =
        document.getElementById("prevBtn");

    nextBtn =
        document.getElementById("nextBtn");

    shuffleBtn =
        document.getElementById("shuffleBtn");

    header =
        document.getElementById("topHeader");


    if (!audio) {

        console.error(
            "Elemento #audio não encontrado."
        );

        return;
    }


    configurarAudio();

    configurarPlayer();

    configurarHero();

    configurarHeader();

    configurarPedidos();

    atualizarInterface();


    /* =====================================================
       TENTATIVAS DE AUTOPLAY
    ===================================================== */

    tentarAutoplay();

}


/* =========================================================
   CONFIGURAÇÃO DO ÁUDIO
========================================================= */

function configurarAudio() {

    /*
       Garantimos a URL diretamente pelo JavaScript.
       Isso também protege contra alterações acidentais
       no HTML.
    */

    if (
        !audio.src ||
        audio.src !== STREAM_URL
    ) {

        audio.src = STREAM_URL;

    }


    audio.volume =
        VOLUME_INICIAL;


    audio.preload = "auto";


    /*
       Eventos do áudio
    */

    audio.addEventListener(
        "play",
        function () {

            atualizarInterface();

        }
    );


    audio.addEventListener(
        "playing",
        function () {

            atualizarInterface();

        }
    );


    audio.addEventListener(
        "pause",
        function () {

            atualizarInterface();

        }
    );


    audio.addEventListener(
        "ended",
        function () {

            atualizarInterface();

        }
    );


    audio.addEventListener(
        "waiting",
        function () {

            if (onair) {

                onair.textContent =
                    "CARREGANDO";

            }

        }
    );


    audio.addEventListener(
        "canplay",
        function () {

            if (
                !audio.paused
            ) {

                atualizarInterface();

            }

        }
    );


    audio.addEventListener(
        "error",
        function () {

            console.error(
                "Erro ao carregar o áudio:",
                audio.error
            );


            if (onair) {

                onair.textContent =
                    "ERRO NO ÁUDIO";

            }

        }
    );

}


/* =========================================================
   PLAYER
========================================================= */

function configurarPlayer() {

    if (playBtn) {

        playBtn.addEventListener(
            "click",
            function () {

                alternarAudio();

            }
        );

    }


    if (volume) {

        volume.addEventListener(
            "input",
            function () {

                const valor =
                    Number(volume.value) / 100;


                audio.volume =
                    valor;


                atualizarVolumeIcon();

            }
        );

    }


    if (prevBtn) {

        prevBtn.addEventListener(
            "click",
            function () {

                audio.currentTime = 0;

            }
        );

    }


    if (nextBtn) {

        nextBtn.addEventListener(
            "click",
            function () {

                audio.currentTime = 0;

            }
        );

    }


    if (shuffleBtn) {

        shuffleBtn.addEventListener(
            "click",
            function () {

                shuffleBtn.classList.toggle(
                    "active"
                );

            }
        );

    }

}


/* =========================================================
   BOTÃO PRINCIPAL
========================================================= */

async function alternarAudio() {

    if (!audio) {
        return;
    }


    /*
       Se estiver tocando, pausa.
    */

    if (!audio.paused) {

        audio.pause();

        return;
    }


    /*
       Se estiver pausado, toca.
    */

    try {

        /*
           Reforça a URL antes do play.
        */

        if (
            audio.src !== STREAM_URL
        ) {

            audio.src =
                STREAM_URL;

            audio.load();

        }


        audio.volume =
            Number(volume?.value || 100) / 100;


        await audio.play();

        atualizarInterface();

    }
    catch (erro) {

        console.error(
            "Não foi possível iniciar o áudio:",
            erro
        );


        if (onair) {

            onair.textContent =
                "CLIQUE PARA OUVIR";

        }

    }

}


/* =========================================================
   AUTOPLAY
========================================================= */

function tentarAutoplay() {

    /*
       O navegador pode bloquear autoplay com som.
       Por isso fazemos algumas tentativas.
    */

    const tentativas = [
        300,
        1000,
        2500,
        5000
    ];


    tentativas.forEach(
        function (tempo) {

            setTimeout(
                async function () {

                    if (
                        !audio ||
                        !audio.paused
                    ) {

                        return;

                    }


                    try {

                        await audio.play();

                        atualizarInterface();

                    }
                    catch (erro) {

                        /*
                           É normal o navegador bloquear
                           autoplay com áudio.

                           O clique no botão Play continuará
                           funcionando.
                        */

                        console.log(
                            "Autoplay bloqueado pelo navegador."
                        );

                    }

                },
                tempo
            );

        }
    );

}


/* =========================================================
   BOTÃO "OUVIR AGORA"
========================================================= */

function configurarHero() {

    if (!heroPlayBtn) {
        return;
    }


    heroPlayBtn.addEventListener(
        "click",
        function () {

            alternarAudio();

        }
    );

}


/* =========================================================
   INTERFACE
========================================================= */

function atualizarInterface() {

    if (!audio) {
        return;
    }


    const tocando =
        !audio.paused &&
        !audio.ended;


    if (playIcon) {

        playIcon.innerHTML =
            tocando
                ? PAUSE_ICON
                : PLAY_ICON;

    }


    if (playBtn) {

        playBtn.setAttribute(
            "aria-label",
            tocando
                ? "Pausar"
                : "Reproduzir"
        );

    }


    if (heroPlayBtn) {

        heroPlayBtn.innerHTML =
            tocando

                ? `
                    <svg
                        viewBox="0 0 24 24"
                        fill="currentColor">

                        <path d="M7 5h4v14H7z"></path>
                        <path d="M13 5h4v14h-4z"></path>

                    </svg>

                    Pausar
                  `

                : `
                    <svg
                        viewBox="0 0 24 24"
                        fill="currentColor">

                        <path d="M8 5v14l11-7z"></path>

                    </svg>

                    Ouvir agora
                  `;

    }


    if (onair) {

        onair.textContent =
            tocando
                ? "AO VIVO"
                : "OFFLINE";

    }


    if (tocando) {

        if (trackTitle) {

            trackTitle.textContent =
                "Futuro do homem e o final dos tempos";

        }

        if (trackArtist) {

            trackArtist.textContent =
                "Onda Livre FM";

        }

    }


    atualizarVolumeIcon();

}


/* =========================================================
   VOLUME
========================================================= */

function atualizarVolumeIcon() {

    if (
        !volumeIcon ||
        !audio
    ) {

        return;

    }


    const nivel =
        audio.volume;


    if (nivel === 0) {

        volumeIcon.innerHTML = `
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2">

                <path d="M11 5L6 9H2v6h4l5 4V5z"></path>

                <path d="M23 9l-6 6"></path>

                <path d="M17 9l6 6"></path>

            </svg>
        `;

        return;
    }


    volumeIcon.innerHTML = `
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2">

            <path d="M11 5L6 9H2v6h4l5 4V5z"></path>

            <path d="M15.5 8.5a5 5 0 0 1 0 7"></path>

            <path d="M19 5a10 10 0 0 1 0 14"></path>

        </svg>
    `;

}


/* =========================================================
   MENU FIXO
========================================================= */

function configurarHeader() {

    if (!header) {
        return;
    }


    function verificarScroll() {

        if (
            window.scrollY > 20
        ) {

            header.classList.add(
                "scrolled"
            );

        }
        else {

            header.classList.remove(
                "scrolled"
            );

        }

    }


    window.addEventListener(
        "scroll",
        verificarScroll,
        {
            passive: true
        }
    );


    verificarScroll();

}


/* =========================================================
   PEDIDOS
========================================================= */

function configurarPedidos() {

    if (!requestForm) {
        return;
    }


    requestForm.addEventListener(
        "submit",
        function (evento) {

            evento.preventDefault();


            const nome =
                document
                    .getElementById("reqName")
                    ?.value
                    .trim();


            const musica =
                document
                    .getElementById("reqSong")
                    ?.value
                    .trim();


            if (
                !nome ||
                !musica
            ) {

                return;

            }


            if (requestStatus) {

                requestStatus.textContent =
                    "Pedido enviado! Obrigado pela participação.";

            }


            requestForm.reset();

        }
    );

}


/* =========================================================
   INTERAÇÃO DO USUÁRIO
========================================================= */

/*
   Se o navegador bloquear o autoplay,
   a primeira interação do usuário tenta
   iniciar o áudio.
*/

function ativarDepoisDaInteracao() {

    if (
        audio &&
        audio.paused
    ) {

        audio.play()
            .then(
                function () {

                    atualizarInterface();

                }
            )
            .catch(
                function () {

                    /*
                       Se ainda assim não tocar,
                       o botão Play continua disponível.
                    */

                }
            );

    }

}


document.addEventListener(
    "click",
    function (evento) {

        /*
           Não interfere nos controles normais.
           O Play e o Ouvir Agora já possuem
           seus próprios eventos.
        */

        if (
            evento.target.closest("#playBtn") ||
            evento.target.closest("#heroPlayBtn")
        ) {

            return;

        }

        /*
           Não iniciar automaticamente ao clicar
           em links, inputs ou formulários.
        */

        if (
            evento.target.closest("a") ||
            evento.target.closest("input") ||
            evento.target.closest("form") ||
            evento.target.closest("button")
        ) {

            return;

        }

    }
);


/* =========================================================
   TECLADO
========================================================= */

document.addEventListener(
    "keydown",
    function (evento) {

        /*
           Espaço controla o player somente quando
           o usuário não estiver digitando.
        */

        const elemento =
            document.activeElement;


        const digitando =
            elemento &&
            (
                elemento.tagName === "INPUT" ||
                elemento.tagName === "TEXTAREA"
            );


        if (
            evento.code === "Space" &&
            !digitando
        ) {

            evento.preventDefault();

            alternarAudio();

        }

    }
);
