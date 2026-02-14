const storyEl = document.getElementById('story');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const closeLightbox = document.getElementById('closeLightbox');
const heartsEl = document.querySelector('.hearts');

const ASSET_BASE = 'https://cdn.jsdelivr.net/gh/johnmarkli/j-e-valentines-2026@assets/';
const USE_REMOTE_ASSETS = !['localhost', '127.0.0.1'].includes(window.location.hostname);

function assetUrl(path) {
  if (!path) return path;
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path;
  const normalized = path.replace(/^\.?\//, '');
  if (!USE_REMOTE_ASSETS) return normalized;
  return `${ASSET_BASE}${normalized}`;
}

function itemTimeValue(item) {
  if (!item.timestamp) return Number.MAX_SAFE_INTEGER;
  const parsed = Date.parse(item.timestamp.replace(' • ', ' '));
  return Number.isNaN(parsed) ? Number.MAX_SAFE_INTEGER : parsed;
}

function dateOnly(item) {
  return item.timestamp ? item.timestamp.split(' • ')[0] : '';
}

function cardImage(item) {
  const figure = document.createElement('figure');
  figure.className = 'card';

  const wrap = document.createElement('div');
  wrap.className = 'media-wrap';

  const img = document.createElement('img');
  img.className = `media ${item.orientation === 'portrait' ? 'portrait' : ''}`;
  img.loading = 'lazy';
  img.src = assetUrl(item.thumb || item.src);
  img.alt = item.title;

  img.addEventListener('click', () => {
    lightboxImg.src = assetUrl(item.src);
    lightboxImg.alt = item.title;
    const stamp = dateOnly(item);
    const bits = [item.title, item.note];
    if (stamp) bits.push(stamp);
    if (item.location) bits.push(item.location);
    lightboxCaption.textContent = bits.join(' — ');
    lightbox.showModal();
  });

  wrap.appendChild(img);

  const caption = document.createElement('figcaption');
  const stamp = dateOnly(item);
  caption.innerHTML = `
    <p class="caption-title">${item.title}</p>
    <p class="caption-note">${item.note}</p>
    ${stamp ? `<p class="caption-date">${stamp}</p>` : ''}
    ${item.location ? `<p class="caption-location">${item.location}</p>` : ''}
  `;

  figure.append(wrap, caption);
  return figure;
}

function render(chapters) {
  storyEl.innerHTML = '';

  chapters.forEach((chapter) => {
    const section = document.createElement('section');
    section.className = 'chapter';
    section.id = chapter.id;

    const header = document.createElement('div');
    header.className = 'chapter-header';
    header.innerHTML = `
      <p class="chapter-kicker">${chapter.kicker}</p>
      <h2>${chapter.title}</h2>
      <p>${chapter.description}</p>
    `;

    const grid = document.createElement('div');
    grid.className = 'grid';

    const items = [...chapter.items].sort((a, b) => itemTimeValue(a) - itemTimeValue(b));
    items.forEach((item) => {
      grid.appendChild(cardImage(item));
    });

    section.append(header, grid);
    storyEl.appendChild(section);
  });
}

function burstHearts(count = 15) {
  const symbols = ['❤', '💖', '💕', '💘'];
  for (let i = 0; i < count; i++) {
    const span = document.createElement('span');
    span.className = 'heart';
    span.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    span.style.left = `${Math.random() * 100}%`;
    span.style.bottom = `${Math.random() * 35}px`;
    span.style.animationDelay = `${Math.random() * 0.3}s`;
    heartsEl.appendChild(span);
    setTimeout(() => span.remove(), 3000);
  }
}

async function init() {
  const res = await fetch('./data/photos.json');
  const data = await res.json();
  render(data.chapters);

  document.addEventListener('click', () => {
    burstHearts(6);
  });
}

closeLightbox.addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', (e) => {
  const rect = lightbox.getBoundingClientRect();
  const inDialog =
    rect.top <= e.clientY &&
    e.clientY <= rect.top + rect.height &&
    rect.left <= e.clientX &&
    e.clientX <= rect.left + rect.width;
  if (!inDialog) lightbox.close();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.open) lightbox.close();
});

init();
