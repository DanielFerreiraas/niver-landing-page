/* ============================================
   🎉 CONFIGURAÇÕES EDITÁVEIS - PERSONALIZE AQUI
   ============================================ */

// Nome da sua namorada (aparecerá em várias partes da página)
const GIRLFRIEND_NAME = "A minha Gatinha";

// Data alvo no formato ISO (YYYY-MM-DDTHH:mm:ss) - SERÁ LIBERADA NESTA DATA
// EXEMPLO: "2025-12-25T00:00:00" para dia 25 de dezembro de 2025 à meia-noite
const TARGET_ISO = "2025-11-02T00:00:00";

// URL da música (pode ser local: "assets/musica.mp3" ou externa)
const MUSIC_URL = "assets/Amor Verdadeiro [v8puJ1l1Dfs].mp3";

// Array com as fotos da galeria
// Formato: { src: "URL_DA_IMAGEM", alt: "DESCRIÇÃO", caption: "LEGENDA" }
const GALLERY = [
  {
    src: "assets/img-1.webp",
    alt: "Nossa primeira foto",
    caption: "Quando a gente menos esperava estar juntos 💕",
  },
  {
    src: "assets/img-2.webp",
    alt: "Momentos especiais",
    caption: "Quando Deus começou a confirmar o nosso relacionamento",
  },
];

// Mensagem de felicitações (HTML permitido)
const MESSAGE_HTML = `
    <p>Minha gatinha,</p>
    <p>Hoje é um dia especial não apenas por ser uma data marcante no calendário, 
    mas porque é o aniversário da minha gatinhaaaa, uma oportunidade de celebrar sua vida, a pessoa mais incrível que já conheci.</p>
    <p>Cada dia ao seu lado é uma bênção. Seu sorriso e os seus olhinhos maaar lindos iluminam a minha vida, sua presença preenche 
    meu coração, e seu amor transforma cada momento em algo extraordinário.</p>
    <p>Neste dia tão especial, quero que saiba o quanto você é amada e importante pra mim. 
    Obrigado por ser quem você é, por trazer tanta alegria ao meu mundo e por fazer 
    da minha vida uma história mais bonita de se viver. Eu sou muito grato a Deus todos os dias, por você ser a minha Escolhida, por ter você todos os dias e poder cuidar da minha gatinha.
    </p>
    <p>Antes eu apenas te admirava de longe, gostava de você e orava pra que um dia Deus pudesse confirmar se a gente estaria juntos, se era com você que eu iria construir minha familia. Hoje temos essa confirmação e as vezes não cai a ficha de que a pessoa que eu já admirava tanto, hoje já faz parte da minha vida, você é uma das minhas maiores bençãos, o meu presentinho vindo de Deus, a minha "Rebeca" que Deus teve tanto cuidado em colocar você na minha vida no tempo dEle, você sabe e eu já falei várias vezes que eu estarei sempre com você, segurando a sua mão, o que eu mais quero é te ver feliz eu oro todos os dias por você por NÓS, e eu sou muito suspeito pra falar, mas você é sem dúvidas a menina maaar lindaaa que eu já vi, te admiro não apenas por sua beleza que é imensurável, seus olhinhos o seu sorriso, seu cabelo tãoo lindoo, mas por ser temente a Deus, uma mulher de oração, que está sempre buscando agradar a Deus, e isso sem dúvidas é o que me faz querer estar com você até a eternidade juntosss, eu amo você não pelo que pode fazer por mim, mas por quem você é, e eu farei de tudo por nós, sempre lutarei por você e pra que o nosso relacionamento esteja forte, todo esse gesto de amor, é pra que eu possa apenas te lembrar o quanto você é importante pra mim, minha gatinha.</p>
    <p>Que este novo ciclo seja repleto de momentos memoráveis, sonhos realizados 
    e muito mais amor para compartilhar juntos.</p>
    <p>Com todo meu amor,<br><strong> Seu Príncipe</strong> 💖</p>
`;

/* ============================================
   VARIÁVEIS GLOBAIS
   ============================================ */
