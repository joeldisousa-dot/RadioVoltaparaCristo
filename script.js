/* =========================================================
   DE VOLTA PARA CRISTO
   PLAYER DE LOUVORES E MENSAGENS

   PLAYLIST CARREGADA DO GOOGLE APPS SCRIPT

   RECURSOS:
   - Até 500 músicas
   - Play / Pause
   - Próxima
   - Anterior
   - Aleatório
   - Volume
   - Autoplay
   - Primeiro clique para desbloquear áudio
   - Reprodução automática da próxima música
   - Cards dinâmicos
   - Pedidos enviados para Google Sheets
   ========================================================= */


/* =========================================================
   CONFIGURAÇÃO
========================================================= */

const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycby4tIS3B07OIcPVoCgKde_EL6PHkRXp46nMMNVh0yYxoYlpcSQeXbBqjLQ6vvVfnJcX4Q/exec";

const MAX_TRACKS = 500;

const VOLUME_INICIAL = 1.0;

const TENTATIVAS_PLAYLIST = 3;


/* =========================================================
   PLAYLIST
========================================================= */

let playlist = [];


/* =========================================================
   CONTROLE DO PLAYER
========================================================= */

let currentIndex = 0;

let shuffleEnabled = false;

let autoplayTentado = false;

let primeiroCliqueAtivado = false;

let playlistCarregada = false;

let carregandoPlaylist = false;

let trocandoMusica = false;


/* =========================================================
   ELEMENTOS DO HTML
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

const trackTitle =
    document.getElementById("trackTitle");

const trackArtist =
    document.getElementById("trackArtist");

const bottomPlayBtn =
    document.getElementById("bottomPlayBtn");

const bottomPlayIcon =
    document.getElementById("bottomPlayIcon");

const bottomPrevBtn =
    document.getElementById("bottomPrevBtn");

const bottomNextBtn =
    document.getElementById("bottomNextBtn");

const bottomTrackTitle =
    document.getElementById(
        "bottomTrackTitle"
    );

const bottomTrackArtist =
    document.getElementById(
        "bottomTrackArtist"
    );

const requestForm =
    document.getElementById(
        "requestForm"
    );

const requestStatus =
    document.getElementById(
        "requestStatus"
    );


/* =========================================================
   VERIFICAR CONFIGURAÇÃO
========================================================= */

function scriptConfigurado() {

    return (
        SCRIPT_URL &&
        SCRIPT_URL.trim() !== "" &&
        !SCRIPT_URL.includes("COLE_AQUI")
    );

}


/* =========================================================
   CONFIGURAR ÁUDIO
========================================================= */

function configurarAudio() {

    if (!audio) {
        return;
    }

    audio.autoplay = true;

    audio.muted = false;

    audio.volume = VOLUME_INICIAL;

    audio.playsInline = true;

    audio.preload = "auto";


    if (volume) {

        volume.value =
            VOLUME_INICIAL;

    }

}


/* =========================================================
   ESPERAR
========================================================= */

function esperar(
    milissegundos
) {

    return new Promise(
        resolve => {

            setTimeout(
                resolve,
                milissegundos
            );

        }
    );

}


/* =========================================================
   ERRO DA PLAYLIST
========================================================= */

function mostrarErroPlaylist(
    mensagem
) {

    const elementos = [

        document.getElementById(
            "playlistStatus"
        ),

        document.getElementById(
            "playlistMessage"
        )

    ];


    elementos.forEach(
        elemento => {

            if (elemento) {

                elemento.textContent =
                    mensagem;

            }

        }
    );


    console.warn(
        mensagem
    );

}


/* =========================================================
   CARREGAR PLAYLIST DO GOOGLE APPS SCRIPT
========================================================= */

