<!DOCTYPE html>

<html lang="pt-BR">

<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Onda Livre FM</title>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">

<style>

/* =========================================================
   BASE
========================================================= */

:root {
    --blue: #1264e8;
    --blue-light: #3b82f6;
    --dark: #07111f;
    --dark-2: #0c1828;
    --text: #111827;
    --muted: #697586;
    --light: #f5f7fa;
    --white: #ffffff;
    --border: #e7ebf0;
    --green: #19b56b;
}

* {
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
}

body {
    margin: 0;
    background: var(--light);
    color: var(--text);
    font-family: "DM Sans", sans-serif;
    -webkit-font-smoothing: antialiased;
}

button,
input {
    font: inherit;
}

button {
    cursor: pointer;
}

a {
    text-decoration: none;
    color: inherit;
}


/* =========================================================
   HEADER
========================================================= */

header {
    position: sticky;
    top: 0;
    z-index: 100;

    height: 70px;

    background: rgba(255,255,255,.92);

    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);

    border-bottom: 1px solid rgba(0,0,0,.06);
}

.header-inner {
    width: min(1180px, calc(100% - 44px));
    height: 100%;

    margin: auto;

    display: flex;
    align-items: center;
    justify-content: space-between;
}


/* =========================================================
   LOGO
========================================================= */

.logo {
    display: flex;
    align-items: center;
    gap: 11px;

    font-family: "Space Grotesk", sans-serif;

    font-size: 20px;
    font-weight: 700;

    letter-spacing: -.7px;
}

.logo-icon {
    width: 34px;
    height: 34px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 10px;

    background: var(--blue);
    color: white;

    font-size: 11px;
    font-weight: 700;

    box-shadow: 0 6px 18px rgba(18,100,232,.25);
}

.logo span {
    color: var(--blue);
}


/* =========================================================
   MENU
========================================================= */

nav {
    display: flex;
    align-items: center;
    gap: 34px;

    font-size: 13px;
    font-weight: 600;

    color: #687386;
}

nav a {
    transition: color .2s ease;
}

nav a:hover {
    color: var(--blue);
}


/* =========================================================
   HERO
========================================================= */

.hero {
    position: relative;
    overflow: hidden;

    background:
        radial-gradient(
            circle at 82% 18%,
            rgba(31,110,235,.22),
            transparent 30%
        ),
        radial-gradient(
            circle at 65% 80%,
            rgba(28,83,156,.14),
            transparent 34%
        ),
        linear-gradient(
            135deg,
            #07111f 0%,
            #091523 52%,
            #0d1e34 100%
        );

    color: white;
}

.hero::before {
    content: "";

    position: absolute;

    width: 420px;
    height: 420px;

    right: -180px;
    top: -190px;

    border: 1px solid rgba(255,255,255,.06);

    border-radius: 50%;
}

.hero::after {
    content: "";

    position: absolute;

    width: 620px;
    height: 620px;

    right: -280px;
    top: -290px;

    border: 1px solid rgba(255,255,255,.035);

    border-radius: 50%;
}

.hero-inner {
    position: relative;
    z-index: 2;

    width: min(1180px, calc(100% - 44px));

    min-height: 500px;

    margin: auto;

    display: grid;

    grid-template-columns: 1.15fr .85fr;

    align-items: center;

    gap: 80px;

    padding: 70px 0;
}


/* =========================================================
   HERO TEXTO
========================================================= */

.hero-copy {
    max-width: 680px;
}

.live-status {
    display: inline-flex;
    align-items: center;
    gap: 9px;

    margin-bottom: 23px;

    color: #9eacc0;

    font-size: 11px;
    font-weight: 600;

    text-transform: uppercase;
    letter-spacing: 1.8px;
}

.live-dot {
    width: 7px;
    height: 7px;

    border-radius: 50%;

    background: var(--green);

    box-shadow:
        0 0 0 4px rgba(25,181,107,.13),
        0 0 15px rgba(25,181,107,.3);
}

.hero h1 {
    margin: 0;

    font-family: "Space Grotesk", sans-serif;

    font-size: clamp(48px, 6vw, 76px);

    line-height: .98;

    letter-spacing: -4px;
}