let currentPhotoIndex = 0;
let isUnlocked = false;
let isAudioInitialized = false;
let backgroundAnimationEnabled = false;

/* ============================================
   INICIALIZAÇÃO
   ============================================ */
document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
});

function initializeApp() {
  // Verificar modo preview
  const urlParams = new URLSearchParams(window.location.search);
  const isPreview = urlParams.get("preview") === "1";

  // Verificar se a data já chegou
  const dateReached = isTargetDateReached();

  // Inicializar nome
  document.getElementById("countdown-name").textContent = GIRLFRIEND_NAME;

  // Só liberar se: preview mode OU data já chegou
  if (isPreview || dateReached) {
    // Liberar conteúdo
    isUnlocked = true;
    unlockContent();
  } else {
    // Data ainda não chegou - limpar localStorage e mostrar countdown
    localStorage.removeItem("unlocked");
    showCountdown();
    startCountdown();
  }

  // Configurar overlays e eventos
  setupEventListeners();
  initializeCanvas();
}

/* ============================================
   COUNTDOWN E UNLOCK
   ============================================ */
function isTargetDateReached() {
  const targetDate = new Date(TARGET_ISO);
  const now = new Date();
  return now >= targetDate;
}

function getTimeRemaining() {
  const targetDate = new Date(TARGET_ISO);
  const now = new Date();
  const difference = targetDate - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}

function updateCountdownDisplay(time) {
  document.getElementById("days").textContent = String(time.days).padStart(
    2,
    "0"
  );
  document.getElementById("hours").textContent = String(time.hours).padStart(
    2,
    "0"
  );
  document.getElementById("minutes").textContent = String(
    time.minutes
  ).padStart(2, "0");
  document.getElementById("seconds").textContent = String(
    time.seconds
  ).padStart(2, "0");
}

function showCountdown() {
  document.getElementById("countdown-screen").classList.remove("hidden");
  document.getElementById("content-screen").classList.add("hidden");
}

function startCountdown() {
  updateCountdownDisplay(getTimeRemaining());

  const interval = setInterval(() => {
    const time = getTimeRemaining();
    updateCountdownDisplay(time);

    if (
      time.days === 0 &&
      time.hours === 0 &&
      time.minutes === 0 &&
      time.seconds === 0
    ) {
      clearInterval(interval);
      unlockContent();
    }
  }, 1000);
}

function unlockContent() {
  // Marcar como desbloqueado
  localStorage.setItem("unlocked", "true");
  isUnlocked = true;

  // Ocultar countdown, mostrar conteúdo
  document.getElementById("countdown-screen").classList.add("hidden");
  document.getElementById("content-screen").classList.remove("hidden");

  // Atualizar data no hero
  updateHeroDate();

  // Inicializar conteúdo
  initializeGallery();
  initializeMessage();
  initializeAudio();

  // Animação de confetti
  triggerConfetti();

  // Scroll suave
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateHeroDate() {
  const targetDate = new Date(TARGET_ISO);
  const formatter = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Recife",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedDate = formatter.format(targetDate);
  document.getElementById(
    "hero-date"
  ).textContent = `Feliz aniversário minha gatinha ${formattedDate}`;
}

/* ============================================
   EVENT LISTENERS
   ============================================ */
function setupEventListeners() {
  // Overlay de música
  const startButton = document.getElementById("start-experience");
  const overlay = document.getElementById("music-overlay");

  startButton.addEventListener("click", () => {
    overlay.classList.add("hidden");
    if (isUnlocked && !isAudioInitialized) {
      initializeAudio();
    }
  });

  // Scroll para mensagem
  const scrollBtn = document.getElementById("scroll-to-message");
  scrollBtn.addEventListener("click", () => {
    document
      .getElementById("message-section")
      .scrollIntoView({ behavior: "smooth" });
  });

  // Botão de impressão
  const printBtn = document.getElementById("print-message");
  printBtn.addEventListener("click", () => {
    window.print();
  });

  // Toggle animação
  const toggleAnimBtn = document.getElementById("toggle-animation");
  toggleAnimBtn.addEventListener("click", () => {
    backgroundAnimationEnabled = !backgroundAnimationEnabled;
    const canvas = document.getElementById("background-canvas");
    if (backgroundAnimationEnabled) {
      canvas.classList.remove("hidden");
      startBackgroundAnimation();
    } else {
      canvas.classList.add("hidden");
      stopBackgroundAnimation();
    }
  });

  // Close overlay on overlay click (not content)
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.classList.add("hidden");
      if (isUnlocked && !isAudioInitialized) {
        initializeAudio();
      }
    }
  });
}

