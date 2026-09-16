/* =========================================================
   DE VOLTA PARA CRISTO
   PLAYER DE LOUVORES E MENSAGENS
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

let currentIndex = 0;

let shuffleEnabled = false;

let autoplayTentado = false;

let primeiroCliqueAtivado = false;

let playlistCarregada = false;

let carregandoPlaylist = false;

let trocandoMusica = false;


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
   CONFIGURAÇÃO
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

function esperar(ms) {

    return new Promise(
        resolve =>
            setTimeout(resolve, ms)
    );

}


/* =========================================================
   CARREGAR PLAYLIST
========================================================= */

async function carregarPlaylistDaPlanilha() {

    if (!scriptConfigurado()) {

        mostrarErroPlaylist(
            "Configure a URL do Apps Script."
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
                    dados?.error ||
                    "Resposta inválida."
                );

            }


            const tracks =
                Array.isArray(dados.tracks)
                    ? dados.tracks
                    : [];


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


            playlistCarregada = true;

            carregandoPlaylist = false;


            console.log(
                "Playlist carregada:",
                playlist.length
            );


            if (!playlist.length) {

                mostrarErroPlaylist(
                    "Nenhuma música cadastrada na planilha."
                );

                return true;

            }


            currentIndex = 0;


            /*
             * Carrega a primeira música.
             */

            prepararMusica(
                currentIndex
            );


            renderizarPlaylist();


            /*
             * Tenta iniciar automaticamente.
             */

            setTimeout(
                () => {

                    iniciarAudio();

                },
                300
            );


            return true;


        } catch (erro) {

            console.error(
                "Erro ao carregar playlist:",
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


    carregandoPlaylist = false;


    mostrarErroPlaylist(
        "Não foi possível carregar a playlist."
    );


    return false;

}


/* =========================================================
   MENSAGEM DE ERRO
========================================================= */

function mostrarErroPlaylist(
    mensagem
) {

    [
        document.getElementById(
            "playlistStatus"
        ),

        document.getElementById(
            "playlistMessage"
        )

    ].forEach(
        elemento => {

            if (elemento) {

                elemento.textContent =
                    mensagem;

            }

        }
    );


    console.warn(mensagem);

}


/* =========================================================
   PREPARAR MÚSICA
========================================================= */

function prepararMusica(index) {

    if (
        !audio ||
        !playlist.length
    ) {

        return false;

    }


    if (index < 0) {

        index =
            playlist.length - 1;

    }


    if (
        index >=
        playlist.length
    ) {

        index = 0;

    }


    currentIndex = index;


    const musica =
        playlist[currentIndex];


    if (
        !musica ||
        !musica.url
    ) {

        return false;

    }


    /*
     * Para completamente a música anterior.
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
     * Mantém o volume atual.
     */

    if (volume) {

        audio.volume =
            Number(volume.value);

    } else {

        audio.volume =
            VOLUME_INICIAL;

    }


    audio.muted = false;

    audio.preload = "auto";

    audio.playsInline = true;


    /*
     * Atualiza título/artista.
     */

    atualizarInformacoes();


    atualizarCardAtivo();


    /*
     * Inicia carregamento.
     */

    audio.load();


    console.log(
        "Música preparada:",
        musica.title
    );


    return true;

}


/* =========================================================
   CARREGAR E TOCAR MÚSICA
========================================================= */

async function carregarMusica(
    index,
    tocar = false
) {

    if (
        !playlist.length ||
        !audio
    ) {

        return false;

    }


    if (trocandoMusica) {

        return false;

    }


    trocandoMusica = true;


    try {

        const preparada =
            prepararMusica(index);


        if (!preparada) {

            return false;

        }


        if (!tocar) {

            return true;

        }


        /*
         * Espera o navegador começar a
         * carregar o novo arquivo.
         */

        await esperarAudioPronto();


        /*
         * Agora sim chama play().
         */

        return await executarPlay();


    } finally {

        trocandoMusica = false;

    }

}


/* =========================================================
   ESPERAR ÁUDIO FICAR PRONTO
========================================================= */

function esperarAudioPronto() {

    return new Promise(
        resolve => {

            if (
                audio.readyState >= 2
            ) {

                resolve();

                return;

            }


            let resolvido = false;


            const finalizar = () => {

                if (resolvido) {
                    return;
                }

                resolvido = true;


                audio.removeEventListener(
                    "canplay",
                    finalizar
                );


                audio.removeEventListener(
                    "loadedmetadata",
                    finalizar
                );


                resolve();

            };


            audio.addEventListener(
                "canplay",
                finalizar,
                {
                    once: true
                }
            );


            audio.addEventListener(
                "loadedmetadata",
                finalizar,
                {
                    once: true
                }
            );


            /*
             * Segurança caso o navegador
             * não dispare o evento rapidamente.
             */

            setTimeout(
                finalizar,
                5000
            );

        }
    );

}


/* =========================================================
   EXECUTAR PLAY
========================================================= */

async function executarPlay() {

    if (
        !audio ||
        !playlist.length
    ) {

        return false;

    }


    try {

        audio.muted = false;


        if (volume) {

            audio.volume =
                Number(
                    volume.value
                );

        }


        const promessa =
            audio.play();


        if (
            promessa !== undefined
        ) {

            await promessa;

        }


        primeiroCliqueAtivado =
            true;


        atualizarBotoes(true);


        removerDetectorPrimeiroClique();


        console.log(
            "Tocando:",
            playlist[currentIndex].title
        );


        return true;


    } catch (erro) {

        console.warn(
            "Play bloqueado:",
            erro
        );


        atualizarBotoes(false);


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
     * Se não existe src,
     * prepara a música atual.
     */

    if (!audio.src) {

        prepararMusica(
            currentIndex
        );

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


    return await executarPlay();

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


    autoplayTentado = true;


    configurarAudio();


    if (
        playlist.length
    ) {

        iniciarAudio();

    }

}


/* =========================================================
   PRIMEIRA INTERAÇÃO
========================================================= */

function ativarNoPrimeiroClique() {

    if (
        !playlist.length
    ) {

        return;

    }


    iniciarAudio();

}


/* =========================================================
   DETECTOR DE INTERAÇÃO
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
   BOTÕES
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

        atualizarBotoes(false);

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


    let novoIndex;


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

    } else {

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
        novoIndex
    );


    await carregarMusica(
        novoIndex,
        true
    );

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


    if (
        audio.currentTime > 5
    ) {

        audio.currentTime = 0;

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
   BOTÕES DE CONTROLE
========================================================= */

if (playBtn) {

    playBtn.addEventListener(
        "click",
        alternarPlay
    );

}


if (bottomPlayBtn) {

    bottomPlayBtn.addEventListener(
        "click",
        alternarPlay
    );

}


if (heroPlayBtn) {

    heroPlayBtn.addEventListener(
        "click",
        iniciarAudio
    );

}


if (prevBtn) {

    prevBtn.addEventListener(
        "click",
        musicaAnterior
    );

}


if (bottomPrevBtn) {

    bottomPrevBtn.addEventListener(
        "click",
        musicaAnterior
    );

}


if (nextBtn) {

    nextBtn.addEventListener(
        "click",
        proximaMusica
    );

}


if (bottomNextBtn) {

    bottomNextBtn.addEventListener(
        "click",
        proximaMusica
    );

}


/* =========================================================
   ALEATÓRIO
========================================================= */

if (shuffleBtn) {

    shuffleBtn.addEventListener(
        "click",
        () => {

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
        () => {

            if (!audio) {
                return;
            }


            audio.volume =
                Number(
                    volume.value
                );


            /*
             * Interação do usuário.
             * Aproveita para tentar iniciar
             * caso esteja parado.
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

    audio.addEventListener(
        "play",
        () => {

            atualizarBotoes(true);

        }
    );


    audio.addEventListener(
        "pause",
        () => {

            atualizarBotoes(false);

        }
    );


    /*
     * =====================================================
     * PRINCIPAL CORREÇÃO
     *
     * Quando a música termina, espera a troca
     * do src e inicia a próxima.
     * =====================================================
     */

    audio.addEventListener(
        "ended",
        async () => {

            console.log(
                "Música terminou."
            );


            await proximaMusica();

        }
    );


    audio.addEventListener(
        "error",
        () => {

            console.error(
                "Erro no áudio:",
                audio.src
            );


            atualizarBotoes(false);

        }
    );

}


/* =========================================================
   CARDS
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


    container.innerHTML = "";


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
                () => {

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
   CARD ATIVO
========================================================= */

function atualizarCardAtivo() {

    const container =
        encontrarContainerPlaylist();


    if (!container) {

        return;

    }


    container
        .querySelectorAll(
            "[data-play-index]"
        )
        .forEach(
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
   CARDS EXISTENTES
========================================================= */

function ativarCardsExistentes() {

    document
        .querySelectorAll(
            "[data-play-index]"
        )
        .forEach(
            botao => {

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
                            Number.isNaN(index)
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
                elemento.tagName === "INPUT" ||
                elemento.tagName === "TEXTAREA" ||
                elemento.tagName === "SELECT"
            );


        if (digitando) {
            return;
        }


        if (
            event.code === "Space"
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

        configurarAudio();


        adicionarDetectorPrimeiroClique();


        ativarCardsExistentes();


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
   LOG
========================================================= */

console.log(
    "De Volta para Cristo — Player carregado."
);

console.log(
    "Playlist será carregada pelo Google Apps Script."
);
