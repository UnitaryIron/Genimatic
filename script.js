// Initialize with dark mode by default
document.addEventListener('DOMContentLoaded', function() {
  // Theme toggle functionality
  const themeToggle = document.getElementById('themeToggle');
  themeToggle.addEventListener('click', toggleDarkMode);
  
  // Update slider values
  document.getElementById('steps').addEventListener('input', function() {
    document.getElementById('stepsValue').textContent = this.value;
  });
  
  document.getElementById('guidance').addEventListener('input', function() {
    document.getElementById('guidanceValue').textContent = this.value;
  });
  
  // Load history from localStorage
  loadHistory();
});

function toggleDarkMode() {
  document.body.classList.toggle('light-mode');
  const icon = document.querySelector('#themeToggle i');
  if (document.body.classList.contains('light-mode')) {
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
  } else {
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
  }
}

function generateImage() {
  const prompt = document.getElementById('promptInput').value.trim();
  if (!prompt) {
    alert('Please enter a prompt');
    return;
  }
  
  // Show loading state
  const outputPlaceholder = document.getElementById('outputPlaceholder');
  outputPlaceholder.innerHTML = '<i class="fas fa-spinner fa-spin"></i><p>Generating your image...</p>';
  outputPlaceholder.style.display = 'flex';
  document.getElementById('imageContainer').innerHTML = '';
  document.getElementById('outputActions').style.display = 'none';
  
  setTimeout(() => {
const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

const img = new Image();
img.src = imageUrl;
img.onload = () => {
  outputPlaceholder.style.display = 'none';
  const imageContainer = document.getElementById('imageContainer');
  imageContainer.innerHTML = `<img src="${imageUrl}" alt="Generated image from prompt: ${prompt}">`;
  document.getElementById('outputActions').style.display = 'flex';

  addToHistory(prompt, imageUrl);
};

img.onerror = () => {
  outputPlaceholder.innerHTML = '<p>Failed to generate image. Try again.</p>';
};

    
    // Save to history
    addToHistory(prompt, imageUrl);
  }, 2000);
}

function addToHistory(prompt, imageUrl) {
  let history = JSON.parse(localStorage.getItem('genimaticHistory')) || [];
  history.unshift({ prompt, imageUrl, date: new Date().toISOString() });
  if (history.length > 20) history = history.slice(0, 20);
  localStorage.setItem('snappromptHistory', JSON.stringify(history));
  loadHistory();
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem('genimaticHistory')) || [];
  const historyList = document.getElementById('historyList');
  historyList.innerHTML = '';
  
  history.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item.prompt;
    li.addEventListener('click', () => {
      document.getElementById('promptInput').value = item.prompt;
    });
    historyList.appendChild(li);
  });
}

function clearHistory() {
  if (confirm('Are you sure you want to clear your prompt history?')) {
    localStorage.removeItem('genimaticHistory');
    loadHistory();
  }
}

function downloadImage() {
  const img = document.querySelector('#imageContainer img');
  if (!img) {
    alert('No image to download');
    return;
  }
  
  // Create a temporary link
  const link = document.createElement('a');
  link.href = img.src;
  link.download = `genimatic-${Date.now()}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function copyImageURL() {
  const img = document.querySelector('#imageContainer img');
  if (!img) {
    alert('No image URL to copy');
    return;
  }
  
  navigator.clipboard.writeText(img.src)
    .then(() => alert('Image URL copied to clipboard!'))
    .catch(err => console.error('Failed to copy: ', err));
}

function remixImage() {
  const img = document.querySelector('#imageContainer img');
  if (img) {
    document.getElementById('promptInput').value += " with variations";
    generateImage();
  }
}

async function upscaleImage() {
  const img = document.querySelector('#imageContainer img');
  if (!img) {
    alert('No image to upscale');
    return;
  }

  // Show loading state
  const outputPlaceholder = document.getElementById('outputPlaceholder');
  outputPlaceholder.innerHTML = '<i class="fas fa-spinner fa-spin"></i><p>Upscaling your image (2x)...</p>';
  outputPlaceholder.style.display = 'flex';
  document.getElementById('outputActions').style.display = 'none';

  try {
    // Convert image to blob for upload
    const response = await fetch(img.src);
    const blob = await response.blob();

    const apiUrl = 'https://api.realesrgan.ai/upscale';
    const formData = new FormData();
    formData.append('image', blob);
    formData.append('scale', '2'); // 2x upscaling

    const upscaleResponse = await fetch(apiUrl, {
      method: 'POST',
      body: formData
    });

    if (!upscaleResponse.ok) throw new Error('Upscaling failed');

    const upscaledBlob = await upscaleResponse.blob();
    const upscaledUrl = URL.createObjectURL(upscaledBlob);

    // Display the upscaled image
    document.getElementById('imageContainer').innerHTML = 
      `<img src="${upscaledUrl}" alt="Upscaled image">`;
    
    // Update history
    const prompt = document.getElementById('promptInput').value.trim();
    addToHistory(prompt + " (upscaled)", upscaledUrl);

  } catch (error) {
    console.error('Upscaling error:', error);
    outputPlaceholder.innerHTML = `<p>Upscaling failed: ${error.message}</p>`;
    return;
  } finally {
    outputPlaceholder.style.display = 'none';
    document.getElementById('outputActions').style.display = 'flex';
  }
}
