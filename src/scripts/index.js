// src/scripts/index.js
import 'regenerator-runtime';
import '../styles/styles.css';

import App from '../scripts/pages/app';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });

  // --- Tambahkan JavaScript untuk Skip to Content di sini ---
  const mainContent = document.querySelector("#main-content");
  const skipLink = document.querySelector(".skip-link");

  skipLink.addEventListener("click", function (event) {
    event.preventDefault(); // Mencegah refresh halaman
    skipLink.blur(); // Menghilangkan fokus skip to content
    mainContent.focus(); // Fokus ke konten utama
    mainContent.scrollIntoView({ behavior: 'smooth' }); // Halaman scroll ke konten utama (opsional: smooth scroll)
  });
  // --- Akhir Tambahan JavaScript Skip to Content ---

  if ('serviceWorker' in navigator) {
    try {
        await navigator.serviceWorker.register('./sw.js'); // Sesuaikan path jika sw.js berada di root
        console.log('Service Worker registered successfully');
    } catch (error) {
        console.error('Failed to register Service Worker', error);
    }
  }

  await app.renderPage();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });

  window.addEventListener('load', async () => {
    await app.renderPage();
  });
});