async function carregarPlaylistDaPlanilha() {

    if (!scriptConfigurado()) {

        mostrarErroPlaylist(
            "Configure a URL do Apps Script no script.js."
        );

        return false;

    }


    if (carregandoPlaylist) {

        return false;

    }


    carregandoPlaylist = true;


    for (
        let tentativa = 1;
        tentativa <= TENTATIVAS_PLAYLIST;
        tentativa++
    ) {

        try {

            const separador =
                SCRIPT_URL.includes("?")
                    ? "&"
                    : "?";


            const url =
                SCRIPT_URL +
                separador +
                "action=playlist" +
                "&t=" +
                Date.now();


            console.log(
                "Carregando playlist..."
            );


            const resposta =
                await fetch(
                    url,
                    {
                        method: "GET",
                        cache: "no-store"
                    }
                );


            if (!resposta.ok) {

                throw new Error(
                    "HTTP " +
                    resposta.status
                );

            }


            const dados =
                await resposta.json();


            if (
                !dados ||
                dados.ok !== true
            ) {

                throw new Error(
                    dados &&
                    dados.error
                        ? dados.error
                        : "Resposta inválida."
                );

            }


            const tracks =
                Array.isArray(
                    dados.tracks
                )
                    ? dados.tracks
                    : [];


            /*
             * Monta a playlist.
             */

            playlist =
                tracks
                    .filter(
                        musica =>
                            musica &&
                            musica.url
                    )
                    .slice(
                        0,
                        MAX_TRACKS
                    )
                    .map(
                        (musica, index) => ({

                            id:
                                musica.id ??
                                index,

                            title:
                                musica.title ||
                                "Sem título",

                            artist:
                                musica.artist ||
                                "",

                            url:
                                String(
                                    musica.url
                                ).trim()

                        })
                    );


            playlistCarregada =
                true;


            carregandoPlaylist =
                false;


            console.log(
                "Playlist carregada:",
                playlist.length,
                "músicas."
            );


            /*
             * Nenhuma música.
             */

            if (
                playlist.length === 0
            ) {

                mostrarErroPlaylist(
                    "Nenhuma música cadastrada na planilha."
                );

                return true;

            }


            /*
             * Começa pela primeira música.
             */

            currentIndex = 0;


            /*
             * Prepara a primeira música,
             * mas não força o play aqui.
             */

            prepararMusica(
                currentIndex
            );


            /*
             * Renderiza os cards.
             */

            renderizarPlaylist();


            /*
             * Tenta iniciar automaticamente.
             */

            setTimeout(
                () => {

                    tentarAutoplay();

                },
                300
            );


            return true;


        } catch (erro) {

            console.error(
                "Erro ao carregar playlist. Tentativa " +
                tentativa +
                ":",
                erro
            );


            if (
                tentativa <
                TENTATIVAS_PLAYLIST
            ) {

                await esperar(
                    800 * tentativa
                );

            }

        }

    }


    carregandoPlaylist =
        false;


    mostrarErroPlaylist(
        "Não foi possível carregar a playlist."
    );


    return false;

}


/* =========================================================
   PREPARAR MÚSICA
========================================================= */

function prepararMusica(
    index
) {

    if (
        !audio ||
        !playlist.length
    ) {

        return false;

    }


    /*
     * Corrige o índice.
     */

    if (
        index < 0
    ) {

        index =
            playlist.length - 1;

    }


    if (
        index >=
        playlist.length
    ) {

        index = 0;

    }


    currentIndex =
        index;


    const musica =
        playlist[
            currentIndex
        ];


    if (
        !musica ||
        !musica.url
    ) {

        console.error(
            "Música inválida:",
            musica
        );

        return false;

    }


    console.log(
        "Preparando:",
        currentIndex,
        musica.title
    );


    /*
     * Para a faixa anterior.
     */

    audio.pause();


    /*
     * Remove a fonte anterior.
     */

    audio.removeAttribute(
        "src"
    );


    /*
     * Define a nova fonte.
     */

    audio.src =
        musica.url;


    /*
     * Configura o áudio.
     */

    audio.preload =
        "auto";

    audio.playsInline =
        true;

    audio.muted =
        false;


    if (volume) {

        audio.volume =
            Number(
                volume.value
            );

    } else {

        audio.volume =
            VOLUME_INICIAL;

    }


    /*
     * Atualiza informações.
     */

    atualizarInformacoes();

    atualizarCardAtivo();


    /*
     * Solicita carregamento.
     */

    audio.load();


    return true;

}