/* ============================================
   ÁUDIO PLAYER
   ============================================ */
function initializeAudio() {
  if (isAudioInitialized) return;

  const audio = document.getElementById("audio-player");
  const playPauseBtn = document.getElementById("play-pause");
  const progress = document.getElementById("progress");
  const currentTimeEl = document.getElementById("current-time");
  const totalTimeEl = document.getElementById("total-time");
  const volumeSlider = document.getElementById("volume");
  const volumeIcon = document.getElementById("volume-icon");

  // Set music URL
  audio.src = MUSIC_URL;

  // Update total time
  audio.addEventListener("loadedmetadata", () => {
    totalTimeEl.textContent = formatTime(audio.duration);
  });

  // Play/Pause
  playPauseBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      playPauseBtn.querySelector(".icon").textContent = "⏸";
    } else {
      audio.pause();
      playPauseBtn.querySelector(".icon").textContent = "▶";
    }
  });

  // Progress update
  audio.addEventListener("timeupdate", () => {
    const percent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = percent + "%";
    currentTimeEl.textContent = formatTime(audio.currentTime);
  });

  // Progress bar click
  const progressBar = progress.parentElement;
  progressBar.addEventListener("click", (e) => {
    const width = progressBar.offsetWidth;
    const clickX = e.offsetX;
    const percent = clickX / width;
    audio.currentTime = percent * audio.duration;
  });

  // Volume control
  volumeSlider.addEventListener("input", (e) => {
    audio.volume = e.target.value / 100;
    if (audio.volume === 0) {
      volumeIcon.textContent = "🔇";
    } else if (audio.volume < 0.5) {
      volumeIcon.textContent = "🔉";
    } else {
      volumeIcon.textContent = "🔊";
    }
  });

  isAudioInitialized = true;
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

/* ============================================
   GALERIA E LIGHTBOX
   ============================================ */
function initializeGallery() {
  const gallery = document.getElementById("photo-gallery");

  GALLERY.forEach((photo, index) => {
    const item = document.createElement("div");
    item.className = "gallery-item";
    item.addEventListener("click", () => openLightbox(index));

    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = photo.alt;
    img.loading = "lazy";

    const caption = document.createElement("div");
    caption.className = "gallery-caption";
    caption.textContent = photo.caption;

    item.appendChild(img);
    item.appendChild(caption);
    gallery.appendChild(item);
  });

  // Lightbox controls
  document
    .getElementById("close-lightbox")
    .addEventListener("click", closeLightbox);
  document
    .getElementById("prev-photo")
    .addEventListener("click", showPreviousPhoto);
  document
    .getElementById("next-photo")
    .addEventListener("click", showNextPhoto);

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    const lightbox = document.getElementById("lightbox");
    if (!lightbox.classList.contains("hidden")) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPreviousPhoto();
      if (e.key === "ArrowRight") showNextPhoto();
    }
  });

  // Click outside to close
  document.getElementById("lightbox").addEventListener("click", (e) => {
    if (e.target.id === "lightbox") {
      closeLightbox();
    }
  });
}

function openLightbox(index) {
  currentPhotoIndex = index;
  const photo = GALLERY[index];

  document.getElementById("lightbox-image").src = photo.src;
  document.getElementById("lightbox-image").alt = photo.alt;
  document.getElementById("lightbox-caption").textContent = photo.caption;

  document.getElementById("lightbox").classList.remove("hidden");
}

