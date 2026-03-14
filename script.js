/* ==============================================
   BIRTHDAY WEBSITE – SCRIPT.JS
   All interactivity, animations, and effects
   ============================================== */

'use strict';

// ========================================================
// STATE
// ========================================================
const ACCEPTED_NICKNAMES = ['shreya', 'shrey', 'bestie', 'birthday girl'];
const sections = ['cake', 'timeline', 'gallery', 'video-section', 'message', 'quiz', 'finale'];
let currentSection = null;
let musicPlaying = false;
let candlesLit = 0;
let candlesBlown = false;
let quizIndex = 0;
let quizScore = 0;
let heartPuzzleCount = 0;

// ========================================================
// QUIZ DATA
// ========================================================
const quizData = [
  {
    q: 'What is her favourite comfort food? 🍕',
    opts: ['Pizza', 'Sushi', 'Biryani', 'Pasta'],
    correct: 2,
    wrongMsg: '😂 Ha! Try again! That\'s a good guess though!',
    correctMsg: '🎉 Absolutely right! She would agree!',
    photo: 'image/S1.png'
  },
  {
    q: 'Who makes her laugh the most? 😂',
    opts: ['Her Bestie ', 'Random memes', 'Stand-up comedians'],
    correct: 1,
    wrongMsg: '🤭 Hmm, close… but think harder!',
    correctMsg: '💖 Of course! You two are comedy gold!',
    photo: 'image/S2.jpeg'
  },
  {
    q: 'What is her dream travel destination? ✈️',
    opts: ['Maldives', 'Paris', 'Bali', 'New York'],
    correct: 0,
    wrongMsg: '😭 Nope! She dreams bigger — think Europe!',
    correctMsg: '✨ Paris, the city of love — perfect for her!',
    photo: 'image/S3.jpeg'
  },
  {
    q: 'What colour best describes her personality? 🌸',
    opts: ['Pink – warm and loving', 'Blue – calm and wise', 'Yellow – bright and sunny', 'Purple – creative and magical'],
    correct: 0,
    wrongMsg: '🙈 That\'s cute, but she\'s undeniably Pink!',
    correctMsg: '💗 Pink all the way — warm, loving, and wonderful!',
    photo: 'image/S4.jpeg'
  }
];

// ========================================================
// HELPERS
// ========================================================
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => {
    s.classList.remove('active-section');
    s.classList.add('hidden');
    s.style.display = '';
  });
  const target = document.getElementById(id);
  if (!target) return;
  target.classList.remove('hidden');
  target.classList.add('active-section');
  target.style.display = 'flex';
  currentSection = id;

  // Update nav dots
  document.querySelectorAll('.dot-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.section === id);
  });

  // Trigger section-specific init
  if (id === 'timeline' || id === 'gallery') initReveal();
  if (id === 'finale') initFinale();
  if (id === 'quiz') initQuiz();
  if (id === 'cake') launchCakeBalloons();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function rand(min, max) { return Math.random() * (max - min) + min; }
function randInt(min, max) { return Math.floor(rand(min, max)); }

// ========================================================
// FLOATING BALLOONS (landing)
// ========================================================
const BALLOON_EMOJIS = ['🎈', '🎀', '🎊', '🎉', '💜', '💗', '🌸', '✨', '⭐', '🌟'];
function spawnBalloon() {
  const container = document.getElementById('balloonContainer');
  if (!container) return;
  const el = document.createElement('span');
  el.className = 'balloon';
  el.textContent = BALLOON_EMOJIS[randInt(0, BALLOON_EMOJIS.length)];
  el.style.left = rand(0, 98) + 'vw';
  el.style.fontSize = rand(1.6, 3.4) + 'rem';
  const dur = rand(7, 16);
  el.style.animationDuration = dur + 's';
  el.style.animationDelay = '0s';
  container.appendChild(el);
  setTimeout(() => el.remove(), dur * 1000);
}

function initBalloons() {
  // Spawn balloons periodically
  for (let i = 0; i < 14; i++) {
    setTimeout(spawnBalloon, randInt(0, 6000));
  }
  setInterval(spawnBalloon, 900);
}