/* =========================================================
   AGUARDAR ÁUDIO CARREGAR
========================================================= */

function aguardarAudioCarregar() {

    return new Promise(
        resolve => {

            /*
             * Se já possui dados suficientes,
             * não precisa aguardar.
             */

            if (
                audio.readyState >= 3
            ) {

                resolve();

                return;

            }


            let finalizado =
                false;


            function finalizar() {

                if (
                    finalizado
                ) {

                    return;

                }


                finalizado =
                    true;


                audio.removeEventListener(
                    "canplay",
                    finalizar
                );


                audio.removeEventListener(
                    "canplaythrough",
                    finalizar
                );


                audio.removeEventListener(
                    "loadeddata",
                    finalizar
                );


                resolve();

            }


            audio.addEventListener(
                "canplay",
                finalizar
            );


            audio.addEventListener(
                "canplaythrough",
                finalizar
            );


            audio.addEventListener(
                "loadeddata",
                finalizar
            );


            /*
             * Segurança.
             */

            setTimeout(
                finalizar,
                5000
            );

        }
    );

}


/* =========================================================
   TOCAR MÚSICA ATUAL
========================================================= */

async function tocarMusicaAtual() {

    if (
        !audio ||
        !playlist.length
    ) {

        return false;

    }


    try {

        /*
         * Garante volume.
         */

        if (volume) {

            audio.volume =
                Number(
                    volume.value
                );

        } else {

            audio.volume =
                VOLUME_INICIAL;

        }


        audio.muted =
            false;


        /*
         * Se ainda não existe src,
         * prepara a música.
         */

        if (!audio.src) {

            prepararMusica(
                currentIndex
            );

        }


        /*
         * Espera o carregamento.
         */

        await aguardarAudioCarregar();


        /*
         * Executa play.
         */

        const promessa =
            audio.play();


        if (
            promessa !== undefined
        ) {

            await promessa;

        }


        /*
         * Sucesso.
         */

        primeiroCliqueAtivado =
            true;


        atualizarBotoes(
            true
        );


        removerDetectorPrimeiroClique();


        console.log(
            "▶ Tocando:",
            playlist[currentIndex].title
        );


        return true;


    } catch (erro) {

        console.error(
            "Erro ao iniciar reprodução:",
            erro
        );


        atualizarBotoes(
            false
        );


        return false;

    }

}


/* =========================================================
   INICIAR ÁUDIO
========================================================= */

async function iniciarAudio() {

    if (
        !playlist.length ||
        !audio
    ) {

        return false;

    }


    /*
     * Se já está tocando,
     * não faz nada.
     */

    if (
        !audio.paused
    ) {

        return true;

    }


    return await tocarMusicaAtual();

}


/* =========================================================
   AUTOPLAY
========================================================= */

function tentarAutoplay() {

    if (
        autoplayTentado
    ) {

        return;

    }


    autoplayTentado =
        true;


    configurarAudio();


    if (
        playlist.length
    ) {

        iniciarAudio();

    }

}


/* =========================================================
   PRIMEIRO CLIQUE / TOQUE
========================================================= */

function ativarNoPrimeiroClique() {

    if (
        !playlist.length
    ) {

        return;

    }


    if (
        !audio.paused
    ) {

        return;

    }


    iniciarAudio();

}


/* =========================================================
   ADICIONAR DETECTOR DE INTERAÇÃO
========================================================= */