.hero h1 span {
    color: #4d8ff3;
}

.hero-description {
    max-width: 520px;

    margin: 25px 0 32px;

    color: #a8b4c5;

    font-size: 16px;

    line-height: 1.7;
}

.hero-button {
    display: inline-flex;

    align-items: center;
    justify-content: center;

    height: 46px;

    padding: 0 22px;

    border-radius: 9px;

    background: var(--blue);

    color: white;

    font-size: 13px;
    font-weight: 700;

    box-shadow: 0 10px 28px rgba(18,100,232,.25);

    transition: .2s ease;
}

.hero-button:hover {
    background: var(--blue-light);
    transform: translateY(-1px);
}


/* =========================================================
   PLAYER
========================================================= */

.hero-player {
    width: 100%;
    max-width: 400px;

    justify-self: end;
}

.player-card {
    position: relative;

    padding: 26px;

    border-radius: 20px;

    background:
        linear-gradient(
            145deg,
            rgba(255,255,255,.09),
            rgba(255,255,255,.035)
        );

    border: 1px solid rgba(255,255,255,.11);

    box-shadow:
        0 30px 70px rgba(0,0,0,.28),
        inset 0 1px 0 rgba(255,255,255,.05);

    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
}


/* =========================================================
   PLAYER TOPO
========================================================= */

.player-top {
    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-bottom: 27px;
}

.player-live {
    display: flex;
    align-items: center;

    gap: 8px;

    color: #9eacc0;

    font-family: monospace;

    font-size: 10px;

    letter-spacing: 1.3px;

    text-transform: uppercase;
}

.player-live span {
    width: 6px;
    height: 6px;

    border-radius: 50%;

    background: var(--green);

    box-shadow: 0 0 10px rgba(25,181,107,.6);
}

.player-frequency {
    color: #68788e;

    font-family: monospace;

    font-size: 10px;

    letter-spacing: 1px;
}


/* =========================================================
   ARTE DA RÁDIO
========================================================= */

.player-main {
    display: flex;
    align-items: center;

    gap: 17px;
}

.station-art {
    position: relative;

    flex: 0 0 62px;

    width: 62px;
    height: 62px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 15px;

    background:
        linear-gradient(
            145deg,
            #1d75ed,
            #0e4fb9
        );

    box-shadow:
        0 10px 25px rgba(0,0,0,.22);
}

.station-art::before,
.station-art::after {
    content: "";

    position: absolute;

    border: 1px solid rgba(255,255,255,.2);

    border-radius: 50%;
}

.station-art::before {
    width: 30px;
    height: 30px;
}

.station-art::after {
    width: 16px;
    height: 16px;

    background: rgba(255,255,255,.12);
}

.station-art strong {
    position: relative;
    z-index: 2;

    color: white;

    font-family: "Space Grotesk", sans-serif;

    font-size: 10px;
}


/* =========================================================
   MÚSICA
========================================================= */

.track-data {
    min-width: 0;
    flex: 1;
}

.track-now {
    margin-bottom: 5px;

    color: #71839a;

    font-size: 10px;
    font-weight: 600;

    text-transform: uppercase;

    letter-spacing: 1.2px;
}

#trackTitle {
    overflow: hidden;

    margin: 0;

    color: white;

    font-family: "Space Grotesk", sans-serif;

    font-size: 16px;
    font-weight: 600;

    text-overflow: ellipsis;
    white-space: nowrap;
}

#trackArtist {
    overflow: hidden;

    margin-top: 4px;

    color: #8998aa;

    font-size: 12px;

    text-overflow: ellipsis;
    white-space: nowrap;
}


/* =========================================================
   LINHA
========================================================= */

.player-line {
    height: 1px;

    margin: 24px 0;

    background: rgba(255,255,255,.08);
}


/* =========================================================
   CONTROLES
========================================================= */

.player-bottom {
    display: flex;

    align-items: center;

    justify-content: space-between;
}

.player-controls {
    display: flex;

    align-items: center;

    gap: 5px;
}

