# Genimatic

Genimatic is a lightweight, mobile-first web application for generating AI-powered images from text prompts.  
It is powered by the [Pollinations API](https://image.pollinations.ai/), offering high-quality results in a variety of visual styles with zero backend infrastructure.  
The application runs entirely in the browser using HTML, CSS, and JavaScript, ensuring fast load times and compatibility across devices.

---

## Preview

[**Live Demo →**](https://genimatic.vercel.app/)

---

## Features

- **AI Image Generation** — Create unique, high-quality images from natural language prompts.
- **Multiple Styles** — Choose from realistic, anime, fantasy, and conceptual art styles.
- **Random Prompt Generator** — Instantly get creative ideas without thinking of prompts yourself.
- **Gallery & History** — Save up to 100 generated images locally using `localStorage`.
- **Image Tools** — Download, copy link, remix existing prompts, and upscale images.
- **Fully Mobile-Optimized** — Smooth experience on any screen size.
- **Offline-Ready Structure** — Works with no backend or server logic.

---

## How It Works

Genimatic interacts directly with the **Pollinations API** using `fetch()` requests.  
When a user enters a prompt and selects a style:

1. The app sends a request to:
   https://image.pollinations.ai/prompt/{encodedPrompt}
   with optional style parameters appended to the prompt.

2. The API processes the request and returns a generated image.

3. The image is displayed in the UI, added to the local gallery, and made available for download or sharing.

The app leverages:
- **`localStorage`** for persisting images and prompt history.
- **CSS Grid/Flexbox** for responsive layout.
- **Vanilla JavaScript** for event handling, API calls, and DOM manipulation.

---

## Project Structure

/
├── index.html # Main application interface
├── style.css # Styling for all components
├── script.js # Core app logic and API integration
├── assets/ # Static resources (icons, preview images)
└── README.md # Project documentation

---

## Usage Guide

1. **Enter a Prompt**  
   Type a descriptive phrase into the input box.  
   Example:
   a futuristic city skyline at sunset, ultra realistic

2. **Select a Style**  
Choose your preferred style from the style selector (e.g., Realistic, Anime, Fantasy).

3. **Generate**  
Click the **Generate** button. The AI will create and display your image in seconds.

4. **Interact with the Image**  
- **Download** the image in `.png` format.
- **Copy Link** to share directly.
- **Remix** to re-generate with modifications.
- **Upscale** for higher resolution (if supported).

5. **Gallery**  
Access previously generated images via the gallery tab. Images are stored locally and persist between sessions.

---

## API Reference

**Base URL:**  
https://image.pollinations.ai/prompt/{prompt}


**Parameters:**
| Parameter  | Type   | Description                                      |
|------------|--------|--------------------------------------------------|
| `prompt`   | string | Description of the image to generate.            |
| `style`    | string | Optional — Art style to apply (e.g., `anime`).   |
| `width`    | int    | Optional — Image width in pixels.                |
| `height`   | int    | Optional — Image height in pixels.               |

**Example Request:**
https://image.pollinations.ai/prompt/a%20serene%20forest%20waterfall,%20anime

---

## 📐Design & UI

- **Responsive Layout:** Built with CSS Grid and Flexbox to adapt to mobile and desktop.
- **Mobile-First Approach:** Optimized for touch controls, small screen navigation, and fast load.
- **Minimalistic Theme:** Clean typography and minimal distractions to focus on generated content.
- **Iconography:** Uses vector-based icons for crisp scaling.

---

## 💻 Technologies Used

- **HTML5** — Markup for UI structure.
- **CSS3** — Styling, animations, and responsiveness.
- **JavaScript (Vanilla)** — Core logic and API integration.
- **Pollinations API** — AI image generation.
- **LocalStorage** — Persistent gallery and history storage.

---

## 🚀 Performance Notes

- All assets are optimized for fast loading.
- No backend dependencies — runs entirely client-side.
- API requests are asynchronous for smooth UI updates.
- Mobile optimizations ensure sub-2 second load time on most connections.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 👤 Author

Developed by **[Your Name]** — Passionate about building AI-powered tools and creative applications.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Genimatic-brightgreen)](https://genimatic.vercel.app/)