// ========================================================
// EMOJI RAIN (landing – confetti)
// ========================================================
const CONFETTI_EMOJIS = ['🎉', '🎊', '✨', '💫', '🌸', '🎈', '💖', '⭐', '🎀', '🥳'];
function initEmojiRain() {
  const container = document.getElementById('emojiRain');
  if (!container) return;
  function drop() {
    const el = document.createElement('span');
    el.className = 'emoji-flake';
    el.textContent = CONFETTI_EMOJIS[randInt(0, CONFETTI_EMOJIS.length)];
    el.style.left = rand(0, 98) + 'vw';
    el.style.fontSize = rand(0.8, 1.8) + 'rem';
    const dur = rand(4, 9);
    el.style.animationDuration = dur + 's';
    el.style.animationDelay = '0s';
    container.appendChild(el);
    setTimeout(() => el.remove(), dur * 1000);
  }
  for (let i = 0; i < 20; i++) setTimeout(drop, randInt(0, 3000));
  setInterval(drop, 400);
}

// ========================================================
// GLOBAL PARTICLE CANVAS (sparkles)
// ========================================================
(function initGlobalCanvas() {
  const canvas = document.getElementById('globalCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = rand(0, W); this.y = rand(0, H);
      this.r = rand(1, 2.5);
      this.vx = rand(-0.3, 0.3); this.vy = rand(-0.5, -0.15);
      this.alpha = rand(0.3, 0.9);
      this.decay = rand(0.003, 0.008);
      const hue = randInt(280, 360);
      this.color = `hsla(${hue},100%,80%,`;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      this.alpha -= this.decay;
      if (this.alpha <= 0) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

// ========================================================
// SECTION 1 – LANDING
// ========================================================
function initLanding() {
  document.getElementById('startBtn').addEventListener('click', () => {
    showSection('unlock');
  });
}

// ========================================================
// SECTION 2 – UNLOCK
// ========================================================
function initUnlock() {
  const input = document.getElementById('nicknameInput');
  const btn   = document.getElementById('unlockBtn');
  const error = document.getElementById('errorMsg');
  const overlay = document.getElementById('unlockOverlay');
  const hearts = document.querySelectorAll('.heart-puzzle');

  // Heart puzzle highlights as "progress"
  hearts.forEach(h => {
    h.addEventListener('click', () => {
      heartPuzzleCount = Math.min(heartPuzzleCount + 1, 5);
      hearts.forEach((hh, i) => {
        hh.textContent = i < heartPuzzleCount ? '❤️' : '🤍';
        hh.classList.toggle('active', i < heartPuzzleCount);
      });
      if (heartPuzzleCount === 5) {
        // Heart puzzle fully clicked → unlock
        triggerUnlock();
      }
    });
  });

  function tryUnlock() {
    const val = input.value.trim().toLowerCase();
    if (ACCEPTED_NICKNAMES.some(n => val.includes(n)) || val.length >= 3) {
      triggerUnlock();
    } else {
      error.classList.remove('hidden');
      input.classList.add('shake');
      setTimeout(() => input.classList.remove('shake'), 500);
    }
  }

  function triggerUnlock() {
    overlay.classList.remove('hidden');
    startMusic();
    setTimeout(() => {
      overlay.classList.add('hidden');
      document.getElementById('dotNav').classList.remove('hidden');
      document.getElementById('musicBtn').classList.remove('hidden');
      showSection('cake');
    }, 2200);
  }

  btn.addEventListener('click', tryUnlock);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') tryUnlock(); });
}

// ========================================================
// SECTION 3 – CAKE
// ========================================================
function initCake() {
  const candles = document.querySelectorAll('.candle');
  const wishMsg = document.getElementById('wishMsg');
  const blowBtn = document.getElementById('blowBtn');
  candlesLit = 0; candlesBlown = false;

  candles.forEach(candle => {
    candle.addEventListener('click', () => {
      if (candlesBlown) return;
      const flame = candle.querySelector('.flame');
      if (!flame.classList.contains('hidden')) return; // already lit
      flame.classList.remove('hidden');
      candlesLit++;
      if (candlesLit === candles.length) {
        wishMsg.classList.remove('hidden');
        blowBtn.classList.remove('hidden');
      }
    });
  });

  blowBtn.addEventListener('click', () => {
    if (candlesBlown) return;
    candlesBlown = true;
    // Extinguish all flames with scale animation
    candles.forEach(c => {
      const flame = c.querySelector('.flame');
      flame.style.transition = 'transform .4s, opacity .4s';
      flame.style.transform = 'scale(0)';
      flame.style.opacity = '0';
      setTimeout(() => flame.classList.add('hidden'), 450);
    });
    wishMsg.textContent = '🌟 Your wish has been made! May it come true! 🌟';
    blowBtn.classList.add('hidden');

    // Launch confetti
    launchConfetti();

    // Show the Next button after a short delay
    setTimeout(() => {
      const nextWrap = document.getElementById('cakeNextWrap');
      if (nextWrap) nextWrap.style.display = 'flex';
      document.getElementById('cakeNextBtn').addEventListener('click', () => showSection('timeline'));
    }, 1800);
  });
}

function launchCakeBalloons() {
  const container = document.getElementById('cakeBalloons');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      const el = document.createElement('span');
      el.className = 'balloon';
      el.textContent = BALLOON_EMOJIS[randInt(0, BALLOON_EMOJIS.length)];
      el.style.left = rand(0, 90) + '%';
      el.style.fontSize = rand(1.4, 2.6) + 'rem';
      const dur = rand(5, 12);
      el.style.animationDuration = dur + 's';
      container.appendChild(el);
      setTimeout(() => el.remove(), dur * 1000);
    }, i * 500);
  }
}

