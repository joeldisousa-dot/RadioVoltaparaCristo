/* =========================================================
   DE VOLTA PARA CRISTO
   PLAYER PRINCIPAL
   ========================================================= */

"use strict";

/* =========================================================
   CONFIGURAÇÕES
========================================================= */

const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycby4tIS3B07OIcPVoCgKde_EL6PHkRXp46nMMNVh0yYxoYlpcSQeXbBqjLQ6vvVfnJcX4Q/exec";

const MAX_TRACKS = 500;
const VOLUME_INICIAL = 1.0;
const TENTATIVAS_PLAYLIST = 3;

/* =========================================================
   ESTADO DO PLAYER
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
   ELEMENTOS DO DOM
========================================================= */

const audio = document.getElementById("audio");

const playBtn = document.getElementById("playBtn");
const playIcon = document.getElementById("playIcon");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const volume = document.getElementById("volume");

const trackTitle = document.getElementById("trackTitle");
const trackArtist = document.getElementById("trackArtist");

const heroPlayBtn = document.getElementById("heroPlayBtn");

const bottomPlayBtn = document.getElementById("bottomPlayBtn");
const bottomPlayIcon = document.getElementById("bottomPlayIcon");

const bottomPrevBtn = document.getElementById("bottomPrevBtn");
const bottomNextBtn = document.getElementById("bottomNextBtn");

const bottomTrackTitle = document.getElementById("bottomTrackTitle");
const bottomTrackArtist = document.getElementById("bottomTrackArtist");

const shuffleBtn = document.getElementById("shuffleBtn");

/* =========================================================
   VERIFICAÇÃO DA CONFIGURAÇÃO
========================================================= */

function scriptConfigurado() {

    return (
        SCRIPT_URL &&
        SCRIPT_URL.indexOf("script.google.com/macros/s/") !== -1
    );
}

/* =========================================================
   CONFIGURAÇÃO DO ÁUDIO
========================================================= */

function configurarAudio() {

    if (!audio) {
        console.error("Elemento #audio não encontrado.");
        return;
    }

    audio.autoplay = true;
    audio.preload = "auto";
    audio.controls = false;
    audio.muted = false;
    audio.volume = VOLUME_INICIAL;
    audio.playsInline = true;

    console.log("Áudio configurado.");
}

/* =========================================================
   ESPERA
========================================================= */