function closeLightbox() {
  document.getElementById("lightbox").classList.add("hidden");
}

function showPreviousPhoto() {
  currentPhotoIndex = (currentPhotoIndex - 1 + GALLERY.length) % GALLERY.length;
  openLightbox(currentPhotoIndex);
}

function showNextPhoto() {
  currentPhotoIndex = (currentPhotoIndex + 1) % GALLERY.length;
  openLightbox(currentPhotoIndex);
}

/* ============================================
   MENSAGEM COM EFEITO TYPEWRITER
   ============================================ */
function initializeMessage() {
  const messageEl = document.getElementById("message-text");

  // Limpar e preparar para typewriter
  messageEl.textContent = "";

  // Converter HTML para texto para o efeito
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = MESSAGE_HTML;
  const textContent = tempDiv.textContent || tempDiv.innerText || "";

  let index = 0;
  const chars = textContent.split("");

  function typeWriter() {
    if (index < chars.length) {
      messageEl.textContent += chars[index];
      index++;
      setTimeout(typeWriter, 30); // Velocidade da digitação
    }
  }

  // Iniciar efeito
  typeWriter();
}

/* ============================================
   ANIMAÇÃO DE FUNDO (CANVAS)
   ============================================ */
let animationFrameId = null;
let hearts = [];

function initializeCanvas() {
  const canvas = document.getElementById("background-canvas");
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // Criar corações iniciais
  createHearts();
}

function createHearts() {
  hearts = [];
  for (let i = 0; i < 20; i++) {
    hearts.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1,
      speedY: Math.random() * 0.5 + 0.2,
      speedX: Math.random() * 0.5 - 0.25,
      opacity: Math.random() * 0.5 + 0.2,
    });
  }
}

function startBackgroundAnimation() {
  if (animationFrameId) return;

  const canvas = document.getElementById("background-canvas");
  const ctx = canvas.getContext("2d");

  function animate() {
    if (!backgroundAnimationEnabled) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    hearts.forEach((heart) => {
      heart.y += heart.speedY;
      heart.x += heart.speedX;

      if (heart.y > canvas.height) {
        heart.y = -10;
        heart.x = Math.random() * canvas.width;
      }

      if (heart.x > canvas.width || heart.x < 0) {
        heart.x = Math.random() * canvas.width;
        heart.y = Math.random() * canvas.height;
      }

      drawHeart(ctx, heart.x, heart.y, heart.size, heart.opacity);
    });

    animationFrameId = requestAnimationFrame(animate);
  }

  animate();
}

function stopBackgroundAnimation() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

function drawHeart(ctx, x, y, size, opacity) {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.fillStyle = "var(--cor-primaria)";

  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.bezierCurveTo(
    x - size,
    y - size,
    x - size * 2,
    y - size * 0.5,
    x - size * 2,
    y + size
  );
  ctx.bezierCurveTo(
    x - size * 2,
    y + size * 1.5,
    x - size,
    y + size * 2,
    x,
    y + size * 2.5
  );
  ctx.bezierCurveTo(
    x + size,
    y + size * 2,
    x + size * 2,
    y + size * 1.5,
    x + size * 2,
    y + size
  );
  ctx.bezierCurveTo(
    x + size * 2,
    y - size * 0.5,
    x + size,
    y - size,
    x,
    y - size
  );
  ctx.fill();

  ctx.restore();
}

/* ============================================
   CONFETI
   ============================================ */
function triggerConfetti() {
  const container = document.getElementById("confetti-container");
  const colors = ["#ff6b9d", "#c471ed", "#4ecdc4", "#ffd93d", "#6c5ce7"];

  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.left = Math.random() * 100 + "%";
      confetti.style.width = Math.random() * 10 + 5 + "px";
      confetti.style.height = confetti.style.width;
      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 0.5 + "s";
      confetti.style.animationDuration = Math.random() * 2 + 2 + "s";

      container.appendChild(confetti);

      setTimeout(() => confetti.remove(), 5000);
    }, i * 30);
  }
}