.player-controls button {
    width: 30px;
    height: 30px;

    display: flex;

    align-items: center;
    justify-content: center;

    padding: 0;

    border: 0;

    border-radius: 8px;

    background: transparent;

    color: #8190a3;

    transition: .2s ease;
}

.player-controls button:hover {
    background: rgba(255,255,255,.07);
    color: white;
}


/* =========================================================
   BOTÃO PLAY
========================================================= */

#playBtn {
    width: 42px;
    height: 42px;

    margin: 0 5px;

    border: 0;

    border-radius: 50%;

    background: white;

    color: #0b1b2e;

    box-shadow: 0 7px 22px rgba(0,0,0,.25);

    transition: .2s ease;
}

#playBtn:hover {
    background: #f2f5f9;

    transform: scale(1.04);
}

#playIcon {
    font-size: 13px;

    transform: translateX(1px);
}


/* =========================================================
   VOLUME
========================================================= */

.volume-area {
    display: flex;

    align-items: center;

    gap: 8px;
}

.volume-area span {
    color: #78879a;

    font-size: 11px;
}

#volume {
    width: 65px;

    height: 3px;

    accent-color: #7faef7;

    cursor: pointer;
}


/* =========================================================
   ELEMENTOS ORIGINAIS — MANTIDOS
========================================================= */

#onair,
#freq,
#dial,
#dialTicks,
#dialNeedle {

    position: absolute;

    width: 1px;
    height: 1px;

    overflow: hidden;

    opacity: 0;

    pointer-events: none;
}


/* =========================================================
   AUDIO
========================================================= */

#audio {
    display: none;
}


/* =========================================================
   PLAYER SECTION
========================================================= */

.player-section {
    position: absolute;

    width: 1px;
    height: 1px;

    overflow: hidden;

    opacity: 0;

    pointer-events: none;
}


/* =========================================================
   PROGRAMAÇÃO
========================================================= */

.program-section {
    padding: 80px 0;

    background: white;
}

.section-inner {
    width: min(1080px, calc(100% - 44px));

    margin: auto;
}

.section-heading {
    margin-bottom: 32px;
}

.section-label {
    margin-bottom: 8px;

    color: var(--blue);

    font-size: 10px;
    font-weight: 700;

    text-transform: uppercase;

    letter-spacing: 1.8px;
}

.section-heading h2 {
    margin: 0;

    font-family: "Space Grotesk", sans-serif;

    font-size: 38px;

    letter-spacing: -1.8px;
}

.section-heading p {
    max-width: 550px;

    margin: 11px 0 0;

    color: var(--muted);

    line-height: 1.6;

    font-size: 14px;
}


/* =========================================================
   PLAYLIST
========================================================= */

#playlist {
    display: grid;

    grid-template-columns: repeat(3, 1fr);

    gap: 15px;
}

.playlist-item {
    padding: 20px;

    border: 1px solid var(--border);

    border-radius: 13px;

    background: white;

    transition: .2s ease;
}

.playlist-item:hover {
    border-color: #cbdcf6;

    box-shadow: 0 12px 28px rgba(17,24,39,.06);

    transform: translateY(-2px);
}


/* =========================================================
   PEDIDOS
========================================================= */

.request-section {
    padding: 80px 0;

    background: var(--light);
}

.request-card {
    max-width: 680px;

    padding: 32px;

    background: white;

    border: 1px solid var(--border);

    border-radius: 18px;

    box-shadow: 0 15px 40px rgba(17,24,39,.05);
}

.request-card h2 {
    margin: 0 0 7px;

    font-family: "Space Grotesk", sans-serif;

    font-size: 29px;

    letter-spacing: -1px;
}

.request-card > p {
    margin: 0 0 25px;

    color: var(--muted);

    font-size: 14px;
}

#requestForm {
    display: grid;

    gap: 14px;
}

.form-group {
    display: grid;

    gap: 7px;
}

.form-group label {
    color: #374151;

    font-size: 12px;

    font-weight: 600;
}

.form-group input {
    width: 100%;

    height: 44px;

    padding: 0 13px;

    border: 1px solid #dfe4eb;

    border-radius: 9px;

    background: white;

    color: var(--text);

    outline: none;

    font-size: 13px;

    transition: .2s ease;
}

