// genimatic.js - single-file cleaned, fixed, full-featured

document.addEventListener('DOMContentLoaded', () => {
  // Safe DOM elements (use optional chaining to avoid crashes if HTML is missing)
  const themeToggle = document.getElementById('themeToggle');
  const steps = document.getElementById('steps');
  const guidance = document.getElementById('guidance');
  const modelSelect = document.getElementById('modelSelect');

  // Theme toggle
  if (themeToggle) themeToggle.addEventListener('click', toggleDarkMode);

  // Sliders
  if (steps) {
    steps.addEventListener('input', function () {
      const el = document.getElementById('stepsValue');
      if (el) el.textContent = this.value;
    });
    // initialize display
    const sv = document.getElementById('stepsValue');
    if (sv) sv.textContent = steps.value;
  }
  if (guidance) {
    guidance.addEventListener('input', function () {
      const el = document.getElementById('guidanceValue');
      if (el) el.textContent = this.value;
    });
    const gv = document.getElementById('guidanceValue');
    if (gv) gv.textContent = guidance.value;
  }

  // Model selector: store a selected style separately; do NOT mutate prompt input
  if (modelSelect) {
    // ensure dataset holds selectedStyle and select value matches it
    modelSelect.dataset.selectedStyle = modelSelect.value || '';
    modelSelect.addEventListener('change', function () {
      this.dataset.selectedStyle = this.value;
    });
  }

  // Wire up buttons that might exist (safe checks)
  const genBtn = document.getElementById('generateBtn');
  if (genBtn) genBtn.addEventListener('click', generateImage);

  const clearHistBtn = document.getElementById('clearHistoryBtn');
  if (clearHistBtn) clearHistBtn.addEventListener('click', clearHistory);

  const clearGalleryBtn = document.getElementById('clearGalleryBtn');
  if (clearGalleryBtn) clearGalleryBtn.addEventListener('click', clearGallery);

  const downloadBtn = document.getElementById('downloadBtn');
  if (downloadBtn) downloadBtn.addEventListener('click', downloadImage);

  const copyUrlBtn = document.getElementById('copyUrlBtn');
  if (copyUrlBtn) copyUrlBtn.addEventListener('click', copyImageURL);

  const remixBtn = document.getElementById('remixBtn');
  if (remixBtn) remixBtn.addEventListener('click', remixImage);

  const upscaleBtn = document.getElementById('upscaleBtn');
  if (upscaleBtn) upscaleBtn.addEventListener('click', upscaleImage);

  // Initial load
  loadHistory();
  loadGallery();
});

/* -------------------------
   Theme
   ------------------------- */
function toggleDarkMode() {
  document.body.classList.toggle('light-mode');
  const icon = document.querySelector('#themeToggle i');
  if (!icon) return;
  if (document.body.classList.contains('light-mode')) {
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
  } else {
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
  }
}

/* -------------------------
   Generate image
   ------------------------- */