// ========================================================
// CONFETTI via canvas overlay (temporary)
// ========================================================
function launchConfetti() {
  const cvs = document.createElement('canvas');
  cvs.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999';
  document.body.appendChild(cvs);
  const ctx = cvs.getContext('2d');
  cvs.width = window.innerWidth; cvs.height = window.innerHeight;

  const colors = ['#ff69b4','#e91e8c','#ffeb3b','#ce93d8','#80deea','#fff'];
  const confetti = Array.from({length: 180}, () => ({
    x: rand(0, cvs.width), y: rand(-100, -10),
    vx: rand(-2, 2), vy: rand(3, 7),
    r: rand(4, 10), color: colors[randInt(0, colors.length)],
    spin: rand(-4, 4), angle: rand(0, 360)
  }));

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    confetti.forEach(c => {
      c.y += c.vy; c.x += c.vx; c.angle += c.spin;
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.angle * Math.PI / 180);
      ctx.fillStyle = c.color;
      ctx.fillRect(-c.r / 2, -c.r / 2, c.r, c.r * 1.4);
      ctx.restore();
    });
    frame++;
    if (frame < 180) requestAnimationFrame(draw);
    else cvs.remove();
  }
  draw();
}

// ========================================================
// SECTION 4 & 5 – REVEAL ON SCROLL / VISIBILITY
// ========================================================
function initReveal() {
  const items = document.querySelectorAll('.reveal-item');
  if (!items.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach((el, i) => {
    el.style.transitionDelay = (i * 0.12) + 's';
    obs.observe(el);
  });

  // Also trigger for items already in view
  setTimeout(() => {
    items.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92) {
        el.classList.add('revealed');
      }
    });
  }, 200);
}

// ========================================================
// SECTION 5 – GALLERY / LIGHTBOX
// ========================================================
function initGallery() {
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lightboxImg');
  const lbClose  = document.getElementById('lightboxClose');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      lbImg.src = item.dataset.src;
      lightbox.classList.remove('hidden');
      lightbox.style.display = 'flex';
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

  function closeLightbox() {
    lightbox.classList.add('hidden');
    lightbox.style.display = '';
  }
}

// ========================================================
// SECTION 6 – VIDEO
// ========================================================
function initVideo() {
  const overlay = document.getElementById('videoPlayOverlay');
  const video   = document.getElementById('birthdayVideo');
  if (!overlay || !video) return;

  overlay.addEventListener('click', () => {
    overlay.style.display = 'none';
    video.play();
  });
  video.addEventListener('pause', () => { overlay.style.display = 'flex'; });
  video.addEventListener('ended', () => { overlay.style.display = 'flex'; });
}

