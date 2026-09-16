/* =========================================================
   DE VOLTA PARA CRISTO
   PLAYER DE LOUVORES E MENSAGENS

   PLAYLIST CARREGADA DO GOOGLE APPS SCRIPT

   SUPORTE:

   * Até 500 músicas
   * Play / Pause
   * Próxima
   * Anterior
   * Aleatório
   * Volume
   * Autoplay
   * Primeiro clique para desbloquear áudio
   * Cards dinâmicos
   * Pedidos enviados para Google Sheets
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
   VARIÁVEIS
========================================================= */

let currentIndex = 0;

let shuffleEnabled = false;

let autoplayTentado = false;

let primeiroCliqueAtivado = false;

let playlistCarregada = false;

let carregandoPlaylist = false;

let tentandoReproduzir = false;

let aguardandoReproducao = false;


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
   UTILITÁRIOS
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
   CARREGAR PLAYLIST DO APPS SCRIPT
========================================================= */

async function carregarPlaylistDaPlanilha() {

    if (!scriptConfigurado()) {

        console.error(
            "SCRIPT_URL não configurada."
        );

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
                                musica.url

                        })
                    );


            playlistCarregada = true;

            carregandoPlaylist = false;


            console.log(
                "Playlist carregada:",
                playlist.length,
                "músicas."
            );


            if (
                playlist.length > 0
            ) {

                currentIndex = 0;


                /*
                 * IMPORTANTE:
                 *
                 * Primeiro carregamos a música.
                 * Depois tentamos reproduzir.
                 *
                 * Isso evita tentar autoplay
                 * antes de o src existir.
                 */

                carregarMusica(
                    0,
                    false
                );


                renderizarPlaylist();


                /*
                 * Pequeno atraso para garantir
                 * que o navegador recebeu o src.
                 */

                setTimeout(
                    () => {

                        tentarAutoplay();

                    },
                    100
                );


            } else {

                mostrarErroPlaylist(
                    "Nenhuma música cadastrada na planilha."
                );

            }


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


    carregandoPlaylist = false;


    mostrarErroPlaylist(
        "Não foi possível carregar a playlist."
    );


    return false;

}


/* =========================================================
   ESPERAR
========================================================= */

function esperar(
    milissegundos
) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                milissegundos
            )
    );

}


/* =========================================================
   MENSAGEM DE ERRO DA PLAYLIST
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
   CARREGAR MÚSICA
========================================================= */

function carregarMusica(
    index,
    tocar = false
) {

    if (
        !audio ||
        !playlist.length
    ) {

        return;

    }


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

        return;

    }


    /*
     * Para a música atual.
     */

    audio.pause();


    /*
     * Limpa o src anterior.
     */

    audio.removeAttribute(
        "src"
    );


    /*
     * Define a nova música.
     */

    audio.src =
        musica.url;


    /*
     * Garante as configurações
     * do áudio.
     */

    audio.autoplay = true;

    audio.muted = false;

    audio.volume =
        volume
            ? Number(volume.value)
            : VOLUME_INICIAL;


    audio.load();


    atualizarInformacoes();

    atualizarCardAtivo();


    /*
     * Se foi solicitado tocar,
     * inicia imediatamente.
     */

    if (tocar) {

        iniciarAudio();

    }

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
   INICIAR ÁUDIO
========================================================= */

async function iniciarAudio() {

    if (
        !audio ||
        !playlist.length
    ) {

        return false;

    }


    if (
        tentandoReproduzir
    ) {

        return false;

    }


    tentandoReproduzir =
        true;


    try {

        /*
         * Garante que existe uma música
         * carregada.
         */

        if (
            !audio.src
        ) {

            const musica =
                playlist[
                    currentIndex
                ];


            if (
                !musica ||
                !musica.url
            ) {

                tentandoReproduzir =
                    false;

                return false;

            }


            audio.src =
                musica.url;

            audio.load();

        }


        /*
         * Garante volume.
         */

        audio.muted = false;


        if (
            volume &&
            !Number.isNaN(
                Number(
                    volume.value
                )
            )
        ) {

            audio.volume =
                Number(
                    volume.value
                );

        } else {

            audio.volume =
                VOLUME_INICIAL;

        }


        /*
         * Tenta iniciar a reprodução.
         */

        const promessa =
            audio.play();


        if (
            promessa !== undefined
        ) {

            await promessa;

        }


        /*
         * Se chegou aqui,
         * o navegador permitiu.
         */

        atualizarBotoes(
            true
        );


        primeiroCliqueAtivado =
            true;


        removerDetectorPrimeiroClique();


        console.log(
            "Reprodução iniciada."
        );


        tentandoReproduzir =
            false;


        return true;


    } catch (erro) {

        console.log(
            "Autoplay bloqueado pelo navegador. "
            + "Aguardando interação do usuário."
        );


        atualizarBotoes(
            false
        );


        tentandoReproduzir =
            false;


        return false;

    }

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
        !playlist.length
    ) {

        return;

    }


    /*
     * Primeira tentativa automática.
     */

    iniciarAudio();


}