function adicionarDetectorPrimeiroClique() {

    document.addEventListener(
        "click",
        ativarNoPrimeiroClique,
        {
            capture: true,
            passive: true
        }
    );


    document.addEventListener(
        "touchstart",
        ativarNoPrimeiroClique,
        {
            capture: true,
            passive: true
        }
    );


    document.addEventListener(
        "keydown",
        ativarNoPrimeiroClique,
        {
            capture: true,
            passive: true
        }
    );

}


/* =========================================================
   REMOVER DETECTOR
========================================================= */

function removerDetectorPrimeiroClique() {

    document.removeEventListener(
        "click",
        ativarNoPrimeiroClique,
        true
    );


    document.removeEventListener(
        "touchstart",
        ativarNoPrimeiroClique,
        true
    );


    document.removeEventListener(
        "keydown",
        ativarNoPrimeiroClique,
        true
    );

}


/* =========================================================
   ATUALIZAR BOTÕES
========================================================= */

function atualizarBotoes(
    tocando
) {

    const simbolo =
        tocando
            ? "❚❚"
            : "▶";


    if (playIcon) {

        playIcon.textContent =
            simbolo;

    }


    if (bottomPlayIcon) {

        bottomPlayIcon.textContent =
            simbolo;

    }


    if (playBtn) {

        playBtn.setAttribute(
            "aria-label",
            tocando
                ? "Pausar"
                : "Reproduzir"
        );

    }


    if (bottomPlayBtn) {

        bottomPlayBtn.setAttribute(
            "aria-label",
            tocando
                ? "Pausar"
                : "Reproduzir"
        );

    }

}


/* =========================================================
   PLAY / PAUSE
========================================================= */

function alternarPlay() {

    if (
        !playlist.length
    ) {

        return;

    }


    if (
        audio.paused
    ) {

        iniciarAudio();

    } else {

        audio.pause();

        atualizarBotoes(
            false
        );

    }

}


/* =========================================================
   PRÓXIMA MÚSICA
========================================================= */

async function proximaMusica() {

    if (
        !playlist.length
    ) {

        return;

    }


    /*
     * Evita duas trocas simultâneas.
     */

    if (
        trocandoMusica
    ) {

        return;

    }


    trocandoMusica =
        true;


    try {

        let novoIndex;


        /*
         * ALEATÓRIO
         */

        if (
            shuffleEnabled &&
            playlist.length > 1
        ) {

            do {

                novoIndex =
                    Math.floor(
                        Math.random() *
                        playlist.length
                    );

            } while (
                novoIndex ===
                currentIndex
            );

        }


        /*
         * SEQUENCIAL
         */

        else {

            novoIndex =
                currentIndex + 1;


            if (
                novoIndex >=
                playlist.length
            ) {

                novoIndex = 0;

            }

        }


        console.log(
            "Próxima música:",
            novoIndex,
            playlist[novoIndex].title
        );


        /*
         * Prepara a próxima.
         */

        prepararMusica(
            novoIndex
        );


        /*
         * Aguarda o carregamento
         * e toca.
         */

        const tocou =
            await tocarMusicaAtual();


        if (!tocou) {

            console.warn(
                "Não foi possível iniciar a próxima música."
            );

        }


    } finally {

        trocandoMusica =
            false;

    }

}


/* =========================================================
   MÚSICA ANTERIOR
========================================================= */

async function musicaAnterior() {

    if (
        !playlist.length
    ) {

        return;

    }


    /*
     * Se já passou de 5 segundos,
     * apenas volta para o início.
     */

    if (
        audio.currentTime > 5
    ) {

        audio.currentTime =
            0;

        return;

    }


    let novoIndex =
        currentIndex - 1;


    if (
        novoIndex < 0
    ) {

        novoIndex =
            playlist.length - 1;

    }


    await carregarMusica(
        novoIndex,
        true
    );

}


/* =========================================================
   BOTÃO PLAY PRINCIPAL
========================================================= */