.form-group input:focus {
    border-color: var(--blue);

    box-shadow: 0 0 0 3px rgba(18,100,232,.09);
}

.request-submit {
    height: 44px;

    padding: 0 20px;

    border: 0;

    border-radius: 9px;

    background: var(--blue);

    color: white;

    font-size: 13px;

    font-weight: 700;

    transition: .2s ease;
}

.request-submit:hover {
    background: var(--blue-light);
}

#requestStatus {
    min-height: 17px;

    color: var(--muted);

    font-size: 12px;
}


/* =========================================================
   FOOTER
========================================================= */

footer {
    padding: 27px 20px;

    background: #07111f;

    color: #77869a;

    text-align: center;

    font-size: 11px;
}

footer strong {
    color: white;
}


/* =========================================================
   RESPONSIVO
========================================================= */

@media (max-width: 850px) {

    .hero-inner {
        grid-template-columns: 1fr;

        gap: 40px;

        padding: 65px 0;
    }

    .hero-player {
        justify-self: start;

        max-width: 500px;
    }

    #playlist {
        grid-template-columns: repeat(2, 1fr);
    }
}


@media (max-width: 600px) {

    header {
        height: 64px;
    }

    .header-inner,
    .hero-inner,
    .section-inner {
        width: calc(100% - 30px);
    }

    nav {
        gap: 15px;

        font-size: 11px;
    }

    nav a:last-child {
        display: none;
    }

    .hero-inner {
        min-height: auto;

        padding: 55px 0;
    }

    .hero h1 {
        font-size: 48px;

        letter-spacing: -2.8px;
    }

    .hero-description {
        font-size: 14px;
    }

    .player-card {
        padding: 21px;
    }

    .volume-area {
        display: none;
    }

    #playlist {
        grid-template-columns: 1fr;
    }

    .program-section,
    .request-section {
        padding: 60px 0;
    }

    .request-card {
        padding: 23px;
    }
}


/* =========================================================
   ACESSIBILIDADE
========================================================= */

button:focus-visible,
a:focus-visible,
input:focus-visible {
    outline: 3px solid rgba(18,100,232,.25);

    outline-offset: 3px;
}

</style>

</head>

<body>

<!-- =======================================================
     HEADER
======================================================= -->

<header>

```
<div class="header-inner">

    <a href="#" class="logo">

        <div class="logo-icon">
            OL
        </div>

        Onda <span>Livre</span> FM

    </a>


    <nav>

        <a href="#player">
            Ouvir
        </a>

        <a href="#programacao">
            Programação
        </a>

        <a href="#pedidos">
            Pedidos
        </a>

    </nav>

</div>
```

</header>

<!-- =======================================================
     HERO
======================================================= -->

<section class="hero">

```
<div class="hero-inner">


    <div class="hero-copy">

        <div class="live-status">

            <span class="live-dot"></span>

            AO VIVO • TRANSMISSÃO CONTÍNUA

        </div>


        <h1>

            A sua rádio.<br>

            <span>A sua onda.</span>

        </h1>


        <p class="hero-description">

            Música, informação e companhia para acompanhar
            você em todos os momentos.

        </p>


        <a
            href="#player"
            class="hero-button"
        >

            ▶ &nbsp; Ouvir agora

        </a>

    </div>


    <!-- =================================================
         PLAYER
    ================================================== -->

    <div
        class="hero-player"
        id="player"
    >

        <div class="player-card">


            <div class="player-top">

                <div class="player-live">

                    <span></span>

                    NO AR

                </div>


                <div
                    class="player-frequency"
                    id="freq"
                >
                    ONDA LIVRE FM
                </div>

            </div>


            <div class="player-main">


                <div class="station-art">

                    <strong>
                        FM
                    </strong>

                </div>


                <div class="track-data">

                    <div class="track-now">
                        Tocando agora
                    </div>

                    <div id="trackTitle">
                        Onda Livre FM
                    </div>

                    <div id="trackArtist">
                        Transmissão ao vivo
                    </div>

                </div>

            </div>


            <div class="player-line"></div>


            <div class="player-bottom">


                <div class="player-controls">


                    <button
                        id="shuffleBtn"
                        type="button"
                        aria-label="Aleatório"
                    >
                        ⤨
                    </button>


                    <button
                        id="prevBtn"
                        type="button"
                        aria-label="Anterior"
                    >
                        ‹
                    </button>


                    <button
                        id="playBtn"
                        type="button"
                        aria-label="Reproduzir"
                    >

                        <span id="playIcon">
                            ▶
                        </span>

                    </button>


                    <button
                        id="nextBtn"
                        type="button"
                        aria-label="Próxima"
                    >
                        ›
                    </button>

                </div>


                <div class="volume-area">

                    <span>
                        🔊
                    </span>

                    <input
                        id="volume"
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value="1"
                        aria-label="Volume"
                    >

                </div>

            </div>


            <!-- ELEMENTOS MANTIDOS -->

            <div id="onair">
                LIVE
            </div>

            <div id="dial"></div>

            <div id="dialTicks"></div>

            <div id="dialNeedle"></div>


            <audio
                id="audio"
                autoplay
                playsinline
                preload="auto"
            ></audio>


        </div>

    </div>

</div>
```