function generateImage() {
  const promptInput = document.getElementById('promptInput');
  if (!promptInput) return alert('Prompt input missing in DOM.');

  const basePrompt = promptInput.value.trim();
  if (!basePrompt) {
    alert('Please enter a prompt');
    return;
  }

  // Get selected style from model select dataset (do NOT modify promptInput.value)
  const modelSelect = document.getElementById('modelSelect');
  const selectedStyle = modelSelect ? (modelSelect.dataset.selectedStyle || modelSelect.value || '') : '';

  // Build appended style text (used only for generation & history entry)
  const styleText = getStyleText(selectedStyle);
  const fullPrompt = (basePrompt + (styleText ? ' ' + styleText : '')).trim();

  // UI: show loading
  const outputPlaceholder = document.getElementById('outputPlaceholder');
  if (outputPlaceholder) {
    outputPlaceholder.innerHTML = '<i class="fas fa-spinner fa-spin"></i><p>Generating your image...</p>';
    outputPlaceholder.style.display = 'flex';
  }
  const imageContainer = document.getElementById('imageContainer');
  if (imageContainer) imageContainer.innerHTML = '';
  const outputActions = document.getElementById('outputActions');
  if (outputActions) outputActions.style.display = 'none';

  // Simulate generation / call API - keep your 2s timeout to show spinner
  setTimeout(() => {
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}`;

    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      if (outputPlaceholder) outputPlaceholder.style.display = 'none';
      if (imageContainer) imageContainer.innerHTML = `<img src="${imageUrl}" alt="${escapeHtml(fullPrompt)}">`;
      if (outputActions) outputActions.style.display = 'flex';

      // Add to history/galleries once
      addToHistory(fullPrompt, imageUrl);
    };
    img.onerror = () => {
      if (outputPlaceholder) outputPlaceholder.innerHTML = '<p>Failed to generate image. Try again.</p>';
      if (outputActions) outputActions.style.display = 'none';
    };
  }, 2000);
}

function getStyleText(styleKey) {
  switch ((styleKey || '').toLowerCase()) {
    case 'realistic': return 'realistic style';
    case 'anime': return 'anime style';
    case 'fantasy': return 'fantasy art style';
    case 'concept': return 'concept art style';
    default: return '';
  }
}

/* -------------------------
   History & Gallery storage helpers
   ------------------------- */
function addToHistory(prompt, imageUrl) {
  const now = new Date().toISOString();
  const id = Date.now().toString();
  const newItem = { prompt, imageUrl, date: now, id };

  const history = JSON.parse(localStorage.getItem('genimaticHistory')) || [];
  const gallery = JSON.parse(localStorage.getItem('genimaticGallery')) || [];

  history.unshift(newItem);
  gallery.unshift(newItem);

  // limits
  if (history.length > 20) history.length = 20;
  if (gallery.length > 100) gallery.length = 100;

  localStorage.setItem('genimaticHistory', JSON.stringify(history));
  localStorage.setItem('genimaticGallery', JSON.stringify(gallery));

  // update UI
  loadHistory();
  loadGallery();
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem('genimaticHistory')) || [];
  const historyList = document.getElementById('historyList');
  if (!historyList) return;

  historyList.innerHTML = '';

  if (history.length === 0) {
    const li = document.createElement('li');
    li.className = 'empty-history';
    li.textContent = 'No history yet. Generate an image to populate history.';
    historyList.appendChild(li);
    return;
  }

  history.forEach(item => {
    const li = document.createElement('li');
    li.className = 'history-item';
    li.textContent = item.prompt.length > 60 ? item.prompt.slice(0, 60) + '…' : item.prompt;
    li.title = item.prompt;
    li.dataset.id = item.id;

    li.addEventListener('click', () => {
      // When user clicks a history item: restore base prompt (without style) and restore modelSelect
      const base = stripStyleFromPrompt(item.prompt);
      const styleKey = detectStyleFromPrompt(item.prompt);

      const promptInput = document.getElementById('promptInput');
      if (promptInput) promptInput.value = base;

      const modelSelect = document.getElementById('modelSelect');
      if (modelSelect) {
        modelSelect.dataset.selectedStyle = styleKey;
        // also set the select visual value if it exists
        if ([...modelSelect.options].some(o => o.value === styleKey)) {
          modelSelect.value = styleKey;
        } else {
          // if styleKey is empty, set to default (first option)
          if (!styleKey && modelSelect.options.length) modelSelect.value = modelSelect.options[0].value;
        }
      }

      // scroll to generator (if exists)
      const genSection = document.querySelector('.generator-section');
      if (genSection) genSection.scrollIntoView({ behavior: 'smooth' });
    });

    historyList.appendChild(li);
  });
}

function loadGallery() {
  const gallery = JSON.parse(localStorage.getItem('genimaticGallery')) || [];
  const galleryContainer = document.getElementById('galleryContainer');
  if (!galleryContainer) return;

  galleryContainer.innerHTML = '';

  if (gallery.length === 0) {
    galleryContainer.innerHTML = `
      <div class="empty-gallery">
        <i class="fas fa-image"></i>
        <p>Your generated images will appear here</p>
      </div>
    `;
    return;
  }

  gallery.forEach(item => {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.innerHTML = `
      <img src="${item.imageUrl}" alt="${escapeHtml(item.prompt)}">
      <div class="gallery-item-actions">
        <button class="gallery-item-btn" data-id="${item.id}" onclick="downloadGalleryImage('${item.id}')">
          <i class="fas fa-download"></i>
        </button>
        <button class="gallery-item-btn" data-id="${item.id}" onclick="copyGalleryImageUrl('${item.id}')">
          <i class="fas fa-copy"></i>
        </button>
        <button class="gallery-item-btn" data-id="${item.id}" onclick="remixFromGallery('${item.id}')">
          <i class="fas fa-random"></i>
        </button>
      </div>
    `;
    galleryContainer.appendChild(galleryItem);
  });
}

/* -------------------------
   History & Gallery actions
   ------------------------- */
function clearHistory() {
  if (!confirm('Are you sure you want to clear your prompt history?')) return;
  localStorage.removeItem('genimaticHistory');
  loadHistory();
}

function clearGallery() {
  if (!confirm('Are you sure you want to clear your entire gallery? This cannot be undone.')) return;
  localStorage.removeItem('genimaticGallery');
  loadGallery();
}

function downloadGalleryImage(id) {
  const gallery = JSON.parse(localStorage.getItem('genimaticGallery')) || [];
  const item = gallery.find(x => x.id === id);
  if (!item) return alert('Image not found');

  const a = document.createElement('a');
  a.href = item.imageUrl;
  a.download = `genimatic-${id}.jpg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function copyGalleryImageUrl(id) {
  const gallery = JSON.parse(localStorage.getItem('genimaticGallery')) || [];
  const item = gallery.find(x => x.id === id);
  if (!item) return alert('Image not found');

  navigator.clipboard.writeText(item.imageUrl).then(() => alert('Image URL copied to clipboard!'))
    .catch(err => console.error('Failed to copy: ', err));
}

function remixFromGallery(id) {
  const gallery = JSON.parse(localStorage.getItem('genimaticGallery')) || [];
  const item = gallery.find(x => x.id === id);
  if (!item) return alert('Image not found');

  // Restore prompt and model, then generate
  const base = stripStyleFromPrompt(item.prompt);
  const styleKey = detectStyleFromPrompt(item.prompt);

  const promptInput = document.getElementById('promptInput');
  if (promptInput) promptInput.value = base;

  const modelSelect = document.getElementById('modelSelect');
  if (modelSelect) {
    modelSelect.dataset.selectedStyle = styleKey;
    if ([...modelSelect.options].some(o => o.value === styleKey)) {
      modelSelect.value = styleKey;
    }
  }

  // Call generate - which will append styleText internally
  generateImage();
}

/* -------------------------
   Output actions (single image shown)
   ------------------------- */
function downloadImage() {
  const img = document.querySelector('#imageContainer img');
  if (!img) return alert('No image to download');
  const a = document.createElement('a');
  a.href = img.src;
  a.download = `genimatic-${Date.now()}.jpg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function copyImageURL() {
  const img = document.querySelector('#imageContainer img');
  if (!img) return alert('No image URL to copy');
  navigator.clipboard.writeText(img.src).then(() => alert('Image URL copied to clipboard!'))
    .catch(err => console.error('Failed to copy: ', err));
}

function remixImage() {
  const img = document.querySelector('#imageContainer img');
  if (!img) return alert('No image to remix');
  const promptInput = document.getElementById('promptInput');
  if (!promptInput) return;
  // Append "with variations" but don't duplicate if already present
  if (!/with variations$/i.test(promptInput.value.trim())) {
    promptInput.value = promptInput.value.trim() + ' with variations';
  }
  generateImage();
}

/* -------------------------
   Upscale (keeps original behavior)
   ------------------------- */
async function upscaleImage() {
  const img = document.querySelector('#imageContainer img');
  if (!img) return alert('No image to upscale');

  const outputPlaceholder = document.getElementById('outputPlaceholder');
  if (outputPlaceholder) {
    outputPlaceholder.innerHTML = '<i class="fas fa-spinner fa-spin"></i><p>Upscaling your image (2x)...</p>';
    outputPlaceholder.style.display = 'flex';
  }
  const outputActions = document.getElementById('outputActions');
  if (outputActions) outputActions.style.display = 'none';

  try {
    // Fetch image as blob and send to upscale API
    const resp = await fetch(img.src);
    if (!resp.ok) throw new Error('Failed to fetch image for upscaling');
    const blob = await resp.blob();

    // NOTE: keep the same endpoint you were using; ensure CORS/endpoint access in production
    const apiUrl = 'https://api.realesrgan.ai/upscale';
    const formData = new FormData();
    formData.append('image', blob);
    formData.append('scale', '2');

    const upscaleResp = await fetch(apiUrl, { method: 'POST', body: formData });
    if (!upscaleResp.ok) {
      const text = await upscaleResp.text().catch(() => '');
      throw new Error(`Upscale API failed: ${upscaleResp.status} ${text}`);
    }

    const upBlob = await upscaleResp.blob();
    const upUrl = URL.createObjectURL(upBlob);

    const imageContainer = document.getElementById('imageContainer');
    if (imageContainer) imageContainer.innerHTML = `<img src="${upUrl}" alt="Upscaled image">`;

    // Save upscaled into history/gallery using current prompt value
    const promptInput = document.getElementById('promptInput');
    const promptText = promptInput ? promptInput.value.trim() : 'upscaled image';
    addToHistory(promptText + ' (upscaled)', upUrl);

  } catch (err) {
    console.error('Upscaling error:', err);
    if (outputPlaceholder) outputPlaceholder.innerHTML = `<p>Upscaling failed: ${escapeHtml(err.message)}</p>`;
  } finally {
    if (outputPlaceholder) outputPlaceholder.style.display = 'none';
    if (outputActions) outputActions.style.display = 'flex';
  }
}

/* -------------------------
   Utility helpers
   ------------------------- */
function detectStyleFromPrompt(prompt) {
  if (/realistic style$/i.test(prompt) || / realistic style\b/i.test(prompt)) return 'realistic';
  if (/anime style$/i.test(prompt) || / anime style\b/i.test(prompt)) return 'anime';
  if (/fantasy art style$/i.test(prompt) || / fantasy art style\b/i.test(prompt)) return 'fantasy';
  if (/concept art style$/i.test(prompt) || / concept art style\b/i.test(prompt)) return 'concept';
  return '';
}

function stripStyleFromPrompt(prompt) {
  // remove trailing known style phrases
  return prompt.replace(/\s+(realistic style|anime style|fantasy art style|concept art style)\s*$/i, '').trim();
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"'`=\/]/g, function (s) {
    return ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '`': '&#96;', '/': '&#47;', '=': '&#61;'
    })[s];
  });
}

