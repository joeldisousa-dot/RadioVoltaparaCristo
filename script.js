/* ============================================================
   ONDA LIVRE
   Plataforma de Evangelização
============================================================ */


/* ============================================================
   CONFIGURAÇÃO DO ÁUDIO
============================================================ */

const STREAM_URL =
    "https://archive.org/download/futuro-do-homem-e-o-final-dos-tempos_202609/Futuro%20do%20homem%20e%20o%20final%20dos%20tempos.mp3";

const VOLUME_INICIAL = 1.0;


/* ============================================================
   ELEMENTOS
============================================================ */

const audio = document.getElementById("audio");

const playBtn = document.getElementById("playBtn");
const playIcon = document.getElementById("playIcon");

const heroPlayBtn =
    document.getElementById("heroPlayBtn");

const heroMainPlayBtn =
    document.getElementById("heroMainPlayBtn");

const prevBtn =
    document.getElementById("prevBtn");

const volume =
    document.getElementById("volume");

const trackTitle =
    document.getElementById("trackTitle");

const trackArtist =
    document.getElementById("trackArtist");

const miniTrackTitle =
    document.getElementById("miniTrackTitle");

const miniTrackArtist =
    document.getElementById("miniTrackArtist");

const cover =
    document.getElementById("cover");

const requestForm =
    document.getElementById("requestForm");

const requestStatus =
    document.getElementById("requestStatus");

const siteHeader =
    document.getElementById("siteHeader");


/* ============================================================
   ESTADO
============================================================ */

let primeiraInteracaoResolvida = false;


/* ============================================================
   CONFIGURAÇÃO INICIAL
============================================================ */

function configurarAudio() {

    if (!audio) {
        console.error(
            "Elemento de áudio não encontrado."
        );

        return;
    }


    audio.src = STREAM_URL;

    audio.autoplay = true;

    audio.playsInline = true;

    audio.muted = false;

    audio.volume = VOLUME_INICIAL;


    if (volume) {
        volume.value = VOLUME_INICIAL;
    }


    atualizarInformacoesFaixa();

}


/* ============================================================
   INFORMAÇÕES DA FAIXA
============================================================ */

function atualizarInformacoesFaixa() {

    const titulo =
        "Futuro do homem e o final dos tempos";

    const artista =
        "Onda Livre";


    if (trackTitle) {
        trackTitle.textContent = titulo;
    }

    if (trackArtist) {
        trackArtist.textContent = artista;
    }

    if (miniTrackTitle) {
        miniTrackTitle.textContent = titulo;
    }

    if (miniTrackArtist) {
        miniTrackArtist.textContent = artista;
    }

}


/* ============================================================
   ATUALIZAÇÃO DOS BOTÕES
============================================================ */

function atualizarEstadoPlayer() {

    const tocando =
        audio &&
        !audio.paused &&
        !audio.ended;


    if (playIcon) {
        playIcon.textContent =
            tocando ? "❚❚" : "▶";
    }


    if (heroMainPlayBtn) {

        heroMainPlayBtn.textContent =
            tocando ? "❚❚" : "▶";

        heroMainPlayBtn.setAttribute(
            "aria-label",
            tocando
                ? "Pausar"
                : "Reproduzir"
        );
    }


    if (cover) {

        if (tocando) {
            cover.classList.add("playing");
        } else {
            cover.classList.remove("playing");
        }

    }

}


/* ============================================================
   INICIAR ÁUDIO
============================================================ */

async function iniciarAudio() {

    if (!audio) {
        return false;
    }


    try {

        audio.muted = false;

        audio.volume =
            volume
                ? Number(volume.value)
                : VOLUME_INICIAL;


        const promessa =
            audio.play();


        if (promessa !== undefined) {
            await promessa;
        }


        primeiraInteracaoResolvida = true;

        removerFallbackAutoplay();

        atualizarEstadoPlayer();

        return true;

    } catch (erro) {

        /*
         * O navegador pode bloquear autoplay
         * com áudio. Isso não é erro do código.
         */

        console.log(
            "Autoplay bloqueado pelo navegador.",
            erro
        );

        atualizarEstadoPlayer();

        return false;
    }

}


/* ============================================================
   TENTATIVA AUTOMÁTICA
============================================================ */

function tentarAutoplay() {

    if (!audio) {
        return;
    }


    /*
     * Tentamos iniciar imediatamente.
     */

    iniciarAudio();

}


/* ============================================================
   PRIMEIRO CLIQUE/TOQUE
============================================================ */

async function desbloquearAudio() {

    if (primeiraInteracaoResolvida) {
        return;
    }


    if (!audio) {
        return;
    }


    const iniciou =
        await iniciarAudio();


    if (iniciou) {

        primeiraInteracaoResolvida = true;

        removerFallbackAutoplay();

    }

}


/* ============================================================
   FALLBACK PARA AUTOPLAY
============================================================ */