if (playBtn) {

    playBtn.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            alternarPlay();

        }
    );

}


/* =========================================================
   BOTÃO PLAY INFERIOR
========================================================= */

if (bottomPlayBtn) {

    bottomPlayBtn.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            alternarPlay();

        }
    );

}


/* =========================================================
   BOTÃO HERO
========================================================= */

if (heroPlayBtn) {

    heroPlayBtn.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            iniciarAudio();

        }
    );

}


/* =========================================================
   ANTERIOR
========================================================= */

if (prevBtn) {

    prevBtn.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            musicaAnterior();

        }
    );

}


if (bottomPrevBtn) {

    bottomPrevBtn.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            musicaAnterior();

        }
    );

}


/* =========================================================
   PRÓXIMA
========================================================= */

if (nextBtn) {

    nextBtn.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            proximaMusica();

        }
    );

}


if (bottomNextBtn) {

    bottomNextBtn.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            proximaMusica();

        }
    );

}


/* =========================================================
   ALEATÓRIO
========================================================= */

if (shuffleBtn) {

    shuffleBtn.addEventListener(
        "click",
        event => {

            event.stopPropagation();


            shuffleEnabled =
                !shuffleEnabled;


            shuffleBtn.style.opacity =
                shuffleEnabled
                    ? "1"
                    : ".55";


            shuffleBtn.title =
                shuffleEnabled
                    ? "Aleatório ativado"
                    : "Aleatório desativado";

        }
    );

}


/* =========================================================
   VOLUME
========================================================= */

if (volume) {

    volume.addEventListener(
        "input",
        event => {

            event.stopPropagation();


            if (!audio) {
                return;
            }


            audio.volume =
                Number(
                    volume.value
                );


            /*
             * Se o usuário interagir com o volume
             * enquanto o áudio estiver parado,
             * tenta iniciar.
             */

            if (
                audio.paused &&
                playlist.length
            ) {

                iniciarAudio();

            }

        }
    );

}


/* =========================================================
   EVENTOS DO ÁUDIO
========================================================= */

if (audio) {


    /*
     * PLAY
     */

    audio.addEventListener(
        "play",
        () => {

            atualizarBotoes(
                true
            );

        }
    );


    /*
     * PAUSE
     */

    audio.addEventListener(
        "pause",
        () => {

            atualizarBotoes(
                false
            );

        }
    );


    /*
     * =====================================================
     * FIM DA MÚSICA
     *
     * ESTE É O PONTO PRINCIPAL DA CORREÇÃO.
     * =====================================================
     */

    audio.addEventListener(
        "ended",
        () => {

            console.log(
                "================================"
            );

            console.log(
                "Música terminou."
            );

            console.log(
                "Índice atual:",
                currentIndex
            );

            console.log(
                "Iniciando próxima..."
            );

            console.log(
                "================================"
            );


            /*
             * Aguarda o navegador finalizar
             * completamente a faixa anterior.
             */

            setTimeout(
                () => {

                    proximaMusica();

                },
                100
            );

        }
    );


    /*
     * ERRO
     */

    audio.addEventListener(
        "error",
        () => {

            console.error(
                "================================"
            );

            console.error(
                "ERRO AO CARREGAR ÁUDIO"
            );

            console.error(
                "Índice:",
                currentIndex
            );

            console.error(
                "Música:",
                playlist[currentIndex]
                    ? playlist[currentIndex].title
                    : "desconhecida"
            );

            console.error(
                "URL:",
                audio.src
            );

            console.error(
                "Código:",
                audio.error
                    ? audio.error.code
                    : "desconhecido"
            );

            console.error(
                "================================"
            );


            atualizarBotoes(
                false
            );

        }
    );

}


/* =========================================================
   CONTAINER DA PLAYLIST
========================================================= */

