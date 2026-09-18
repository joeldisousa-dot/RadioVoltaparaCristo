/* =========================================================
   DE VOLTA PARA CRISTO
   PLAYER PRINCIPAL
   MÚSICAS + ORAÇÕES
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
   ESTADO
========================================================= */

let playlistCompleta = [];
let playlist = [];
let currentIndex = 0;

let categoriaAtual = "musica";

let shuffleEnabled = false;
let autoplayTentado = false;
let primeiroCliqueAtivado = false;
let playlistCarregada = false;
let carregandoPlaylist = false;
let trocandoMusica = false;

/* =========================================================
   ELEMENTOS
========================================================= */

let audio;
let playBtn;
let playIcon;
let prevBtn;
let nextBtn;
let volume;

let trackTitle;
let trackArtist;
let heroPlayBtn;

let bottomPlayBtn;
let bottomPlayIcon;
let bottomPrevBtn;
let bottomNextBtn;
let bottomTrackTitle;
let bottomTrackArtist;
let shuffleBtn;

let musicTab;
let prayerTab;
let musicCount;
let prayerCount;
let playlistCount;
let playlistLabel;

/* =========================================================
   LOCALIZAR ELEMENTOS
========================================================= */

function localizarElementos() {

    audio = document.getElementById("audio");

    playBtn = document.getElementById("playBtn");
    playIcon = document.getElementById("playIcon");
    prevBtn = document.getElementById("prevBtn");
    nextBtn = document.getElementById("nextBtn");
    volume = document.getElementById("volume");

    trackTitle = document.getElementById("trackTitle");
    trackArtist = document.getElementById("trackArtist");
    heroPlayBtn = document.getElementById("heroPlayBtn");

    bottomPlayBtn = document.getElementById("bottomPlayBtn");
    bottomPlayIcon = document.getElementById("bottomPlayIcon");
    bottomPrevBtn = document.getElementById("bottomPrevBtn");
    bottomNextBtn = document.getElementById("bottomNextBtn");

    bottomTrackTitle =
        document.getElementById("bottomTrackTitle");

    bottomTrackArtist =
        document.getElementById("bottomTrackArtist");

    shuffleBtn =
        document.getElementById("shuffleBtn");

    musicTab =
        document.getElementById("musicTab");

    prayerTab =
        document.getElementById("prayerTab");

    musicCount =
        document.getElementById("musicCount");

    prayerCount =
        document.getElementById("prayerCount");

    playlistCount =
        document.getElementById("playlistCount");

    playlistLabel =
        document.getElementById("playlistLabel");
}

/* =========================================================
   UTILITÁRIOS
========================================================= */

function scriptConfigurado() {

    return (
        SCRIPT_URL &&
        SCRIPT_URL.indexOf(
            "script.google.com/macros/s/"
        ) !== -1
    );
}

function esperar(ms) {

    return new Promise(function(resolve) {
        setTimeout(resolve, ms);
    });
}