function esperar(ms) {

    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

/* =========================================================
   ESCAPAR HTML
========================================================= */

function escaparHTML(valor) {

    return String(valor ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* =========================================================
   ERRO DA PLAYLIST
========================================================= */

function mostrarErroPlaylist(mensagem) {

    console.error("ERRO PLAYLIST:", mensagem);

    const container =
        document.getElementById("playlist") ||
        document.querySelector(".playlist");

    if (!container) {
        return;
    }

    container.innerHTML = `
        <div class="playlist-error">
            <strong>Não foi possível carregar a playlist.</strong>
            <br>
            <span>${escaparHTML(mensagem)}</span>
        </div>
    `;
}

/* =========================================================
   CARREGAR PLAYLIST
========================================================= */

async function carregarPlaylistDaPlanilha() {

    if (carregandoPlaylist) {
        return;
    }

    if (!scriptConfigurado()) {

        mostrarErroPlaylist(
            "A URL do Google Apps Script não está configurada."
        );

        return;
    }

    carregandoPlaylist = true;

    console.log("Carregando playlist...");

    let ultimoErro = null;

    try {

        for (
            let tentativa = 1;
            tentativa <= TENTATIVAS_PLAYLIST;
            tentativa++
        ) {

            try {

                const url =
                    SCRIPT_URL +
                    "?action=playlist&t=" +
                    Date.now();

                const resposta = await fetch(url, {
                    method: "GET",
                    cache: "no-store"
                });

                if (!resposta.ok) {

                    throw new Error(
                        "HTTP " + resposta.status
                    );
                }

                const dados = await resposta.json();

                if (!dados || dados.ok !== true) {

                    throw new Error(
                        dados && dados.error
                            ? dados.error
                            : "Resposta inválida do servidor."
                    );
                }

                if (!Array.isArray(dados.tracks)) {

                    throw new Error(
                        "A resposta não contém a lista de músicas."
                    );
                }

                playlist = dados.tracks
                    .filter(item => item && item.url)
                    .slice(0, MAX_TRACKS)
                    .map((item, index) => {

                        return {
                            id:
                                item.id !== undefined
                                    ? item.id
                                    : index,

                            title:
                                item.title ||
                                item.titulo ||
                                "Sem título",

                            artist:
                                item.artist ||
                                item.artista ||
                                "De Volta para Cristo",

                            url:
                                String(item.url).trim(),

                            sourceUrl:
                                item.sourceUrl ||
                                item.url
                        };
                    });

                playlistCarregada = true;
                currentIndex = 0;

                console.log(
                    "Playlist carregada:",
                    playlist.length,
                    "músicas."
                );

                if (!playlist.length) {

                    mostrarErroPlaylist(
                        "A playlist está vazia."
                    );

                    return;
                }

                prepararMusica(0);

                renderizarPlaylist();

                atualizarBotoes();

                setTimeout(() => {

                    tentarAutoplay();

                }, 300);

                return;

            } catch (erro) {

                ultimoErro = erro;

                console.warn(
                    "Tentativa " +
                    tentativa +
                    " de carregar playlist falhou:",
                    erro
                );

                if (tentativa < TENTATIVAS_PLAYLIST) {

                    await esperar(800);
                }
            }
        }

        mostrarErroPlaylist(
            ultimoErro
                ? ultimoErro.message
                : "Erro desconhecido."
        );

    } finally {

        carregandoPlaylist = false;
    }
}

/* =========================================================
   NORMALIZAR ÍNDICE
========================================================= */

function normalizarIndice(index) {

    if (!playlist.length) {
        return 0;
    }

    let novo = Number(index);

    if (!Number.isFinite(novo)) {
        novo = 0;
    }

    novo = Math.trunc(novo);

    while (novo < 0) {
        novo += playlist.length;
    }

    while (novo >= playlist.length) {
        novo -= playlist.length;
    }

    return novo;
}

/* =========================================================
   PREPARAR MÚSICA
========================================================= */

function prepararMusica(index) {

    if (!audio || !playlist.length) {
        return false;
    }

    index = normalizarIndice(index);

    const musica = playlist[index];

    if (!musica || !musica.url) {

        console.error(
            "Música sem URL no índice:",
            index
        );

        return false;
    }

    currentIndex = index;

    console.log(
        "Preparando:",
        index,
        musica.title
    );

    try {

        audio.pause();

        /*
         * Não usamos crossOrigin aqui.
         * Isso evita problemas de CORS com servidores externos.
         */

        audio.src = musica.url;

        audio.preload = "auto";
        audio.autoplay = true;
        audio.muted = false;

        if (volume) {

            const valorVolume =
                Number(volume.value);

            if (
                Number.isFinite(valorVolume) &&
                valorVolume >= 0 &&
                valorVolume <= 1
            ) {

                audio.volume = valorVolume;

            } else {

                audio.volume = VOLUME_INICIAL;
            }

        } else {

            audio.volume = VOLUME_INICIAL;
        }

        atualizarInformacoes();
        atualizarCardAtivo();
        atualizarBotoes();

        audio.load();

        return true;

    } catch (erro) {

        console.error(
            "Erro ao preparar música:",
            erro
        );

        return false;
    }
}

/* =========================================================
   CARREGAR E TOCAR UMA MÚSICA
   ========================================================= */

async function carregarMusica(index, tocar = false) {

    const preparada = prepararMusica(index);

    if (!preparada) {
        return false;
    }

    if (!tocar) {
        return true;
    }

    return await tocarMusicaAtual();
}

/* =========================================================
   AGUARDAR ÁUDIO CARREGAR
========================================================= */

function aguardarAudioCarregar(timeout = 12000) {

    return new Promise(resolve => {

        if (!audio) {
            resolve(false);
            return;
        }

        if (audio.readyState >= 3) {
            resolve(true);
            return;
        }

        let finalizado = false;

        const limpar = () => {

            audio.removeEventListener(
                "canplay",
                sucesso
            );

            audio.removeEventListener(
                "canplaythrough",
                sucesso
            );

            audio.removeEventListener(
                "loadeddata",
                sucesso
            );

            audio.removeEventListener(
                "error",
                erro
            );
        };

        const finalizar = resultado => {

            if (finalizado) {
                return;
            }

            finalizado = true;

            limpar();

            resolve(resultado);
        };

        const sucesso = () => {

            finalizar(true);
        };

        const erro = () => {

            finalizar(false);
        };

        audio.addEventListener(
            "canplay",
            sucesso
        );

        audio.addEventListener(
            "canplaythrough",
            sucesso
        );

        audio.addEventListener(
            "loadeddata",
            sucesso
        );

        audio.addEventListener(
            "error",
            erro
        );

        setTimeout(() => {

            if (audio.readyState >= 2) {

                finalizar(true);

            } else {

                finalizar(false);
            }

        }, timeout);
    });
}

/* =========================================================
   TOCAR MÚSICA ATUAL
========================================================= */

async function tocarMusicaAtual() {

    if (!audio || !playlist.length) {
        return false;
    }

    const musica = playlist[currentIndex];

    if (!musica) {
        return false;
    }

    console.log(
        "▶ Tocando:",
        musica.title
    );

    try {

        const carregou =
            await aguardarAudioCarregar(12000);

        if (!carregou) {

            console.error(
                "Não foi possível carregar o áudio."
            );

            return false;
        }

        audio.muted = false;

        const promessa = audio.play();

        if (promessa !== undefined) {
            await promessa;
        }

        primeiroCliqueAtivado = true;

        removerDetectorPrimeiroClique();

        atualizarBotoes(true);

        console.log(
            "Reprodução iniciada:",
            musica.title
        );

        return true;

    } catch (erro) {

        if (
            erro &&
            erro.name === "NotAllowedError"
        ) {

            console.warn(
                "Autoplay bloqueado pelo navegador. " +
                "Aguardando interação do usuário."
            );

            return false;
        }

        console.error(
            "Erro ao iniciar reprodução:",
            erro
        );

        return false;
    }
}

/* =========================================================
   INICIAR ÁUDIO
========================================================= */

async function iniciarAudio() {

    if (!audio || !playlist.length) {
        return false;
    }

    if (!audio.src) {

        if (!prepararMusica(currentIndex)) {
            return false;
        }
    }

    return await tocarMusicaAtual();
}

/* =========================================================
   AUTOPLAY
========================================================= */

async function tentarAutoplay() {

    if (
        autoplayTentado ||
        !playlist.length ||
        !audio
    ) {
        return;
    }

    autoplayTentado = true;

    console.log(
        "Tentando iniciar reprodução automaticamente..."
    );

    const tocou = await iniciarAudio();

    if (!tocou) {

        console.warn(
            "O navegador bloqueou o autoplay com som. " +
            "Clique em Ouvir agora ou Play."
        );
    }
}

/* =========================================================
   PRIMEIRA INTERAÇÃO
========================================================= */

async function ativarNoPrimeiroClique(event) {

    if (
        primeiroCliqueAtivado ||
        !playlistCarregada ||
        !audio
    ) {
        return;
    }

    /*
     * Não interfere nos próprios controles do player.
     * Isso evita o problema de clicar em PLAY e o
     * detector global imediatamente pausar a música.
     */

    const alvo = event && event.target;

    if (
        alvo &&
        alvo.closest &&
        alvo.closest(
            "#playBtn," +
            "#bottomPlayBtn," +
            "#heroPlayBtn," +
            "#prevBtn," +
            "#nextBtn," +
            "#bottomPrevBtn," +
            "#bottomNextBtn," +
            "#shuffleBtn," +
            "[data-play-index]," +
            "button," +
            "a," +
            "input," +
            "select," +
            "textarea"
        )
    ) {
        return;
    }

    if (!audio.paused) {
        primeiroCliqueAtivado = true;
        removerDetectorPrimeiroClique();
        return;
    }

    const tocou = await iniciarAudio();

    if (tocou) {

        primeiroCliqueAtivado = true;

        removerDetectorPrimeiroClique();
    }
}

/* =========================================================
   ADICIONAR DETECTOR DE PRIMEIRO CLIQUE
========================================================= */

function adicionarDetectorPrimeiroClique() {

    document.addEventListener(
        "click",
        ativarNoPrimeiroClique,
        false
    );

    document.addEventListener(
        "touchstart",
        ativarNoPrimeiroClique,
        {
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
        false
    );

    document.removeEventListener(
        "touchstart",
        ativarNoPrimeiroClique
    );
}

/* =========================================================
   ATUALIZAR BOTÕES
========================================================= */

function atualizarBotoes(tocando = null) {

    if (!audio) {
        return;
    }

    const estaTocando =
        tocando !== null
            ? tocando
            : !audio.paused;

    const simbolo =
        estaTocando
            ? "❚❚"
            : "▶";

    if (playIcon) {
        playIcon.textContent = simbolo;
    }

    if (bottomPlayIcon) {
        bottomPlayIcon.textContent = simbolo;
    }

    if (playBtn) {

        playBtn.setAttribute(
            "aria-label",
            estaTocando
                ? "Pausar"
                : "Reproduzir"
        );
    }

    if (bottomPlayBtn) {

        bottomPlayBtn.setAttribute(
            "aria-label",
            estaTocando
                ? "Pausar"
                : "Reproduzir"
        );
    }

    if (shuffleBtn) {

        shuffleBtn.classList.toggle(
            "active",
            shuffleEnabled
        );

        shuffleBtn.setAttribute(
            "aria-pressed",
            shuffleEnabled
                ? "true"
                : "false"
        );
    }
}

/* =========================================================
   PLAY / PAUSE
========================================================= */

async function alternarPlay() {

    if (!playlist.length || !audio) {
        return;
    }

    if (audio.paused) {

        const tocou =
            await iniciarAudio();

        /*
         * Se a fonte realmente estiver inválida,
         * tenta automaticamente a próxima.
         *
         * Se for apenas bloqueio de autoplay,
         * não pula a música.
         */

        if (
            !tocou &&
            audio.error &&
            audio.error.code
        ) {

            console.warn(
                "Fonte inválida. Tentando próxima música."
            );

            await proximaMusica();
        }

    } else {

        audio.pause();

        atualizarBotoes(false);
    }
}

/* =========================================================
   ESCOLHER PRÓXIMO ÍNDICE
========================================================= */

function obterProximoIndice(tentados = new Set()) {

    if (!playlist.length) {
        return 0;
    }

    if (playlist.length === 1) {
        return 0;
    }

    if (!shuffleEnabled) {

        let indice =
            normalizarIndice(
                currentIndex + 1
            );

        while (
            tentados.has(indice) &&
            tentados.size < playlist.length
        ) {

            indice =
                normalizarIndice(indice + 1);
        }

        return indice;
    }

    let indice;

    let seguranca = 0;

    do {

        indice =
            Math.floor(
                Math.random() *
                playlist.length
            );

        seguranca++;

        if (seguranca > 100) {
            break;
        }

    } while (
        tentados.has(indice)
    );

    return indice;
}

/* =========================================================
   PRÓXIMA MÚSICA
========================================================= */

async function proximaMusica() {

    if (
        !playlist.length ||
        !audio ||
        trocandoMusica
    ) {
        return false;
    }

    trocandoMusica = true;

    try {

        console.log(
            "Próxima música:",
            normalizarIndice(currentIndex + 1),
            playlist[
                normalizarIndice(currentIndex + 1)
            ]
                ? playlist[
                    normalizarIndice(currentIndex + 1)
                ].title
                : ""
        );

        /*
         * Apenas a faixa atual começa como tentada.
         * As demais serão testadas até encontrar uma
         * que realmente possa tocar.
         */

        const tentados = new Set();

        tentados.add(currentIndex);

        /*
         * Playlist com uma única música:
         * reinicia a mesma faixa.
         */

        if (playlist.length === 1) {

            prepararMusica(0);

            return await tocarMusicaAtual();
        }

        while (
            tentados.size <
            playlist.length
        ) {

            const novoIndex =
                obterProximoIndice(tentados);

            tentados.add(novoIndex);

            console.log(
                "Tentando faixa:",
                novoIndex,
                playlist[novoIndex].title
            );

            const preparada =
                prepararMusica(novoIndex);

            if (!preparada) {
                continue;
            }

            const tocou =
                await tocarMusicaAtual();

            if (tocou) {

                return true;
            }

            console.warn(
                "Faixa ignorada:",
                playlist[novoIndex].title
            );
        }

        console.error(
            "Nenhuma música disponível para reprodução."
        );

        atualizarBotoes(false);

        return false;

    } finally {

        trocandoMusica = false;
    }
}

/* =========================================================
   MÚSICA ANTERIOR
========================================================= */

async function musicaAnterior() {

    if (
        !playlist.length ||
        !audio ||
        trocandoMusica
    ) {
        return;
    }

    /*
     * Se já passou alguns segundos da música,
     * volta para o início da mesma.
     */

    if (audio.currentTime > 5) {

        audio.currentTime = 0;

        return;
    }

    trocandoMusica = true;

    try {

        const novoIndex =
            normalizarIndice(
                currentIndex - 1
            );

        console.log(
            "Música anterior:",
            novoIndex,
            playlist[novoIndex].title
        );

        prepararMusica(novoIndex);

        const tocou =
            await tocarMusicaAtual();

        if (!tocou) {

            console.warn(
                "Não foi possível tocar a música anterior."
            );
        }

    } finally {

        trocandoMusica = false;
    }
}

/* =========================================================
   EVENTOS DOS BOTÕES
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

if (bottomPlayBtn) {

    bottomPlayBtn.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            alternarPlay();
        }
    );
}

if (heroPlayBtn) {

    heroPlayBtn.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            alternarPlay();
        }
    );
}

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

            atualizarBotoes();

            console.log(
                "Modo aleatório:",
                shuffleEnabled
                    ? "ativado"
                    : "desativado"
            );
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

            let valor =
                Number(volume.value);

            if (!Number.isFinite(valor)) {
                valor = VOLUME_INICIAL;
            }

            valor =
                Math.max(
                    0,
                    Math.min(1, valor)
                );

            audio.volume = valor;
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
     * EVENTO PRINCIPAL:
     * quando uma música termina, passa automaticamente
     * para a próxima.
     */

    audio.addEventListener(
        "ended",
        () => {

            if (trocandoMusica) {
                return;
            }

            console.log(
                "Música terminou:",
                playlist[currentIndex]
                    ? playlist[currentIndex].title
                    : ""
            );

            setTimeout(() => {

                proximaMusica();

            }, 100);
        }
    );

    /*
     * Erro de áudio.
     */

    audio.addEventListener(
        "error",
        () => {

            const musica =
                playlist[currentIndex];

            console.error(
                "==============================="
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
                musica
                    ? musica.title
                    : "desconhecida"
            );

            console.error(
                "URL:",
                audio.currentSrc ||
                audio.src
            );

            if (audio.error) {

                console.error(
                    "Código:",
                    audio.error.code
                );

                console.error(
                    "Mensagem:",
                    audio.error.message ||
                    "sem mensagem"
                );
            }

            console.error(
                "ReadyState:",
                audio.readyState
            );

            console.error(
                "NetworkState:",
                audio.networkState
            );

            console.error(
                "==============================="
            );
        }
    );

    audio.addEventListener(
        "loadedmetadata",
        () => {

            atualizarBotoes();
        }
    );
}

/* =========================================================
   ENCONTRAR CONTAINER DA PLAYLIST
========================================================= */

function obterContainerPlaylist() {

    return (
        document.getElementById("playlist") ||
        document.querySelector(".playlist") ||
        document.querySelector(
            "[data-playlist]"
        )
    );
}

/* =========================================================
   RENDERIZAR PLAYLIST
========================================================= */

function renderizarPlaylist() {

    const container =
        obterContainerPlaylist();

    if (!container) {

        console.warn(
            "Container da playlist não encontrado."
        );

        return;
    }

    container.innerHTML = "";

    playlist.forEach(
        (musica, index) => {

            const card =
                document.createElement("button");

            card.type = "button";

            card.className =
                "louvor-card";

            card.dataset.playIndex =
                String(index);

            card.innerHTML = `
                <span class="louvor-card-title">
                    ${escaparHTML(musica.title)}
                </span>

                <span class="louvor-card-artist">
                    ${escaparHTML(musica.artist)}
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
                }
            );

            container.appendChild(card);
        }
    );

    atualizarCardAtivo();
}

/* =========================================================
   ATUALIZAR CARD ATIVO
========================================================= */

function atualizarCardAtivo() {

    const cards =
        document.querySelectorAll(
            "[data-play-index]"
        );

    cards.forEach(card => {

        const index =
            Number(
                card.dataset.playIndex
            );

        card.classList.toggle(
            "active",
            index === currentIndex
        );
    });
}

/* =========================================================
   ATUALIZAR INFORMAÇÕES
========================================================= */

function atualizarInformacoes() {

    const musica =
        playlist[currentIndex];

    if (!musica) {
        return;
    }

    const titulo =
        musica.title ||
        "Sem título";

    const artista =
        musica.artist ||
        "De Volta para Cristo";

    if (trackTitle) {
        trackTitle.textContent = titulo;
    }

    if (trackArtist) {
        trackArtist.textContent = artista;
    }

    if (bottomTrackTitle) {
        bottomTrackTitle.textContent =
            titulo;
    }

    if (bottomTrackArtist) {
        bottomTrackArtist.textContent =
            artista;
    }

    document.title =
        titulo +
        " — De Volta para Cristo";
}

/* =========================================================
   ATIVAR CARDS EXISTENTES NO HTML
========================================================= */

function ativarCardsExistentes() {

    const cards =
        document.querySelectorAll(
            "[data-play-index]"
        );

    cards.forEach(card => {

        /*
         * Evita adicionar o evento duas vezes.
         */

        if (
            card.dataset.playerReady === "true"
        ) {
            return;
        }

        card.dataset.playerReady = "true";

        card.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                const index =
                    Number(
                        card.dataset.playIndex
                    );

                if (
                    Number.isFinite(index) &&
                    playlist.length
                ) {

                    carregarMusica(
                        index,
                        true
                    );
                }
            }
        );
    });
}

/* =========================================================
   FORMULÁRIO DE PEDIDOS
========================================================= */

async function enviarPedido() {

    const nomeInput =
        document.getElementById("nomePedido") ||
        document.getElementById("pedidoNome") ||
        document.getElementById("nome");

    const musicaInput =
        document.getElementById("musicaPedido") ||
        document.getElementById("pedidoMusica") ||
        document.getElementById("musica");

    const mensagem =
        document.getElementById("mensagemPedido");

    const nome =
        nomeInput
            ? String(nomeInput.value).trim()
            : "";

    const musica =
        musicaInput
            ? String(musicaInput.value).trim()
            : "";

    if (!musica) {

        if (mensagem) {
            mensagem.textContent =
                "Digite o nome da música.";
        }

        return;
    }

    try {

        const url =
            SCRIPT_URL +
            "?action=pedido" +
            "&nome=" +
            encodeURIComponent(
                nome || "anônimo"
            ) +
            "&musica=" +
            encodeURIComponent(musica) +
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

        const dados =
            await resposta.json();

        if (!dados || dados.ok !== true) {

            throw new Error(
                dados && dados.error
                    ? dados.error
                    : "Não foi possível enviar o pedido."
            );
        }

        if (mensagem) {

            mensagem.textContent =
                dados.mensagem ||
                "Pedido recebido com sucesso.";
        }

        if (musicaInput) {
            musicaInput.value = "";
        }

    } catch (erro) {

        console.error(
            "Erro ao enviar pedido:",
            erro
        );

        if (mensagem) {

            mensagem.textContent =
                "Não foi possível enviar o pedido.";
        }
    }
}

/* =========================================================
   LOCALIZAR FORMULÁRIO DE PEDIDOS
========================================================= */

function configurarFormularioPedido() {

    const form =
        document.getElementById(
            "pedidoForm"
        ) ||
        document.querySelector(
            "form[data-pedido]"
        );

    if (!form) {
        return;
    }

    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            enviarPedido();
        }
    );
}

/* =========================================================
   TECLADO
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        /*
         * Espaço controla o player.
         * Não interfere quando o usuário está digitando.
         */

        const alvo =
            event.target;

        const tag =
            alvo &&
            alvo.tagName
                ? alvo.tagName.toLowerCase()
                : "";

        if (
            tag === "input" ||
            tag === "textarea" ||
            tag === "select" ||
            tag === "button"
        ) {
            return;
        }

        if (event.code === "Space") {

            event.preventDefault();

            alternarPlay();
        }

        if (
            event.code === "ArrowRight"
        ) {

            proximaMusica();
        }

        if (
            event.code === "ArrowLeft"
        ) {

            musicaAnterior();
        }
    }
);

/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "==============================="
        );

        console.log(
            "DE VOLTA PARA CRISTO"
        );

        console.log(
            "Inicializando player..."
        );

        console.log(
            "==============================="
        );

        configurarAudio();

        adicionarDetectorPrimeiroClique();

        ativarCardsExistentes();

        configurarFormularioPedido();

        carregarPlaylistDaPlanilha();
    }
);

/* =========================================================
   WINDOW LOAD
========================================================= */

window.addEventListener(
    "load",
    () => {

        if (
            audio &&
            volume
        ) {

            let valor =
                Number(volume.value);

            if (!Number.isFinite(valor)) {
                valor = VOLUME_INICIAL;
            }

            valor =
                Math.max(
                    0,
                    Math.min(1, valor)
                );

            audio.volume = valor;
        }
    }
);

/* =========================================================
   LOG INICIAL
========================================================= */

console.log(
    "De Volta para Cristo — Player carregado."
);

console.log(
    "Playlist será carregada pelo Google Apps Script."
);