// ========================================================
// SECTION 7 – SECRET MESSAGE
// ========================================================
const SECRET_MESSAGE =
`You are not just my best friend —\nyou are one of the most special people in my life.\n\nThank you for every laugh, every memory,\nand every moment we share.\n\nI hope your birthday is filled with happiness,\nlove, and beautiful surprises.\n\nYou deserve all the magic in the world. 🌸`;

function initMessage() {
  const heart = document.getElementById('bigHeart');
  const card  = document.getElementById('typewriterCard');
  const text  = document.getElementById('typewriterText');
  const hint  = document.querySelector('.heart-hint');
  let revealed = false;

  heart.parentElement.addEventListener('click', () => {
    if (revealed) return;
    revealed = true;
    heart.textContent = '💖';
    heart.style.animation = 'none';
    heart.style.transform = 'scale(1.4)';
    if (hint) hint.style.opacity = '0';

    setTimeout(() => {
      card.classList.remove('hidden');
      card.style.display = 'block';
      typewrite(text, SECRET_MESSAGE, 40);
    }, 600);
  });
}

function typewrite(el, text, speed) {
  el.textContent = '';
  let i = 0;
  function tick() {
    if (i < text.length) {
      el.textContent += text[i++];
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setTimeout(tick, speed);
    }
  }
  tick();
}

// ========================================================
// SECTION 8 – QUIZ
// ========================================================
function initQuiz() {
  quizIndex = 0; quizScore = 0;
  renderQuestion();

  document.getElementById('quizRestart').addEventListener('click', () => {
    document.getElementById('quizFinal').classList.add('hidden');
    quizIndex = 0; quizScore = 0;
    renderQuestion();
  });
}

function renderQuestion() {
  const q = quizData[quizIndex];
  document.getElementById('quizNum').textContent = `Question ${quizIndex + 1} / ${quizData.length}`;
  document.getElementById('quizProgress').style.width = ((quizIndex / quizData.length) * 100) + '%';
  document.getElementById('quizQuestion').textContent = q.q;
  document.getElementById('quizResult').classList.add('hidden');
  document.getElementById('quizResult').textContent = '';

  const optCont = document.getElementById('quizOptions');
  optCont.innerHTML = '';
  q.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opt';
    btn.textContent = opt;
    btn.addEventListener('click', () => handleAnswer(i));
    optCont.appendChild(btn);
  });
}

function handleAnswer(idx) {
  const q = quizData[quizIndex];
  const opts = document.querySelectorAll('.quiz-opt');
  const result = document.getElementById('quizResult');

  opts.forEach(b => b.disabled = true);
  opts[q.correct].classList.add('correct');

  const isCorrect = idx === q.correct;
  if (!isCorrect) opts[idx].classList.add('wrong');
  if (isCorrect) quizScore++;

  result.textContent = isCorrect ? q.correctMsg : q.wrongMsg;
  result.classList.remove('hidden');
  if (isCorrect) launchConfetti();

  setTimeout(() => {
    quizIndex++;
    if (quizIndex < quizData.length) {
      renderQuestion();
    } else {
      showQuizFinal();
    }
  }, 2800);
}

function showQuizFinal() {
  document.getElementById('quizOptions').innerHTML = '';
  document.getElementById('quizQuestion').textContent = '';
  document.getElementById('quizNum').textContent = '';
  document.getElementById('quizResult').classList.add('hidden');
  document.getElementById('quizProgress').style.width = '100%';

  const final = document.getElementById('quizFinal');
  final.classList.remove('hidden');
  
  const nextBtn = document.getElementById('quizNextBtn');
  const restartBtn = document.getElementById('quizRestart');
  const trophy = document.getElementById('quizTrophy');
  const scoreMsg = document.getElementById('quizScore');

  const allCorrect = quizScore === quizData.length;

  if (allCorrect) {
    scoreMsg.textContent = `Perfect Score: ${quizScore}/${quizData.length}! You know me so well! 💖`;
    trophy.textContent = '🏆';
    nextBtn.classList.remove('hidden');
    restartBtn.classList.add('hidden'); // Optional: hide replay if perfect score? Left as is but changed text if needed.

    // Huge celebration
    launchConfetti();
    setTimeout(launchConfetti, 800);
    setTimeout(launchConfetti, 1600);
  } else {
    scoreMsg.textContent = `You got ${quizScore}/${quizData.length}... Try again to get a perfect score! 😄`;
    trophy.textContent = '😅';
    nextBtn.classList.add('hidden');
    restartBtn.classList.remove('hidden');
  }
}