function encontrarContainerPlaylist() {

    return (

        document.getElementById(
            "playlistContainer"
        ) ||

        document.getElementById(
            "louvoresGrid"
        ) ||

        document.getElementById(
            "playlist"
        ) ||

        document.querySelector(
            ".louvores-grid"
        )

    );

}


/* =========================================================
   RENDERIZAR PLAYLIST
========================================================= */

function renderizarPlaylist() {

    const container =
        encontrarContainerPlaylist();


    if (!container) {

        return;

    }


    container.innerHTML =
        "";


    playlist.forEach(
        (musica, index) => {

            const card =
                document.createElement(
                    "button"
                );


            card.type =
                "button";


            card.className =
                "louvor-card";


            card.dataset.playIndex =
                index;


            card.innerHTML = `

                <span class="louvor-card-icon">
                    ▶
                </span>

                <span class="louvor-card-info">

                    <strong>
                        ${escaparHTML(
                            musica.title
                        )}
                    </strong>

                    <small>
                        ${escaparHTML(
                            musica.artist
                        )}
                    </small>

                </span>

            `;


            card.addEventListener(
                "click",
                event => {

                    event.stopPropagation();


                    carregarMusica(
                        index,
                        true
                    );


                    const player =
                        document.querySelector(
                            ".player-card"
                        );


                    if (player) {

                        player.scrollIntoView({
                            behavior:
                                "smooth",

                            block:
                                "center"
                        });

                    }

                }
            );


            container.appendChild(
                card
            );

        }
    );


    atualizarCardAtivo();

}


/* =========================================================
   ATUALIZAR CARD ATIVO
========================================================= */

function atualizarCardAtivo() {

    const container =
        encontrarContainerPlaylist();


    if (!container) {

        return;

    }


    const cards =
        container.querySelectorAll(
            "[data-play-index]"
        );


    cards.forEach(
        card => {

            const index =
                Number(
                    card.dataset.playIndex
                );


            card.classList.toggle(
                "tocando",
                index ===
                currentIndex
            );

        }
    );

}


/* =========================================================
   ATUALIZAR INFORMAÇÕES
========================================================= */

function atualizarInformacoes() {

    const musica =
        playlist[
            currentIndex
        ];


    if (!musica) {

        return;

    }


    if (trackTitle) {

        trackTitle.textContent =
            musica.title;

    }


    if (trackArtist) {

        trackArtist.textContent =
            musica.artist;

    }


    if (bottomTrackTitle) {

        bottomTrackTitle.textContent =
            musica.title;

    }


    if (bottomTrackArtist) {

        bottomTrackArtist.textContent =
            musica.artist;

    }

}


/* =========================================================
   ESCAPAR HTML
========================================================= */

function escaparHTML(
    texto
) {

    return String(
        texto ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   COMPATIBILIDADE COM CARDS EXISTENTES
========================================================= */

function ativarCardsExistentes() {

    document
        .querySelectorAll(
            "[data-play-index]"
        )
        .forEach(
            botao => {

                /*
                 * Evita duplicidade.
                 */

                if (
                    botao.dataset.playerBound ===
                    "true"
                ) {

                    return;

                }


                botao.dataset.playerBound =
                    "true";


                botao.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(
                                botao.dataset.playIndex
                            );


                        if (
                            Number.isNaN(
                                index
                            )
                        ) {

                            return;

                        }


                        if (
                            !playlist[index]
                        ) {

                            return;

                        }


                        carregarMusica(
                            index,
                            true
                        );

                    }
                );

            }
        );

}


/* =========================================================
   FORMULÁRIO DE PEDIDOS
========================================================= */