// List of 25 detailed prompts for the random prompt feature
const samplePrompts = [
  "A photorealistic portrait of a cyberpunk samurai in neon-lit Tokyo streets, ultra-detailed, 8k resolution",
  "An enchanted forest with glowing mushrooms and fairies, misty atmosphere, cinematic lighting",
  "Steampunk airship battle above a Victorian city, dramatic clouds, ultra-realistic textures",
  "A futuristic cityscape on Mars at sunset, glass domes, crimson sky, high detail",
  "A cozy cabin in the snowy mountains, smoke coming from chimney, warm lights inside",
  "An underwater palace made of coral and pearls, mermaids swimming, fantasy style",
  "A hyper-realistic close-up of a wolf with glowing blue eyes, frost on fur",
  "Ancient library hidden inside a mountain, lit by magical floating candles",
  "An astronaut discovering a hidden alien temple on an icy exoplanet, cinematic view",
  "A giant tree whose branches hold entire villages, magical realism style",
  "A medieval marketplace bustling with merchants and colorful fabrics, 4k detail",
  "Post-apocalyptic desert with ruined skyscrapers and lone wanderer, dust storm approaching",
  "A close-up of a dragon's eye reflecting a burning castle, ultra-realistic textures",
  "Futuristic cybernetic horse galloping through a rain-soaked alley, neon reflections",
  "A magical tea party floating in the clouds, pastel colors, whimsical style",
  "A Viking ship sailing through glowing northern lights, stormy seas",
  "Crystal caves with glowing gemstones, explorers with lanterns, high contrast lighting",
  "A robot gardener tending to giant alien flowers, vibrant colors, ultra detail",
  "A fantasy map of a floating continent with waterfalls cascading into the sky",
  "A bustling alien marketplace on a ringworld space station, exotic creatures",
  "An ancient temple deep in the jungle, reclaimed by nature, photorealistic style",
  "A portal opening in the middle of Times Square, swirling magic energy",
  "A futuristic samurai duel on top of a skyscraper at night, cinematic angle",
  "A small dragon curled up sleeping in a teacup, cozy and cute style",
  "An epic battle between giant mechs in a ruined city, smoke and explosions"
];

// Function to set a random prompt
function randomPrompt() {
  const randomIndex = Math.floor(Math.random() * samplePrompts.length);
  document.getElementById('promptInput').value = samplePrompts[randomIndex];
}