// ========================================================
// SECTION 9 – FINALE & FIREWORKS
// ========================================================
function initFinale() {
  launchFloatingHearts();
  initFireworks();
  launchConfetti();
}

function launchFloatingHearts() {
  const container = document.getElementById('floatingHeartsFinale');
  if (!container) return;
  container.innerHTML = '';
  const HEARTS = ['💖','💗','💝','💓','💞','✨','🌸','⭐','💫'];
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      const el = document.createElement('span');
      el.className = 'heart-float';
      el.textContent = HEARTS[randInt(0, HEARTS.length)];
      el.style.left = rand(0, 95) + '%';
      el.style.fontSize = rand(1.2, 2.8) + 'rem';
      const dur = rand(6, 14);
      el.style.animationDuration = dur + 's';
      el.style.animationDelay = rand(0, 3) + 's';
      container.appendChild(el);
    }, i * 300);
  }
  setInterval(() => {
    const el = document.createElement('span');
    el.className = 'heart-float';
    el.textContent = HEARTS[randInt(0, HEARTS.length)];
    el.style.left = rand(0, 95) + '%';
    el.style.fontSize = rand(1.2, 2.8) + 'rem';
    const dur = rand(6, 14);
    el.style.animationDuration = dur + 's';
    el.style.animationDelay = '0s';
    container.appendChild(el);
    setTimeout(() => el.remove(), dur * 1000);
  }, 700);
}