function escaparHTML(valor) {

    return String(valor == null ? "" : valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* =========================================================
   NORMALIZA TIPO
========================================================= */

function normalizarTipo(valor) {

    var texto = String(valor || "")
        .trim()
        .toLowerCase();

    texto = texto.normalize
        ? texto.normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
        : texto;

    if (
        texto === "oracao" ||
        texto === "oracoes" ||
        texto === "prece" ||
        texto === "preces"
    ) {
        return "oracao";
    }

    /*
       Campo vazio = Música
    */

    return "musica";
}

function textoTipo(tipo) {

    return normalizarTipo(tipo) === "oracao"
        ? "Oração"
        : "Música";
}

/* =========================================================
   CONTAINER DA PLAYLIST
========================================================= */

function obterContainerPlaylist() {

    return (
        document.getElementById("playlist") ||
        document.querySelector(".playlist") ||
        document.querySelector("[data-playlist]")
    );
}

/* =========================================================
   MENSAGEM DE ERRO
========================================================= */

function mostrarErroPlaylist(mensagem) {

    console.error(
        "ERRO PLAYLIST:",
        mensagem
    );

    var container =
        obterContainerPlaylist();

    if (!container) {
        return;
    }

    container.innerHTML =

        '<div class="playlist-error">' +
            '<strong>' +
                'Não foi possível carregar a playlist.' +
            '</strong>' +
            '<br>' +
            '<span>' +
                escaparHTML(mensagem) +
            '</span>' +
        '</div>';
}

/* =========================================================
   ÁUDIO
========================================================= */

function configurarAudio() {

    if (!audio) {

        console.error(
            "Elemento #audio não encontrado."
        );

        return;
    }

    audio.autoplay = true;
    audio.preload = "auto";
    audio.controls = false;
    audio.muted = false;
    audio.volume = VOLUME_INICIAL;
    audio.playsInline = true;
}

/* =========================================================
   ÍNDICE
========================================================= */

function normalizarIndice(index) {

    if (!playlist.length) {
        return 0;
    }

    var novo =
        Number(index);

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

    index =
        normalizarIndice(index);

    var item =
        playlist[index];

    if (!item || !item.url) {

        console.error(
            "Áudio sem URL no índice:",
            index
        );

        return false;
    }

    currentIndex = index;

    try {

        audio.pause();

        audio.src = item.url;
        audio.preload = "auto";
        audio.autoplay = true;
        audio.muted = false;

        if (volume) {

            var valor =
                Number(volume.value);

            if (!Number.isFinite(valor)) {
                valor = VOLUME_INICIAL;
            }

            audio.volume =
                Math.max(
                    0,
                    Math.min(1, valor)
                );

        } else {

            audio.volume =
                VOLUME_INICIAL;
        }

        atualizarInformacoes();
        atualizarCardAtivo();
        atualizarBotoes();

        audio.load();

        return true;

    } catch (erro) {

        console.error(
            "Erro ao preparar áudio:",
            erro
        );

        return false;
    }
}

/* =========================================================
   CARREGAR MÚSICA
========================================================= */

async function carregarMusica(
    index,
    tocar
) {

    if (tocar === undefined) {
        tocar = false;
    }

    if (!prepararMusica(index)) {
        return false;
    }

    if (!tocar) {
        return true;
    }

    return await tocarMusicaAtual();
}

/* =========================================================
   AGUARDAR ÁUDIO
========================================================= */

function aguardarAudioCarregar(
    timeout
) {

    if (timeout === undefined) {
        timeout = 12000;
    }

    return new Promise(function(resolve) {

        if (!audio) {

            resolve(false);
            return;
        }

        if (audio.readyState >= 3) {

            resolve(true);
            return;
        }

        var finalizado = false;

        function limpar() {

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
        }

        function finalizar(resultado) {

            if (finalizado) {
                return;
            }

            finalizado = true;

            limpar();

            resolve(resultado);
        }

        function sucesso() {
            finalizar(true);
        }

        function erro() {
            finalizar(false);
        }

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

        setTimeout(function() {

            finalizar(
                audio.readyState >= 2
            );

        }, timeout);
    });
}

/* =========================================================
   TOCAR MÚSICA
========================================================= */

async function tocarMusicaAtual() {

    if (!audio || !playlist.length) {
        return false;
    }

    var item =
        playlist[currentIndex];

    if (!item) {
        return false;
    }

    try {

        var carregou =
            await aguardarAudioCarregar(
                12000
            );

        if (!carregou) {
            return false;
        }

        audio.muted = false;

        var promessa =
            audio.play();

        if (promessa !== undefined) {
            await promessa;
        }

        primeiroCliqueAtivado = true;

        removerDetectorPrimeiroClique();

        atualizarBotoes(true);

        return true;

    } catch (erro) {

        if (
            erro &&
            erro.name === "NotAllowedError"
        ) {

            console.warn(
                "Autoplay bloqueado pelo navegador."
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

    var tocou =
        await iniciarAudio();

    if (!tocou) {

        console.warn(
            "Autoplay bloqueado. Clique em Ouvir agora ou Play."
        );
    }
}

/* =========================================================
   CONTADORES
========================================================= */

function atualizarContadores() {

    var musicas =
        playlistCompleta.filter(
            function(item) {
                return (
                    normalizarTipo(
                        item.type
                    ) === "musica"
                );
            }
        ).length;

    var oracoes =
        playlistCompleta.filter(
            function(item) {
                return (
                    normalizarTipo(
                        item.type
                    ) === "oracao"
                );
            }
        ).length;

    if (musicCount) {
        musicCount.textContent =
            musicas;
    }

    if (prayerCount) {
        prayerCount.textContent =
            oracoes;
    }
}

/* =========================================================
   ABAS
========================================================= */

function atualizarAbas() {

    var musicaAtiva =
        categoriaAtual === "musica";

    if (musicTab) {

        musicTab.classList.toggle(
            "active",
            musicaAtiva
        );

        musicTab.setAttribute(
            "aria-selected",
            musicaAtiva
                ? "true"
                : "false"
        );
    }

    if (prayerTab) {

        prayerTab.classList.toggle(
            "active",
            !musicaAtiva
        );

        prayerTab.setAttribute(
            "aria-selected",
            !musicaAtiva
                ? "true"
                : "false"
        );
    }

    if (playlistLabel) {

        playlistLabel.textContent =
            musicaAtiva
                ? "🎵 Músicas disponíveis"
                : "🙏 Orações disponíveis";
    }
}

/* =========================================================
   APLICAR CATEGORIA
========================================================= */

function aplicarCategoria(
    tipo,
    tocarPrimeira
) {

    if (tocarPrimeira === undefined) {
        tocarPrimeira = false;
    }

    tipo =
        normalizarTipo(tipo);

    if (!playlistCompleta.length) {
        return;
    }

    categoriaAtual =
        tipo;

    var atual =
        playlist[currentIndex];

    var atualId =
        atual
            ? String(atual.id)
            : "";

    playlist =
        playlistCompleta.filter(
            function(item) {

                return (
                    normalizarTipo(
                        item.type
                    ) === categoriaAtual
                );
            }
        );

    atualizarAbas();

    atualizarQuantidadePlaylist();

    if (!playlist.length) {

        currentIndex = 0;

        renderizarPlaylist();

        atualizarBotoes(false);

        return;
    }

    var novoIndice =
        playlist.findIndex(
            function(item) {

                return (
                    String(item.id) ===
                    atualId
                );
            }
        );

    if (novoIndice < 0) {
        novoIndice = 0;
    }

    currentIndex =
        novoIndice;

    renderizarPlaylist();

    atualizarInformacoes();

    atualizarBotoes();

    if (tocarPrimeira) {

        carregarMusica(
            currentIndex,
            true
        );

    } else {

        prepararMusica(
            currentIndex
        );
    }
}

/* =========================================================
   SELECIONAR CATEGORIA
========================================================= */

function selecionarCategoria(tipo) {

    var novaCategoria =
        normalizarTipo(tipo);

    if (
        novaCategoria ===
        categoriaAtual
    ) {
        return;
    }

    var estavaTocando =
        audio &&
        !audio.paused;

    categoriaAtual =
        novaCategoria;

    playlist =
        playlistCompleta.filter(
            function(item) {

                return (
                    normalizarTipo(
                        item.type
                    ) ===
                    categoriaAtual
                );
            }
        );

    currentIndex = 0;

    atualizarAbas();

    atualizarQuantidadePlaylist();

    renderizarPlaylist();

    if (!playlist.length) {

        if (audio) {
            audio.pause();
        }

        atualizarBotoes(false);

        return;
    }

    prepararMusica(0);

    if (estavaTocando) {

        carregarMusica(
            0,
            true
        );
    }
}

/* =========================================================
   QUANTIDADE DA PLAYLIST
========================================================= */

function atualizarQuantidadePlaylist() {

    if (!playlistCount) {
        return;
    }

    playlistCount.textContent =
        playlist.length +
        (
            playlist.length === 1
                ? " item"
                : " itens"
        );
}

/* =========================================================
   CARREGAR PLAYLIST DA PLANILHA
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

    var ultimoErro = null;

    try {

        for (
            var tentativa = 1;
            tentativa <= TENTATIVAS_PLAYLIST;
            tentativa++
        ) {

            try {

                var url =
                    SCRIPT_URL +
                    "?action=playlist&t=" +
                    Date.now();

                var resposta =
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

                var dados =
                    await resposta.json();

                if (
                    !dados ||
                    dados.ok !== true
                ) {

                    throw new Error(
                        dados &&
                        dados.error
                            ? dados.error
                            : "Resposta inválida do servidor."
                    );
                }

                if (
                    !Array.isArray(
                        dados.tracks
                    )
                ) {

                    throw new Error(
                        "A resposta não contém a playlist."
                    );
                }

                playlistCompleta =
                    dados.tracks

                        .filter(
                            function(item) {

                                return (
                                    item &&
                                    item.url
                                );
                            }
                        )

                        .slice(
                            0,
                            MAX_TRACKS
                        )

                        .map(
                            function(item, index) {

                                var tipo =
                                    item.type ||
                                    item.tipo ||
                                    item.category ||
                                    item.categoria ||
                                    "";

                                tipo =
                                    normalizarTipo(
                                        tipo
                                    );

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
                                        String(
                                            item.url
                                        ).trim(),

                                    sourceUrl:
                                        item.sourceUrl ||
                                        item.url,

                                    type:
                                        tipo
                                };
                            }
                        );

                playlistCarregada =
                    true;

                currentIndex = 0;

                categoriaAtual =
                    "musica";

                atualizarContadores();

                if (!playlistCompleta.length) {

                    mostrarErroPlaylist(
                        "A playlist está vazia."
                    );

                    return;
                }

                playlist =
                    playlistCompleta.filter(
                        function(item) {

                            return (
                                normalizarTipo(
                                    item.type
                                ) === "musica"
                            );
                        }
                    );

                /*
                   Se não houver músicas,
                   abre as orações.
                */

                if (!playlist.length) {

                    categoriaAtual =
                        "oracao";

                    playlist =
                        playlistCompleta.filter(
                            function(item) {

                                return (
                                    normalizarTipo(
                                        item.type
                                    ) === "oracao"
                                );
                            }
                        );
                }

                atualizarAbas();

                atualizarContadores();

                atualizarQuantidadePlaylist();

                renderizarPlaylist();

                if (playlist.length) {
                    prepararMusica(0);
                }

                setTimeout(
                    function() {
                        tentarAutoplay();
                    },
                    300
                );

                return;

            } catch (erro) {

                ultimoErro =
                    erro;

                console.warn(
                    "Tentativa " +
                    tentativa +
                    " falhou:",
                    erro
                );

                if (
                    tentativa <
                    TENTATIVAS_PLAYLIST
                ) {

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

        carregandoPlaylist =
            false;
    }
}

/* =========================================================
   RENDERIZAR PLAYLIST
========================================================= */

function renderizarPlaylist() {

    var container =
        obterContainerPlaylist();

    if (!container) {

        console.warn(
            "Container #playlist não encontrado."
        );

        return;
    }

    container.innerHTML = "";

    if (!playlist.length) {

        var vazio =
            document.createElement(
                "div"
            );

        vazio.className =
            "playlist-error";

        vazio.innerHTML =
            categoriaAtual === "oracao"

                ?

                "<strong>Nenhuma oração cadastrada.</strong>" +
                "<br>" +
                "<span>Cadastre uma oração na planilha Playlist.</span>"

                :

                "<strong>Nenhuma música cadastrada.</strong>" +
                "<br>" +
                "<span>Cadastre uma música na planilha Playlist.</span>";

        container.appendChild(
            vazio
        );

        return;
    }

    playlist.forEach(
        function(item, index) {

            /*
               Usamos as classes music-card
               do layout original.
            */

            var card =
                document.createElement(
                    "button"
                );

            card.type =
                "button";

            card.className =
                "music-card";

            card.dataset.playIndex =
                String(index);

            var icone =
                categoriaAtual === "oracao"
                    ? "🙏"
                    : "🎵";

            card.innerHTML =

                '<span class="music-number">' +
                    String(index + 1)
                        .padStart(2, "0") +
                '</span>' +

                '<span class="music-icon">' +
                    icone +
                '</span>' +

                '<span class="music-info">' +

                    '<h3>' +
                        escaparHTML(
                            item.title
                        ) +
                    '</h3>' +

                    '<p>' +
                        escaparHTML(
                            item.artist
                        ) +
                    '</p>' +

                '</span>' +

                '<span class="music-play">' +
                    '▶' +
                '</span>';

            card.addEventListener(
                "click",
                function(event) {

                    event.stopPropagation();

                    carregarMusica(
                        index,
                        true
                    );
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

    document
        .querySelectorAll(
            "[data-play-index]"
        )
        .forEach(
            function(card) {

                var index =
                    Number(
                        card.dataset.playIndex
                    );

                card.classList.toggle(
                    "active",
                    index ===
                    currentIndex
                );
            }
        );
}

/* =========================================================
   CARDS EXISTENTES NO HTML
========================================================= */

function ativarCardsExistentes() {

    document
        .querySelectorAll(
            "[data-play-index]"
        )
        .forEach(
            function(card) {

                if (
                    card.dataset.playerReady ===
                    "true"
                ) {
                    return;
                }

                card.dataset.playerReady =
                    "true";

                card.addEventListener(
                    "click",
                    function(event) {

                        event.stopPropagation();

                        var index =
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
            }
        );
}

/* =========================================================
   INFORMAÇÕES DO PLAYER
========================================================= */

function atualizarInformacoes() {

    var item =
        playlist[currentIndex];

    if (!item) {
        return;
    }

    var titulo =
        item.title ||
        "Sem título";

    var artista =
        item.artist ||
        "De Volta para Cristo";

    if (trackTitle) {
        trackTitle.textContent =
            titulo;
    }

    if (trackArtist) {
        trackArtist.textContent =
            artista;
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
   ATUALIZAR BOTÕES
========================================================= */

function atualizarBotoes(
    tocando
) {

    if (!audio) {
        return;
    }

    var estaTocando;

    if (tocando !== undefined &&
        tocando !== null) {

        estaTocando =
            tocando;

    } else {

        estaTocando =
            !audio.paused;
    }

    var simbolo =
        estaTocando
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

        var tocou =
            await iniciarAudio();

        if (
            !tocou &&
            audio.error &&
            audio.error.code
        ) {

            await proximaMusica();
        }

    } else {

        audio.pause();

        atualizarBotoes(
            false
        );
    }
}

/* =========================================================
   PRÓXIMO ÍNDICE
========================================================= */

function obterProximoIndice(
    tentados
) {

    if (!tentados) {
        tentados =
            new Set();
    }

    if (!playlist.length) {
        return 0;
    }

    if (playlist.length === 1) {
        return 0;
    }

    if (!shuffleEnabled) {

        var indice =
            normalizarIndice(
                currentIndex + 1
            );

        while (
            tentados.has(indice) &&
            tentados.size <
            playlist.length
        ) {

            indice =
                normalizarIndice(
                    indice + 1
                );
        }

        return indice;
    }

    var aleatorio;
    var seguranca = 0;

    do {

        aleatorio =
            Math.floor(
                Math.random() *
                playlist.length
            );

        seguranca++;

        if (seguranca > 100) {
            break;
        }

    } while (
        tentados.has(
            aleatorio
        )
    );

    return aleatorio;
}

/* =========================================================
   PRÓXIMA MÚSICA / ORAÇÃO
========================================================= */

async function proximaMusica() {

    if (
        !playlist.length ||
        !audio ||
        trocandoMusica
    ) {
        return false;
    }

    trocandoMusica =
        true;

    try {

        var tentados =
            new Set();

        tentados.add(
            currentIndex
        );

        if (playlist.length === 1) {

            prepararMusica(0);

            return await tocarMusicaAtual();
        }

        while (
            tentados.size <
            playlist.length
        ) {

            var novoIndex =
                obterProximoIndice(
                    tentados
                );

            tentados.add(
                novoIndex
            );

            if (
                !prepararMusica(
                    novoIndex
                )
            ) {
                continue;
            }

            var tocou =
                await tocarMusicaAtual();

            if (tocou) {
                return true;
            }
        }

        atualizarBotoes(false);

        return false;

    } finally {

        trocandoMusica =
            false;
    }
}

/* =========================================================
   MÚSICA / ORAÇÃO ANTERIOR
========================================================= */

async function musicaAnterior() {

    if (
        !playlist.length ||
        !audio ||
        trocandoMusica
    ) {
        return;
    }

    if (
        audio.currentTime > 5
    ) {

        audio.currentTime =
            0;

        return;
    }

    trocandoMusica =
        true;

    try {

        var novoIndex =
            normalizarIndice(
                currentIndex - 1
            );

        prepararMusica(
            novoIndex
        );

        await tocarMusicaAtual();

    } finally {

        trocandoMusica =
            false;
    }
}

/* =========================================================
   EVENTOS DOS BOTÕES
========================================================= */

function configurarEventos() {

    if (playBtn) {

        playBtn.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                alternarPlay();
            }
        );
    }

    if (bottomPlayBtn) {

        bottomPlayBtn.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                alternarPlay();
            }
        );
    }

    if (heroPlayBtn) {

        heroPlayBtn.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                alternarPlay();
            }
        );
    }

    if (prevBtn) {

        prevBtn.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                musicaAnterior();
            }
        );
    }

    if (bottomPrevBtn) {

        bottomPrevBtn.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                musicaAnterior();
            }
        );
    }

    if (nextBtn) {

        nextBtn.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                proximaMusica();
            }
        );
    }

    if (bottomNextBtn) {

        bottomNextBtn.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                proximaMusica();
            }
        );
    }

    if (shuffleBtn) {

        shuffleBtn.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                shuffleEnabled =
                    !shuffleEnabled;

                atualizarBotoes();
            }
        );
    }

    if (musicTab) {

        musicTab.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                selecionarCategoria(
                    "musica"
                );
            }
        );
    }

    if (prayerTab) {

        prayerTab.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                selecionarCategoria(
                    "oracao"
                );
            }
        );
    }

    if (volume) {

        volume.addEventListener(
            "input",
            function() {

                var valor =
                    Number(
                        volume.value
                    );

                if (
                    !Number.isFinite(
                        valor
                    )
                ) {

                    valor =
                        VOLUME_INICIAL;
                }

                valor =
                    Math.max(
                        0,
                        Math.min(
                            1,
                            valor
                        )
                    );

                if (audio) {
                    audio.volume =
                        valor;
                }
            }
        );
    }
}