/* =========================================================
   PRIMEIRO CLIQUE / TOQUE
========================================================= */

function ativarNoPrimeiroClique() {

    if (
        primeiroCliqueAtivado
    ) {

        return;

    }


    if (
        !playlist.length
    ) {

        return;

    }


    /*
     * A interação do usuário
     * normalmente desbloqueia o áudio.
     */

    iniciarAudio();

}


/* =========================================================
   ATIVAR DETECTOR
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

function proximaMusica() {

    if (
        !playlist.length
    ) {

        return;

    }


    if (
        shuffleEnabled &&
        playlist.length > 1
    ) {

        let novoIndex;


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


        currentIndex =
            novoIndex;

    } else {

        currentIndex++;


        if (
            currentIndex >=
            playlist.length
        ) {

            currentIndex = 0;

        }

    }


    carregarMusica(
        currentIndex,
        true
    );

}


/* =========================================================
   MÚSICA ANTERIOR
========================================================= */

function musicaAnterior() {

    if (
        !playlist.length
    ) {

        return;

    }


    /*
     * Se já passou de 5 segundos,
     * volta para o início da música.
     */

    if (
        audio.currentTime > 5
    ) {

        audio.currentTime =
            0;

        return;

    }


    currentIndex--;


    if (
        currentIndex < 0
    ) {

        currentIndex =
            playlist.length - 1;

    }


    carregarMusica(
        currentIndex,
        true
    );

}


/* =========================================================
   BOTÕES
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

            if (audio) {

                audio.volume =
                    Number(
                        volume.value
                    );

                /*
                 * Se o usuário mexer no volume,
                 * aproveitamos a interação para
                 * tentar desbloquear o áudio.
                 */

                if (
                    audio.paused &&
                    playlist.length
                ) {

                    iniciarAudio();

                }

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

            atualizarBotoes(
                true
            );

        }
    );


    audio.addEventListener(
        "pause",
        () => {

            atualizarBotoes(
                false
            );

        }
    );


    audio.addEventListener(
        "ended",
        () => {

            proximaMusica();

        }
    );


    audio.addEventListener(
        "error",
        () => {

            console.error(
                "Não foi possível carregar o áudio:",
                audio.src
            );


            atualizarBotoes(
                false
            );

        }
    );


    audio.addEventListener(
        "canplay",
        () => {

            /*
             * Se o áudio já está carregado,
             * mas ainda não iniciou, fazemos
             * uma nova tentativa.
             */

            if (
                playlistCarregada &&
                audio.paused &&
                !primeiroCliqueAtivado
            ) {

                iniciarAudio();

            }

        }
    );

}


/* =========================================================
   CARDS DE LOUVORES
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

        console.log(
            "Inicializando player..."
        );


        /*
         * Configura o áudio primeiro.
         */

        configurarAudio();


        /*
         * Instala imediatamente o detector
         * de interação.
         */

        adicionarDetectorPrimeiroClique();


        /*
         * Ativa cards existentes.
         */

        ativarCardsExistentes();


        /*
         * Carrega a playlist.
         */

        const carregou =
            await carregarPlaylistDaPlanilha();


        /*
         * A função carregarPlaylistDaPlanilha()
         * já faz a primeira tentativa de autoplay
         * depois de definir o src.
         */

        if (carregou) {

            console.log(
                "Player pronto."
            );

        }

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
