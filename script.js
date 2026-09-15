const STREAM_URL =
    "https://archive.org/download/futuro-do-homem-e-o-final-dos-tempos_202609/Futuro%20do%20homem%20e%20o%20final%20dos%20tempos.mp3";

const VOLUME_INICIAL = 1.0;

document.addEventListener("DOMContentLoaded", function () {

    const audio = document.getElementById("audio");

    const playBtn = document.getElementById("playBtn");
    const playIcon = document.getElementById("playIcon");

    const heroPlayBtn =
        document.getElementById("heroPlayBtn");

    const volume =
        document.getElementById("volume");

    const prevBtn =
        document.getElementById("prevBtn");

    const nextBtn =
        document.getElementById("nextBtn");

    const album =
        document.getElementById("album");

    const onair =
        document.getElementById("onair");

    if (!audio) {
        console.error("Áudio não encontrado.");
        return;
    }


    /* =====================================================
       CONFIGURAÇÃO
    ===================================================== */

    audio.src = STREAM_URL;

    audio.preload = "auto";

    audio.autoplay = true;

    audio.playsInline = true;

    audio.muted = false;

    audio.volume = VOLUME_INICIAL;


    if (volume) {
        volume.value = VOLUME_INICIAL;
    }


    /* =====================================================
       INTERFACE
    ===================================================== */

    function atualizarInterface() {

        const tocando =
            !audio.paused &&
            !audio.ended;

        if (playIcon) {
            playIcon.textContent =
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

        if (album) {

            album.classList.toggle(
                "album-playing",
                tocando
            );
        }

        if (onair) {

            onair.classList.toggle(
                "active",
                tocando
            );
        }
    }


    /* =====================================================
       DESBLOQUEIO PELO PRIMEIRO CLIQUE
    ===================================================== */

    let autoplayBloqueado = false;

    let aguardandoClique = false;


    async function iniciarAudio() {

        try {

            audio.muted = false;

            audio.volume = VOLUME_INICIAL;

            await audio.play();

            autoplayBloqueado = false;

            aguardandoClique = false;

            removerCliqueGlobal();

            atualizarInterface();

            console.log(
                "Onda Livre FM: áudio iniciado."
            );

        } catch (erro) {

            autoplayBloqueado = true;

            aguardandoClique = true;

            adicionarCliqueGlobal();

            atualizarInterface();

            console.log(
                "O navegador bloqueou o autoplay. " +
                "Aguardando interação do usuário."
            );
        }
    }


    async function primeiroClique() {

        if (!aguardandoClique) {
            return;
        }

        try {

            audio.muted = false;

            audio.volume = VOLUME_INICIAL;

            await audio.play();

            autoplayBloqueado = false;

            aguardandoClique = false;

            removerCliqueGlobal();

            atualizarInterface();

        } catch (erro) {

            console.error(
                "Não foi possível iniciar o áudio:",
                erro
            );
        }
    }


    function adicionarCliqueGlobal() {

        document.addEventListener(
            "click",
            primeiroClique,
            true
        );

        document.addEventListener(
            "touchstart",
            primeiroClique,
            true
        );
    }


    function removerCliqueGlobal() {

        document.removeEventListener(
            "click",
            primeiroClique,
            true
        );

        document.removeEventListener(
            "touchstart",
            primeiroClique,
            true
        );
    }


    /* =====================================================
       PLAY / PAUSE
    ===================================================== */

    async function alternarAudio() {

        if (audio.paused) {

            try {

                audio.muted = false;

                if (
                    audio.volume === 0
                ) {
                    audio.volume =
                        VOLUME_INICIAL;

                    if (volume) {
                        volume.value =
                            VOLUME_INICIAL;
                    }
                }

                await audio.play();

            } catch (erro) {

                console.error(
                    "Erro ao reproduzir:",
                    erro
                );
            }

        } else {

            audio.pause();
        }

        atualizarInterface();
    }


    /* =====================================================
       BOTÃO PLAY
    ===================================================== */

    if (playBtn) {

        playBtn.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                alternarAudio();
            }
        );
    }


    /* =====================================================
       BOTÃO HERO
    ===================================================== */

    if (heroPlayBtn) {

        heroPlayBtn.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                alternarAudio();
            }
        );
    }


    /* =====================================================
       VOLUME
    ===================================================== */

    if (volume) {

        volume.addEventListener(
            "input",
            function () {

                audio.volume =
                    Number(this.value);

                if (
                    audio.volume > 0
                ) {
                    audio.muted = false;
                }
            }
        );
    }


    /* =====================================================
       BOTÃO ANTERIOR
    ===================================================== */

    if (prevBtn) {

        prevBtn.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                audio.currentTime = 0;

                if (audio.paused) {
                    alternarAudio();
                }
            }
        );
    }


    /* =====================================================
       BOTÃO PRÓXIMO
    ===================================================== */

    if (nextBtn) {

        nextBtn.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                audio.currentTime = 0;

                if (audio.paused) {
                    alternarAudio();
                }
            }
        );
    }


    /* =====================================================
       EVENTOS
    ===================================================== */

    audio.addEventListener(
        "playing",
        function () {

            autoplayBloqueado = false;

            aguardandoClique = false;

            removerCliqueGlobal();

            atualizarInterface();
        }
    );


    audio.addEventListener(
        "pause",
        atualizarInterface
    );


    audio.addEventListener(
        "play",
        atualizarInterface
    );


    audio.addEventListener(
        "canplay",
        function () {

            if (
                audio.paused &&
                !autoplayBloqueado
            ) {
                iniciarAudio();
            }
        }
    );


    audio.addEventListener(
        "error",
        function () {

            console.error(
                "Erro no áudio:",
                audio.error
            );

            atualizarInterface();
        }
    );


    /* =====================================================
       TENTATIVA AUTOMÁTICA
    ===================================================== */

    iniciarAudio();


    setTimeout(
        function () {

            if (
                audio.paused &&
                !audio.ended
            ) {
                iniciarAudio();
            }

        },
        1000
    );


    /* =====================================================
       CABEÇALHO
    ===================================================== */

    const header =
        document.getElementById("siteHeader");

    if (header) {

        window.addEventListener(
            "scroll",
            function () {

                if (
                    window.scrollY > 15
                ) {
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


    /* =====================================================
       FORMULÁRIO
    ===================================================== */

    const requestForm =
        document.getElementById(
            "requestForm"
        );

    const requestStatus =
        document.getElementById(
            "requestStatus"
        );


    if (requestForm) {

        requestForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                if (requestStatus) {

                    requestStatus.textContent =
                        "Pedido enviado com sucesso!";

                    requestStatus.classList.add(
                        "show"
                    );
                }

                requestForm.reset();


                setTimeout(
                    function () {

                        if (requestStatus) {

                            requestStatus.classList.remove(
                                "show"
                            );
                        }

                    },
                    4000
                );
            }
        );
    }


    /* =====================================================
       TECLA ESPAÇO
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.code !== "Space"
            ) {
                return;
            }

            const elemento =
                document.activeElement;

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
    );


    /* =====================================================
       INFORMAÇÕES DA FAIXA
    ===================================================== */

    const trackTitle =
        document.getElementById(
            "trackTitle"
        );

    const trackArtist =
        document.getElementById(
            "trackArtist"
        );


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