</section>

<!-- =======================================================
     PROGRAMAÇÃO
======================================================= -->

<section
    class="program-section"
    id="programacao"
>

```
<div class="section-inner">


    <div class="section-heading">

        <div class="section-label">
            programação
        </div>

        <h2>
            O que vem por aí
        </h2>

        <p>
            Confira nossa programação e acompanhe
            a Onda Livre FM durante todo o dia.
        </p>

    </div>


    <div id="playlist"></div>

</div>
```

</section>

<!-- =======================================================
     PEDIDOS
======================================================= -->

<section
    class="request-section"
    id="pedidos"
>

```
<div class="section-inner">


    <div class="request-card">

        <h2>
            Peça sua música
        </h2>


        <p>
            Envie seu pedido e participe da programação.
        </p>


        <form id="requestForm">


            <div class="form-group">

                <label for="reqName">
                    Seu nome
                </label>

                <input
                    id="reqName"
                    type="text"
                    placeholder="Digite seu nome"
                    autocomplete="name"
                >

            </div>


            <div class="form-group">

                <label for="reqSong">
                    Música
                </label>

                <input
                    id="reqSong"
                    type="text"
                    placeholder="Artista e música"
                >

            </div>


            <button
                type="submit"
                class="request-submit"
            >
                Enviar pedido
            </button>


            <div id="requestStatus"></div>

        </form>

    </div>

</div>
```

</section>

<!-- =======================================================
     FOOTER
======================================================= -->

<footer>

```
<strong>Onda Livre FM</strong>

&nbsp;•&nbsp;

Música que acompanha você
```

</footer>

<!-- =======================================================
     SCRIPT ORIGINAL
======================================================= -->

<script src="script.js"></script>

<!-- =======================================================
     SISTEMA DE AUTOPLAY + GANHO DE ÁUDIO
======================================================= -->

<script>

