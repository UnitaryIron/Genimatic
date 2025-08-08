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
  
  // Simulate API call with timeout (in a real app, you would call your AI API here)
  setTimeout(() => {
    // This is just a simulation - in reality you'd get the image URL from your AI service
    // Use Pollinations API
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
  outputPlaceholder.innerHTML = '<p>⚠️ Failed to generate image. Try again.</p>';
};

    
    // Save to history
    addToHistory(prompt, mockImageUrl);
  }, 2000);
}

function addToHistory(prompt, imageUrl) {
  let history = JSON.parse(localStorage.getItem('snappromptHistory')) || [];
  history.unshift({ prompt, imageUrl, date: new Date().toISOString() });
  if (history.length > 20) history = history.slice(0, 20);
  localStorage.setItem('snappromptHistory', JSON.stringify(history));
  loadHistory();
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem('snappromptHistory')) || [];
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
    localStorage.removeItem('snappromptHistory');
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
  link.download = `snapprompt-${Date.now()}.jpg`;
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

function upscaleImage() {
  alert('Upscaling feature would call your AI upscaling API in a real implementation');
}