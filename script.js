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
    const freq = document.getElementById("freq");

    const shuffleBtn = document.getElementById("shuffleBtn");

    /* ========================================================
       CONFIGURAÇÃO DA RÁDIO
       ======================================================== */

    /*
     * IMPORTANTE:
     *
     * Coloque aqui a URL REAL da transmissão da Onda Livre FM.
     *
     * Exemplo:
     *
     * const STREAM_URL =
     * "https://servidor.com:8000/stream";
     *
     * Se a URL já estiver sendo definida pelo seu HTML ou
     * por outro código, este valor poderá ser alterado.
     */

    const STREAM_URL = "https://script.google.com/macros/s/AKfycby4tIS3B07OIcPVoCgKde_EL6PHkRXp46nMMNVh0yYxoYlpcSQeXbBqjLQ6vvVfnJcX4Q/exec";

    /* ========================================================
       CONFIGURAÇÕES
       ======================================================== */

    const VOLUME_INICIAL = 1.0;

    /*
     * Ganho adicional do Web Audio.
     *
     * 1.0 = normal
     * 1.5 = aproximadamente +3,5 dB
     * 2.0 = aproximadamente +6 dB
     * 2.5 = aproximadamente +8 dB
     *
     * Começamos em 2.0.
     */

    const GANHO_AUDIO = 2.0;

    let audioContext = null;
    let gainNode = null;
    let mediaSource = null;

    let tentandoReproduzir = false;
    let usuarioInteragiu = false;

    /* ========================================================
       CONFIGURAÇÃO INICIAL
       ======================================================== */

    if (!audio) {
        console.error("Elemento #audio não encontrado.");
        return;
    }

    audio.volume = VOLUME_INICIAL;
    audio.autoplay = true;
    audio.playsInline = true;

    if (volumeControl) {
        volumeControl.value = 100;
    }

    /* ========================================================
       URL DA TRANSMISSÃO
       ======================================================== */

    function configurarStream() {

        /*
         * Não substitui uma URL que já tenha sido configurada
         * externamente.
         */

        if (
            STREAM_URL &&
            !STREAM_URL.includes("COLOQUE_AQUI") &&
            audio.src !== STREAM_URL
        ) {

            audio.src = STREAM_URL;

        }

        /*
         * Força carregamento da transmissão.
         */

        try {
            audio.load();
        } catch (erro) {
            console.warn("Não foi possível carregar o stream:", erro);
        }
    }

    /* ========================================================
       WEB AUDIO
       ======================================================== */

    function ativarAudioAmplificado() {

        /*
         * O Web Audio é criado somente uma vez.
         */

        if (audioContext) {

            if (audioContext.state === "suspended") {
                audioContext.resume().catch(() => {});
            }

            return;
        }

        try {

            const AudioContextClass =
                window.AudioContext ||
                window.webkitAudioContext;

            if (!AudioContextClass) {
                console.warn(
                    "Web Audio API não disponível neste navegador."
                );
                return;
            }

            audioContext = new AudioContextClass();

            mediaSource =
                audioContext.createMediaElementSource(audio);

            gainNode =
                audioContext.createGain();

            /*
             * Ganho adicional.
             */

            gainNode.gain.value = GANHO_AUDIO;

            /*
             * Fluxo:
             *
             * áudio
             *   ↓
             * ganho
             *   ↓
             * caixas de som
             */

            mediaSource.connect(gainNode);
            gainNode.connect(audioContext.destination);

            if (audioContext.state === "suspended") {
                audioContext.resume().catch(() => {});
            }

            console.log(
                "Amplificação de áudio ativada. Ganho:",
                GANHO_AUDIO
            );

        } catch (erro) {

            /*
             * Alguns streams externos podem bloquear
             * processamento via Web Audio por CORS.
             *
             * Nesse caso o player continua funcionando
             * normalmente sem amplificação.
             */

            console.warn(
                "Não foi possível ativar amplificação:",
                erro
            );

            audioContext = null;
            gainNode = null;
            mediaSource = null;

            audio.volume = 1.0;
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

            ativarAudioAmplificado();

            /*
             * Garante volume máximo do elemento.
             */

            audio.volume = 1.0;

            /*
             * Se o contexto estiver suspenso, tenta liberar.
             */

            if (
                audioContext &&
                audioContext.state === "suspended"
            ) {
                await audioContext.resume();
            }

            await audio.play();

            atualizarBotao(true);
            atualizarStatus(true);

            console.log("Onda Livre FM reproduzindo.");

        } catch (erro) {

            console.warn(
                "Autoplay bloqueado ou stream indisponível:",
                erro
            );

            atualizarBotao(false);
            atualizarStatus(false);

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
            console.warn("Erro ao pausar:", erro);
        }

        atualizarBotao(false);
        atualizarStatus(false);
    }

    /* ========================================================
       PLAY / PAUSE
       ======================================================== */

    function alternarPlay() {

        usuarioInteragiu = true;

        ativarAudioAmplificado();

        if (audio.paused) {
            tocar();
        } else {
            pausar();
        }
    }

    /* ========================================================
       BOTÃO PLAY
       ======================================================== */

    function atualizarBotao(tocando) {

        if (!playIcon) {
            return;
        }

        /*
         * Se o seu HTML utiliza SVG dentro do botão,
         * podemos trocar o conteúdo.
         */

        if (tocando) {

            playIcon.innerHTML = `
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true">
                    <rect x="6" y="5" width="4" height="14" rx="1"></rect>
                    <rect x="14" y="5" width="4" height="14" rx="1"></rect>
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
       STATUS
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
       VOLUME
       ======================================================== */

    function alterarVolume(valor) {

        let nivel = Number(valor);

        if (isNaN(nivel)) {
            nivel = 100;
        }

        nivel = Math.max(0, Math.min(100, nivel));

        audio.volume = nivel / 100;

        /*
         * O ganho adicional permanece no Web Audio.
         */

        if (gainNode) {
            gainNode.gain.value = GANHO_AUDIO;
        }

        atualizarIconeVolume(nivel);

    }

    /* ========================================================
       ÍCONE DO VOLUME
       ======================================================== */

    function atualizarIconeVolume(nivel) {

        /*
         * Não depende de um elemento específico.
         *
         * Se existir um elemento com #volumeIcon,
         * atualiza automaticamente.
         */

        const volumeIcon =
            document.getElementById("volumeIcon");

        if (!volumeIcon) {
            return;
        }

        if (nivel === 0) {

            volumeIcon.innerHTML = `
                <svg width="18" height="18"
                     viewBox="0 0 24 24"
                     fill="none"
                     stroke="currentColor"
                     stroke-width="2">
                    <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                    <line x1="23" y1="9" x2="17" y2="15"></line>
                    <line x1="17" y1="9" x2="23" y2="15"></line>
                </svg>
            `;

        } else if (nivel < 50) {

            volumeIcon.innerHTML = `
                <svg width="18" height="18"
                     viewBox="0 0 24 24"
                     fill="none"
                     stroke="currentColor"
                     stroke-width="2">
                    <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                    <path d="M15.5 8.5a5 5 0 0 1 0 7"></path>
                </svg>
            `;

        } else {

            volumeIcon.innerHTML = `
                <svg width="18" height="18"
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

    }

    /* ========================================================
       BOTÕES ANTERIOR / PRÓXIMA
       ======================================================== */

    function anterior() {

        /*
         * Rádio ao vivo normalmente não permite voltar faixa.
         *
         * Mantemos os botões funcionais sem quebrar o player.
         */

        console.log("Função anterior acionada.");
    }

    function proxima() {

        console.log("Função próxima acionada.");
    }

    /* ========================================================
       SHUFFLE
       ======================================================== */

    let shuffleAtivo = false;

    function alternarShuffle() {

        shuffleAtivo = !shuffleAtivo;

        if (shuffleBtn) {

            shuffleBtn.classList.toggle(
                "active",
                shuffleAtivo
            );

        }

    }

    /* ========================================================
       EVENTOS DO PLAYER
       ======================================================== */

    if (playBtn) {

        playBtn.addEventListener(
            "click",
            alternarPlay
        );

    }

    if (prevBtn) {

        prevBtn.addEventListener(
            "click",
            anterior
        );

    }

    if (nextBtn) {

        nextBtn.addEventListener(
            "click",
            proxima
        );

    }

    if (shuffleBtn) {

        shuffleBtn.addEventListener(
            "click",
            alternarShuffle
        );

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
       EVENTOS DO ÁUDIO
       ======================================================== */

    audio.addEventListener(
        "play",
        function () {

            atualizarBotao(true);
            atualizarStatus(true);

            ativarAudioAmplificado();

        }
    );

    audio.addEventListener(
        "playing",
        function () {

            atualizarBotao(true);
            atualizarStatus(true);

        }
    );

    audio.addEventListener(
        "pause",
        function () {

            atualizarBotao(false);

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
                "Transmissão temporariamente interrompida."
            );

        }
    );

    audio.addEventListener(
        "error",
        function () {

            console.error(
                "Erro no áudio:",
                audio.error
            );

            atualizarStatus(false);

        }
    );

    audio.addEventListener(
        "canplay",
        function () {

            console.log(
                "Transmissão disponível."
            );

            /*
             * Tenta iniciar automaticamente.
             */

            if (audio.paused) {
                tocar();
            }

        }
    );

    /* ========================================================
       METADADOS
       ======================================================== */

    function atualizarMusica(titulo, artista) {

        if (trackTitle && titulo) {
            trackTitle.textContent = titulo;
        }

        if (trackArtist && artista) {
            trackArtist.textContent = artista;
        }

    }

    /*
     * Informação inicial.
     */

    atualizarMusica(
        "Onda Livre FM",
        "Ao vivo"
    );

    /* ========================================================
       TENTATIVAS DE AUTOPLAY
       ======================================================== */

    function tentarAutoplay() {

        if (!audio.paused) {
            return;
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
        1000
    );

    /*
     * Terceira tentativa.
     */

    setTimeout(
        tentarAutoplay,
        2500
    );

    /*
     * Quarta tentativa.
     */

    setTimeout(
        tentarAutoplay,
        5000
    );

    /* ========================================================
       INTERAÇÃO DO USUÁRIO
       ======================================================== */

    /*
     * O navegador pode bloquear autoplay com som.
     *
     * Assim que o usuário tocar/clicar na página,
     * liberamos o áudio imediatamente.
     */

    function primeiraInteracao() {

        usuarioInteragiu = true;

        ativarAudioAmplificado();

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
                audio.paused
            ) {

                setTimeout(
                    tentarAutoplay,
                    300
                );

            }

        }
    );

    /* ========================================================
       INICIALIZAÇÃO
       ======================================================== */

    if (
        STREAM_URL &&
        !STREAM_URL.includes("COLOQUE_AQUI")
    ) {

        configurarStream();

    } else {

        console.warn(
            "A URL da transmissão ainda não foi configurada."
        );

    }

    atualizarBotao(false);
    atualizarStatus(false);

});