// ── Fireworks ──────────────────────────────────────────
function initFireworks() {
  const canvas = document.getElementById('fireworksCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  const fwParticles = [];
  const rockets = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Rocket {
    constructor() {
      this.x = rand(W * 0.2, W * 0.8);
      this.y = H;
      this.vx = rand(-1.5, 1.5);
      this.vy = rand(-14, -9);
      this.color = `hsl(${randInt(0,360)},100%,70%)`;
      this.exploded = false;
    }
    update() {
      this.vy += 0.22;
      this.x += this.vx; this.y += this.vy;
      if (this.vy >= 0 && !this.exploded) {
        this.exploded = true;
        explode(this.x, this.y, this.color);
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  class FwParticle {
    constructor(x, y, color) {
      this.x = x; this.y = y; this.color = color;
      const angle = rand(0, Math.PI * 2);
      const speed = rand(1.5, 7);
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.alpha = 1;
      this.r = rand(2, 4);
    }
    update() {
      this.vx *= 0.95; this.vy *= 0.95;
      this.vy += 0.15;
      this.x += this.vx; this.y += this.vy;
      this.alpha -= 0.018;
    }
    draw() {
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  function explode(x, y, baseColor) {
    const hue = randInt(0, 360);
    for (let i = 0; i < 80; i++) {
      fwParticles.push(new FwParticle(x, y, `hsl(${hue + randInt(-20, 20)},100%,70%)`));
    }
  }

  // Launch rockets periodically
  function launchRocket() {
    rockets.push(new Rocket());
    setTimeout(launchRocket, rand(600, 1600));
  }
  launchRocket();

  // Initial burst
  setTimeout(() => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => explode(rand(W * 0.2, W * 0.8), rand(H * 0.2, H * 0.6), ''), i * 300);
    }
  }, 400);

  function fwLoop() {
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(0, 0, W, H);

    for (let i = rockets.length - 1; i >= 0; i--) {
      rockets[i].update();
      rockets[i].draw();
      if (rockets[i].exploded) rockets.splice(i, 1);
    }
    for (let i = fwParticles.length - 1; i >= 0; i--) {
      fwParticles[i].update();
      fwParticles[i].draw();
      if (fwParticles[i].alpha <= 0) fwParticles.splice(i, 1);
    }
    requestAnimationFrame(fwLoop);
  }
  fwLoop();
}

// ========================================================
// MUSIC – Web Audio API (Happy Birthday melody, no file needed)
// ========================================================
let audioCtx = null;
let melodyNodes = [];
let melodyLoopTimer = null;

// Happy Birthday note frequencies (Hz)
const HB_NOTES = {
  G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25,
  F5: 698.46, G5: 783.99, REST: 0
};

// Happy Birthday melody: [note, duration in beats]
const HB_MELODY = [
  ['G4',0.75],['G4',0.25],['A4',1],['G4',1],['C5',1],['B4',2],
  ['G4',0.75],['G4',0.25],['A4',1],['G4',1],['D5',1],['C5',2],
  ['G4',0.75],['G4',0.25],['G5',1],['E5',1],['C5',1],['B4',1],['A4',2],
  ['F5',0.75],['F5',0.25],['E5',1],['C5',1],['D5',1],['C5',2],
  ['REST',1] // gap before loop
];

const BEAT_MS = 420; // ms per beat (tempo)

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playNote(freq, startTime, duration, ctx, vol) {
  if (freq === 0) return; // REST
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, startTime);

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(vol, startTime + 0.02);
  gain.gain.setValueAtTime(vol, startTime + duration - 0.05);
  gain.gain.linearRampToValueAtTime(0, startTime + duration);

  osc.start(startTime);
  osc.stop(startTime + duration);
  melodyNodes.push(osc);
}

function scheduleMelody() {
  const ctx = getAudioCtx();
  const vol = 0.22;
  let t = ctx.currentTime + 0.05;

  HB_MELODY.forEach(([note, beats]) => {
    const dur = (beats * BEAT_MS) / 1000;
    playNote(HB_NOTES[note], t, dur * 0.88, ctx, vol);
    t += dur;
  });

  // Loop: schedule next play slightly before this one ends
  const totalMs = HB_MELODY.reduce((s, [, b]) => s + b * BEAT_MS, 0);
  melodyLoopTimer = setTimeout(() => {
    if (musicPlaying) scheduleMelody();
  }, totalMs - 100);
}

function startMusic() {
  if (musicPlaying) return;
  const ctx = getAudioCtx();
  if (ctx.state === 'suspended') ctx.resume();
  musicPlaying = true;
  scheduleMelody();
  updateMusicBtn();
}

function stopMusic() {
  musicPlaying = false;
  clearTimeout(melodyLoopTimer);
  melodyNodes.forEach(n => { try { n.stop(); } catch(e){} });
  melodyNodes = [];
  updateMusicBtn();
}

function updateMusicBtn() {
  const btn = document.getElementById('musicBtn');
  if (btn) btn.textContent = musicPlaying ? '🔊' : '🎵';
}

function initMusicBtn() {
  const btn = document.getElementById('musicBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    if (musicPlaying) stopMusic();
    else startMusic();
  });
}

// ========================================================
// NAV DOTS
// ========================================================
function initNavDots() {
  document.querySelectorAll('.dot-btn').forEach(btn => {
    btn.addEventListener('click', () => showSection(btn.dataset.section));
  });
}

// ========================================================
// SHAKE CSS ANIMATION
// ========================================================
(function injectShakeStyle() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100%{ transform: translateX(0); }
      20%    { transform: translateX(-8px); }
      40%    { transform: translateX(8px); }
      60%    { transform: translateX(-5px); }
      80%    { transform: translateX(5px); }
    }
    .shake { animation: shake .45s ease both; }
  `;
  document.head.appendChild(style);
})();

// ========================================================
// BOOT
// ========================================================
document.addEventListener('DOMContentLoaded', () => {
  // Show landing
  showSection('landing');
  document.getElementById('dotNav').classList.add('hidden');
  document.getElementById('musicBtn').classList.add('hidden');

  // Init all non-section-specific things
  initBalloons();
  initEmojiRain();
  initLanding();
  initUnlock();
  initCake();
  initGallery();
  initVideo();
  initMessage();
  initNavDots();
  initMusicBtn();
});
