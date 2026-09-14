// ============================================================
// CONFIGURAÇÃO
// Cole aqui a URL do seu Web App do Google Apps Script
// (termina em /exec). Veja apps-script/Code.gs e o README.
// ============================================================
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzpUdFgqkdcKjG8Oa2IEL9q3vD3ubZzLjKxiP64Vykl/dev";

const FREQ_MIN = 88.0;
const FREQ_MAX = 108.0;

const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const playIcon = document.getElementById("playIcon");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const volume = document.getElementById("volume");
const trackTitle = document.getElementById("trackTitle");
const trackArtist = document.getElementById("trackArtist");
const playlistEl = document.getElementById("playlist");
const freqEl = document.getElementById("freq");
const onairEl = document.getElementById("onair");
const needle = document.getElementById("dialNeedle");
const dialTicks = document.getElementById("dialTicks");

let playlist = [];
let currentIndex = 0;
let shuffled = false;

init();

async function init() {
  buildTicks();
  audio.volume = volume.value / 100;
  await loadPlaylist();
  bindEvents();
}

function buildTicks() {
  const total = 40;
  let html = "";
  for (let i = 0; i < total; i++) {
    html += `<span class="${i % 5 === 0 ? "major" : ""}"></span>`;
  }
  dialTicks.innerHTML = html;
}

async function loadPlaylist() {
  try {
    const res = await fetch(`${SCRIPT_URL}?action=playlist`);
    const data = await res.json();
    playlist = Array.isArray(data.tracks) ? data.tracks : [];
    if (!playlist.length) throw new Error("playlist vazia");
    renderPlaylist();
    loadTrack(0);
  } catch (err) {
    trackTitle.textContent = "Não foi possível carregar a playlist";
    trackArtist.textContent = "Confira a URL do Apps Script em script.js";
    console.error(err);
  }
}

function renderPlaylist() {
  playlistEl.innerHTML = playlist
    .map(
      (t, i) =>
        `<li data-index="${i}"><span class="n">${String(i + 1).padStart(2, "0")}</span><span>${escapeHtml(t.titulo)} — ${escapeHtml(t.artista || "")}</span></li>`
    )
    .join("");
}

function loadTrack(index) {
  currentIndex = (index + playlist.length) % playlist.length;
  const track = playlist[currentIndex];
  audio.src = track.url;
  trackTitle.textContent = track.titulo;
  trackArtist.textContent = track.artista || "";
  updateDial();
  highlightPlaylist();
}

function updateDial() {
  const pct = playlist.length > 1 ? currentIndex / (playlist.length - 1) : 0;
  const freq = FREQ_MIN + pct * (FREQ_MAX - FREQ_MIN);
  freqEl.textContent = freq.toFixed(1);
  needle.style.left = `${pct * 100}%`;
}

function highlightPlaylist() {
  [...playlistEl.children].forEach((li, i) =>
    li.classList.toggle("active", i === currentIndex)
  );
}

function play() {
  audio.play();
  playIcon.innerHTML = "&#10074;&#10074;";
  onairEl.textContent = "NO AR";
  onairEl.classList.add("live");
}

function pause() {
  audio.pause();
  playIcon.innerHTML = "&#9654;";
  onairEl.textContent = "PAUSADO";
  onairEl.classList.remove("live");
}

function next() {
  const idx = shuffled
    ? Math.floor(Math.random() * playlist.length)
    : currentIndex + 1;
  loadTrack(idx);
  if (!audio.paused || onairEl.classList.contains("live")) play();
}

function prev() {
  loadTrack(currentIndex - 1);
  if (onairEl.classList.contains("live")) play();
}

function bindEvents() {
  playBtn.addEventListener("click", () => {
    if (audio.paused) play();
    else pause();
  });

  nextBtn.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);

  audio.addEventListener("ended", next);

  volume.addEventListener("input", () => {
    audio.volume = volume.value / 100;
  });

  shuffleBtn.addEventListener("click", () => {
    shuffled = !shuffled;
    shuffleBtn.setAttribute("aria-pressed", String(shuffled));
  });

  playlistEl.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (!li) return;
    loadTrack(Number(li.dataset.index));
    play();
  });

  document.getElementById("requestForm").addEventListener("submit", sendRequest);
}

async function sendRequest(e) {
  e.preventDefault();
  const nome = document.getElementById("reqName").value.trim();
  const musica = document.getElementById("reqSong").value.trim();
  const status = document.getElementById("requestStatus");
  status.textContent = "Enviando...";
  try {
    // Content-Type text/plain evita o preflight CORS que o
    // Apps Script não responde por padrão.
    await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "pedido", nome, musica }),
    });
    status.textContent = `Pedido enviado! Obrigado, ${nome}.`;
    e.target.reset();
  } catch (err) {
    status.textContent = "Não foi possível enviar o pedido agora.";
    console.error(err);
  }
}

function escapeHtml(str) {
  return String(str).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}