if (requestForm) {

    requestForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const campoNome =
                document.getElementById(
                    "reqName"
                );


            const campoMusica =
                document.getElementById(
                    "reqSong"
                );


            const campoMensagem =
                document.getElementById(
                    "reqMessage"
                );


            const nome =
                campoNome
                    ? campoNome.value.trim()
                    : "";


            const musica =
                campoMusica
                    ? campoMusica.value.trim()
                    : "";


            const mensagem =
                campoMensagem
                    ? campoMensagem.value.trim()
                    : "";


            if (
                !nome ||
                !musica ||
                !mensagem
            ) {

                if (requestStatus) {

                    requestStatus.textContent =
                        "Preencha todos os campos.";

                }

                return;

            }


            if (
                !scriptConfigurado()
            ) {

                if (requestStatus) {

                    requestStatus.textContent =
                        "Sistema de pedidos não configurado.";

                }

                return;

            }


            if (requestStatus) {

                requestStatus.textContent =
                    "Enviando pedido...";

            }


            try {

                const dados =
                    new URLSearchParams();


                dados.append(
                    "action",
                    "pedido"
                );


                dados.append(
                    "nome",
                    nome
                );


                dados.append(
                    "musica",
                    musica +
                    " — " +
                    mensagem
                );


                await fetch(
                    SCRIPT_URL,
                    {
                        method:
                            "POST",

                        mode:
                            "no-cors",

                        body:
                            dados
                    }
                );


                if (requestStatus) {

                    requestStatus.textContent =
                        "Seu pedido foi recebido. Deus abençoe você!";

                }


                requestForm.reset();


            } catch (erro) {

                console.error(
                    "Erro ao enviar pedido:",
                    erro
                );


                /*
                 * Fallback GET.
                 */

                try {

                    const url =
                        SCRIPT_URL +
                        (
                            SCRIPT_URL.includes("?")
                                ? "&"
                                : "?"
                        ) +
                        "action=pedido" +
                        "&nome=" +
                        encodeURIComponent(
                            nome
                        ) +
                        "&musica=" +
                        encodeURIComponent(
                            musica +
                            " — " +
                            mensagem
                        );


                    await fetch(
                        url,
                        {
                            method:
                                "GET",

                            mode:
                                "no-cors"
                        }
                    );


                    if (requestStatus) {

                        requestStatus.textContent =
                            "Seu pedido foi recebido. Deus abençoe você!";

                    }


                    requestForm.reset();


                } catch (erro2) {

                    console.error(
                        "Falha no envio:",
                        erro2
                    );


                    if (requestStatus) {

                        requestStatus.textContent =
                            "Não foi possível enviar o pedido. Tente novamente.";

                    }

                }

            }

        }
    );

}


/* =========================================================
   TECLA ESPAÇO
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        const elemento =
            event.target;


        const digitando =
            elemento &&
            (
                elemento.tagName ===
                "INPUT" ||

                elemento.tagName ===
                "TEXTAREA" ||

                elemento.tagName ===
                "SELECT"
            );


        if (digitando) {

            return;

        }


        if (
            event.code ===
            "Space"
        ) {

            event.preventDefault();


            alternarPlay();

        }

    }
);


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log(
            "================================"
        );

        console.log(
            "DE VOLTA PARA CRISTO"
        );

        console.log(
            "Inicializando player..."
        );

        console.log(
            "================================"
        );


        /*
         * Configura áudio.
         */

        configurarAudio();


        /*
         * Instala detector de interação.
         */

        adicionarDetectorPrimeiroClique();


        /*
         * Ativa cards que já existam
         * no HTML.
         */

        ativarCardsExistentes();


        /*
         * Carrega playlist.
         */

        await carregarPlaylistDaPlanilha();

    }
);


/* =========================================================
   GARANTIR VOLUME
========================================================= */

window.addEventListener(
    "load",
    () => {

        if (!audio) {

            return;

        }


        audio.volume =
            VOLUME_INICIAL;


        if (volume) {

            volume.value =
                VOLUME_INICIAL;

        }

    }
);


/* =========================================================
   LOG FINAL
========================================================= */

console.log(
    "De Volta para Cristo — Player carregado."
);

console.log(
    "Playlist será carregada pelo Google Apps Script."
);