/* =========================================================
   EVENTOS DO ÁUDIO
========================================================= */

function configurarEventosAudio() {

    if (!audio) {
        return;
    }

    audio.addEventListener(
        "play",
        function() {

            atualizarBotoes(
                true
            );
        }
    );

    audio.addEventListener(
        "pause",
        function() {

            atualizarBotoes(
                false
            );
        }
    );

    audio.addEventListener(
        "ended",
        function() {

            if (trocandoMusica) {
                return;
            }

            setTimeout(
                function() {
                    proximaMusica();
                },
                100
            );
        }
    );

    audio.addEventListener(
        "error",
        function() {

            var item =
                playlist[currentIndex];

            console.error(
                "Erro ao carregar áudio:",
                {
                    indice:
                        currentIndex,

                    titulo:
                        item
                            ? item.title
                            : "desconhecido",

                    url:
                        audio.currentSrc ||
                        audio.src,

                    erro:
                        audio.error
                            ? audio.error.code
                            : null
                }
            );
        }
    );

    audio.addEventListener(
        "loadedmetadata",
        function() {

            atualizarBotoes();
        }
    );
}

/* =========================================================
   PRIMEIRA INTERAÇÃO
========================================================= */

async function ativarNoPrimeiroClique(
    event
) {

    if (
        primeiroCliqueAtivado ||
        !playlistCarregada ||
        !audio
    ) {
        return;
    }

    var alvo =
        event &&
        event.target;

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
            "#musicTab," +
            "#prayerTab," +
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

        primeiroCliqueAtivado =
            true;

        removerDetectorPrimeiroClique();

        return;
    }

    var tocou =
        await iniciarAudio();

    if (tocou) {

        primeiroCliqueAtivado =
            true;

        removerDetectorPrimeiroClique();
    }
}

