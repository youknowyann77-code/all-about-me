/* =============================================
   ALL ABOUT ME — script.js
   ============================================= */

// ---- CUSTOM CURSOR ----
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  cursorTrail.style.left = e.clientX + 'px';
  cursorTrail.style.top = e.clientY + 'px';
});

const hoverables = document.querySelectorAll('button, a, .tag, .anime-card, .music-card, .hobby-card, .food-card, .birthday-card');
hoverables.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(2)';
    cursorTrail.style.transform = 'translate(-50%, -50%) scale(0.5)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    cursorTrail.style.transform = 'translate(-50%, -50%) scale(1)';
  });
});

// ---- SCROLL REVEAL ----
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealEls.forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 0.12 + 's';
  observer.observe(el);
});

// ---- FOTO PROFIL ----
// Cara pakai: ganti nilai di bawah dengan URL foto online ATAU nama file lokal
// Contoh URL online : "https://i.imgur.com/xxxxx.jpg"
// Contoh file lokal : "foto-aku.jpg"  (letakkan file di folder yang sama)
const PROFILE_PHOTO_SRC = "profil.jpg"; // ← isi di sini

const profileImg = document.getElementById('profileImg');
const profilePlaceholder = document.getElementById('profilePlaceholder');

if (PROFILE_PHOTO_SRC.trim() !== '') {
  profileImg.src = PROFILE_PHOTO_SRC;
  profileImg.style.display = 'block';
  profilePlaceholder.style.display = 'none';
}

// ---- FOTO ANIME ----
// Cara pakai: ganti nilai di bawah dengan URL foto online ATAU nama file lokal
// Contoh URL online : "https://i.imgur.com/xxxxx.jpg"
// Contoh file lokal : "onepiece-cover.jpg" (letakkan file di folder yang sama)
const ANIME_COVER_SRC = "onepiece.jpg"; // ← isi di sini

const animeImg = document.getElementById('animeImg');
const animePlaceholder = document.getElementById('animePlaceholder');

if (ANIME_COVER_SRC.trim() !== '') {
  animeImg.src = ANIME_COVER_SRC;
  animeImg.style.display = 'block';
  animePlaceholder.style.display = 'none';
}

// ---- BIRTHDAY / AGE CALCULATOR ----
// Ganti tanggal lahir di bawah (format: YYYY, MM-1, DD)
// Bulan dimulai dari 0: Januari=0, Februari=1, ... Desember=11
const BIRTH_DATE = new Date(2000, 0, 1); // ← contoh: 1 Januari 2000

function calculateAge(birthDate) {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

const ageDisplay = document.getElementById('ageDisplay');
if (ageDisplay) {
  ageDisplay.textContent = calculateAge(BIRTH_DATE);
}

// ---- AUDIO PLAYER ----
const PLAY_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0A0908" width="16" height="16"><path d="M8 5v14l11-7z"/></svg>`;
const PAUSE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0A0908" width="16" height="16"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;

const audios = {
  1: document.getElementById('audio1'),
  2: document.getElementById('audio2'),
};

function formatTime(sec) {
  if (isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function togglePlay(num) {
  const audio = audios[num];
  const btn = document.getElementById('playBtn' + num);
  const vinyl = document.getElementById('vinyl' + num);
  const other = num === 1 ? 2 : 1;

  // Pause the other track if playing
  if (!audios[other].paused) {
    audios[other].pause();
    document.getElementById('playBtn' + other).innerHTML = PLAY_ICON;
    document.getElementById('vinyl' + other).classList.remove('spinning');
  }

  if (audio.paused) {
    audio.play().catch(() => {
      console.warn('Audio file not found. Place the .mp3 file in the same folder.');
    });
    btn.innerHTML = PAUSE_ICON;
    vinyl.classList.add('spinning');
  } else {
    audio.pause();
    btn.innerHTML = PLAY_ICON;
    vinyl.classList.remove('spinning');
  }
}

// Update progress bars & duration displays
[1, 2].forEach(num => {
  const audio = audios[num];
  const bar = document.getElementById('bar' + num);
  const dur = document.getElementById('dur' + num);

  audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
      const pct = (audio.currentTime / audio.duration) * 100;
      bar.style.width = pct + '%';
      dur.textContent = formatTime(audio.currentTime);
    }
  });

  audio.addEventListener('ended', () => {
    document.getElementById('playBtn' + num).innerHTML = PLAY_ICON;
    document.getElementById('vinyl' + num).classList.remove('spinning');
    bar.style.width = '0%';
    dur.textContent = '0:00';
  });

  // Click on progress bar to seek
  document.getElementById('bar' + num).closest('.music-bar').addEventListener('click', (e) => {
    if (!audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * audio.duration;
  });
});

// ---- PARALLAX STARS (hero) ----
const bgStars = document.querySelectorAll('.hero-bg-star');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  bgStars.forEach((star, i) => {
    const speed = 0.08 + i * 0.04;
    star.style.transform = `translateY(${scrollY * speed}px) rotate(${scrollY * 0.02}deg)`;
  });
});

// ---- INIT hero reveals ----
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelectorAll('.hero .reveal').forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('visible');
      }, i * 100);
    });
  }, 300);
});