(function () {

    "use strict";


    let audio = null;

    let audioContext = null;

    let gainNode = null;

    let sourceNode = null;

    let audioProcessado = false;


    /* =====================================================
       LOCALIZA O AUDIO
    ===================================================== */

    function localizarAudio() {

        audio = document.getElementById("audio");

        return audio;

    }


    /* =====================================================
       CONFIGURA GANHO DO AUDIO
       
       O volume HTML vai até 1.
       Aqui usamos Web Audio para acrescentar ganho.
    ===================================================== */

    function configurarAudio() {

        if (!audio) {
            return false;
        }

        if (audioProcessado) {
            return true;
        }


        try {

            audioContext =
                new (
                    window.AudioContext ||
                    window.webkitAudioContext
                )();


            sourceNode =
                audioContext.createMediaElementSource(audio);


            gainNode =
                audioContext.createGain();


            /*
               1.8 = aproximadamente +5 dB.
               Aumenta o nível sem exagerar.
            */

            gainNode.gain.value = 1.8;


            sourceNode.connect(gainNode);

            gainNode.connect(audioContext.destination);


            audioProcessado = true;

            return true;

        } catch (erro) {

            /*
               Se o navegador não permitir Web Audio,
               o áudio continua funcionando normalmente.
            */

            console.log(
                "Web Audio não disponível:",
                erro
            );

            return false;

        }

    }


    /* =====================================================
       TENTA REPRODUZIR
    ===================================================== */

    function tocarRadio() {

        localizarAudio();

        if (!audio) {
            return;
        }


        /*
           Se ainda não existe SRC,
           aguarda o script.js definir a transmissão.
        */

        if (!audio.src) {
            return;
        }


        configurarAudio();


        if (
            audioContext &&
            audioContext.state === "suspended"
        ) {

            audioContext.resume().catch(function () {});

        }


        audio.volume = 1;


        const tentativa = audio.play();


        if (tentativa !== undefined) {

            tentativa
                .then(function () {

                    atualizarBotao(true);

                })
                .catch(function () {

                    atualizarBotao(false);

                });

        }

    }


    /* =====================================================
       ATUALIZA BOTÃO
    ===================================================== */

    function atualizarBotao(tocando) {

        const icon =
            document.getElementById("playIcon");

        const button =
            document.getElementById("playBtn");


        if (icon) {

            icon.textContent =
                tocando ? "❚❚" : "▶";

        }


        if (button) {

            button.setAttribute(
                "aria-label",
                tocando
                    ? "Pausar"
                    : "Reproduzir"
            );

        }

    }


    /* =====================================================
       BOTÃO PLAY
    ===================================================== */

    function configurarBotao() {

        const button =
            document.getElementById("playBtn");


        if (!button) {
            return;
        }


        button.addEventListener(
            "click",
            function () {

                localizarAudio();


                if (!audio) {
                    return;
                }


                configurarAudio();


                if (
                    audioContext &&
                    audioContext.state === "suspended"
                ) {

                    audioContext.resume();

                }


                if (audio.paused) {

                    audio.volume = 1;

                    audio.play()
                        .then(function () {

                            atualizarBotao(true);

                        })
                        .catch(function (erro) {

                            console.log(
                                "Não foi possível iniciar:",
                                erro
                            );

                        });

                } else {

                    audio.pause();

                    atualizarBotao(false);

                }

            }
        );

    }


    /* =====================================================
       EVENTOS DO AUDIO
    ===================================================== */

    function configurarEventosAudio() {

        localizarAudio();

        if (!audio) {
            return;
        }


        audio.addEventListener(
            "play",
            function () {

                atualizarBotao(true);

            }
        );


        audio.addEventListener(
            "pause",
            function () {

                atualizarBotao(false);

            }
        );


        audio.addEventListener(
            "loadeddata",
            function () {

                tocarRadio();

            }
        );


        audio.addEventListener(
            "canplay",
            function () {

                tocarRadio();

            }
        );


        audio.addEventListener(
            "loadedmetadata",
            function () {

                tocarRadio();

            }
        );

    }


    /* =====================================================
       OBSERVA ALTERAÇÕES NO AUDIO
       
       Isso é importante caso o script.js coloque
       o SRC depois que a página já carregou.
    ===================================================== */

    function observarAudio() {

        localizarAudio();

        if (!audio) {
            return;
        }


        const observer =
            new MutationObserver(function () {

                if (audio.src) {

                    tocarRadio();

                }

            });


        observer.observe(
            audio,
            {
                attributes: true,
                attributeFilter: ["src"]
            }
        );

    }


    /* =====================================================
       PRIMEIRA INICIALIZAÇÃO
    ===================================================== */

    function iniciar() {

        localizarAudio();

        configurarBotao();

        configurarEventosAudio();

        observarAudio();


        /*
           Tentativas escalonadas.
           O script.js pode precisar de alguns
           instantes para configurar a transmissão.
        */

        tocarRadio();


        setTimeout(
            tocarRadio,
            300
        );


        setTimeout(
            tocarRadio,
            800
        );


        setTimeout(
            tocarRadio,
            1500
        );


        setTimeout(
            tocarRadio,
            3000
        );

    }


    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            iniciar
        );

    } else {

        iniciar();

    }


})();

</script>

</body>

</html>