/* =========================================================
   ADICIONAR DETECTOR
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
   FORMULÁRIO DE PEDIDOS
========================================================= */

async function enviarPedido() {

    var nomeInput =
        document.getElementById(
            "nomePedido"
        ) ||
        document.getElementById(
            "pedidoNome"
        ) ||
        document.getElementById(
            "nome"
        ) ||
        document.getElementById(
            "reqName"
        );

    var musicaInput =
        document.getElementById(
            "musicaPedido"
        ) ||
        document.getElementById(
            "pedidoMusica"
        ) ||
        document.getElementById(
            "musica"
        ) ||
        document.getElementById(
            "reqMusic"
        );

    var mensagem =
        document.getElementById(
            "mensagemPedido"
        ) ||
        document.getElementById(
            "requestStatus"
        );

    var textoMensagem =
        document.getElementById(
            "reqMessage"
        );

    var nome =
        nomeInput
            ? String(
                nomeInput.value
            ).trim()
            : "";

    var musica =
        musicaInput
            ? String(
                musicaInput.value
            ).trim()
            : "";

    var pedido =
        musica || "";

    var mensagemPedido =
        textoMensagem
            ? String(
                textoMensagem.value
            ).trim()
            : "";

    if (
        !pedido &&
        !mensagemPedido
    ) {

        if (mensagem) {

            mensagem.textContent =
                "Digite o nome da música ou escreva seu pedido.";
        }

        return;
    }

    try {

        var resposta =
            await fetch(
                SCRIPT_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body:
                        JSON.stringify(
                            {
                                action:
                                    "pedido",

                                nome:
                                    nome ||
                                    "anônimo",

                                pedido:
                                    pedido,

                                mensagem:
                                    mensagemPedido
                            }
                        )
                }
            );

        var dados =
            await resposta.json();

        if (
            !dados ||
            dados.ok !== true
        ) {

            throw new Error(
                dados &&
                dados.error
                    ? dados.error
                    : "Não foi possível enviar o pedido."
            );
        }

        if (mensagem) {

            mensagem.textContent =
                dados.mensagem ||
                "Pedido enviado com sucesso.";
        }

        if (musicaInput) {
            musicaInput.value =
                "";
        }

        if (textoMensagem) {
            textoMensagem.value =
                "";
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
   FORMULÁRIO
========================================================= */

function configurarFormularioPedido() {

    var form =
        document.getElementById(
            "pedidoForm"
        ) ||
        document.getElementById(
            "requestForm"
        ) ||
        document.querySelector(
            "form[data-pedido]"
        );

    if (!form) {
        return;
    }

    form.addEventListener(
        "submit",
        function(event) {

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
    function(event) {

        var alvo =
            event.target;

        var tag =
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

        if (
            event.code ===
            "Space"
        ) {

            event.preventDefault();

            alternarPlay();
        }

        if (
            event.code ===
            "ArrowRight"
        ) {

            proximaMusica();
        }

        if (
            event.code ===
            "ArrowLeft"
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
    function() {

        localizarElementos();

        configurarAudio();

        configurarEventos();

        configurarEventosAudio();

        adicionarDetectorPrimeiroClique();

        ativarCardsExistentes();

        configurarFormularioPedido();

        carregarPlaylistDaPlanilha();
    }
);

/* =========================================================
   LOAD
========================================================= */

window.addEventListener(
    "load",
    function() {

        if (audio && volume) {

            var valor =
                Number(
                    volume.value
                );

            if (
                !Number.isFinite(
                    valor
                )
            ) {

                valor =
                    VOLUME_INICIAL;
            }

            audio.volume =
                Math.max(
                    0,
                    Math.min(
                        1,
                        valor
                    )
                );
        }
    }
);

/* =========================================================
   FINAL
========================================================= */

console.log(
    "De Volta para Cristo — Player carregado."
);