function ativarFallbackAutoplay() {

    document.addEventListener(
        "click",
        desbloquearAudio,
        true
    );

    document.addEventListener(
        "touchstart",
        desbloquearAudio,
        true
    );

    document.addEventListener(
        "pointerdown",
        desbloquearAudio,
        true
    );

}


/* ============================================================
   REMOVER FALLBACK
============================================================ */

function removerFallbackAutoplay() {

    document.removeEventListener(
        "click",
        desbloquearAudio,
        true
    );

    document.removeEventListener(
        "touchstart",
        desbloquearAudio,
        true
    );

    document.removeEventListener(
        "pointerdown",
        desbloquearAudio,
        true
    );

}


/* ============================================================
   PLAY / PAUSE
============================================================ */

async function alternarAudio() {

    if (!audio) {
        return;
    }


    if (audio.paused || audio.ended) {

        await iniciarAudio();

    } else {

        audio.pause();

    }


    atualizarEstadoPlayer();

}


/* ============================================================
   BOTÃO PRINCIPAL
============================================================ */

if (playBtn) {

    playBtn.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();

            alternarAudio();

        }
    );

}


/* ============================================================
   BOTÃO HERO
============================================================ */

if (heroPlayBtn) {

    heroPlayBtn.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();

            alternarAudio();

        }
    );

}


/* ============================================================
   BOTÃO HERO PLAYER
============================================================ */

if (heroMainPlayBtn) {

    heroMainPlayBtn.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();

            alternarAudio();

        }
    );

}


/* ============================================================
   VOLUME
============================================================ */

if (volume) {

    volume.addEventListener(
        "input",
        function() {

            const valor =
                Number(this.value);

            audio.volume = valor;

            /*
             * Se o usuário colocar volume maior que zero
             * depois de uma tentativa bloqueada,
             * tentamos iniciar novamente.
             */

            if (
                valor > 0 &&
                audio.paused
            ) {

                iniciarAudio();

            }

        }
    );

}


/* ============================================================
   BOTÃO ANTERIOR
============================================================ */

if (prevBtn) {

    prevBtn.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();

            /*
             * Como neste momento existe apenas uma faixa,
             * o botão anterior reinicia a faixa atual.
             */

            if (audio) {

                audio.currentTime = 0;

                iniciarAudio();

            }

        }
    );

}


/* ============================================================
   EVENTOS DO ÁUDIO
============================================================ */

if (audio) {

    audio.addEventListener(
        "play",
        atualizarEstadoPlayer
    );


    audio.addEventListener(
        "playing",
        atualizarEstadoPlayer
    );


    audio.addEventListener(
        "pause",
        atualizarEstadoPlayer
    );


    audio.addEventListener(
        "ended",
        function() {

            /*
             * Quando a playlist de músicas for adicionada,
             * aqui será chamado o próximo áudio.
             */

            atualizarEstadoPlayer();

        }
    );


    audio.addEventListener(
        "error",
        function() {

            console.error(
                "Erro ao reproduzir o áudio.",
                audio.error
            );

            atualizarEstadoPlayer();

        }
    );

}


/* ============================================================
   FORMULÁRIO DE ORAÇÃO
============================================================ */

if (requestForm) {

    requestForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const nome =
                document.getElementById(
                    "reqName"
                ).value.trim();


            const pedido =
                document.getElementById(
                    "reqSong"
                ).value.trim();


            if (!nome || !pedido) {

                requestStatus.textContent =
                    "Preencha seu nome e seu pedido de oração.";

                return;

            }


            /*
             * Neste primeiro modelo o formulário funciona
             * localmente. O ponto de integração com Google
             * Sheets / Apps Script poderá ser colocado aqui.
             */

            requestStatus.textContent =
                "Seu pedido foi preparado. Que Deus fortaleça seu coração. 🙏";


            requestForm.reset();


            setTimeout(
                function() {

                    requestStatus.textContent = "";

                },
                7000
            );

        }
    );

}


/* ============================================================
   HEADER AO ROLAR
============================================================ */

window.addEventListener(
    "scroll",
    function() {

        if (!siteHeader) {
            return;
        }


        if (window.scrollY > 30) {

            siteHeader.classList.add(
                "scrolled"
            );

        } else {

            siteHeader.classList.remove(
                "scrolled"
            );

        }

    }
);


/* ============================================================
   TECLA ESPAÇO
============================================================ */

document.addEventListener(
    "keydown",
    function(event) {

        /*
         * Não interfere quando o usuário está digitando.
         */

        const tag =
            document.activeElement
                ? document.activeElement.tagName
                : "";


        if (
            event.code === "Space" &&
            tag !== "INPUT" &&
            tag !== "TEXTAREA"
        ) {

            event.preventDefault();

            alternarAudio();

        }

    }
);


/* ============================================================
   INICIALIZAÇÃO
============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        configurarAudio();

        ativarFallbackAutoplay();

        /*
         * Pequeno atraso para dar tempo ao navegador
         * de preparar o elemento de áudio.
         */

        setTimeout(
            tentarAutoplay,
            250
        );

    }
);
