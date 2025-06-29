// src/scripts/app.js
import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import { subscribePushNotification, unsubscribePushNotification } from '../utils/notification-helper'; // Import fungsi helper

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;
  #currentPageInstance = null; // Tambahkan properti untuk menyimpan instance halaman saat ini
  #subscribeButton = null;
  #unsubscribeButton = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;
    // Dapatkan referensi tombol notifikasi
    this.#subscribeButton = document.getElementById('subscribeNotificationButton');
    this.#unsubscribeButton = document.getElementById('unsubscribeNotificationButton');

    this._setupDrawer();
    this._setupNotificationButtons(); // Panggil fungsi setup baru
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
      if (this.#navigationDrawer.classList.contains('open')) {
        this.#navigationDrawer.focus();
      }
    });

    document.body.addEventListener('click', (event) => {
      if (!this.#navigationDrawer.contains(event.target) && !this.#drawerButton.contains(event.target)) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.#navigationDrawer.classList.contains('open')) {
        this.#navigationDrawer.classList.remove('open');
        this.#drawerButton.focus();
      }
    });
  }

  _setupNotificationButtons() {
    if (this.#subscribeButton && this.#unsubscribeButton) {
        this.#subscribeButton.addEventListener('click', subscribePushNotification); // Hubungkan ke fungsi berlangganan
        this.#unsubscribeButton.addEventListener('click', unsubscribePushNotification); // Hubungkan ke fungsi berhenti
        // Anda juga bisa menambahkan logika untuk menampilkan/menyembunyikan tombol berdasarkan status langganan
        // ini.#checkSubscriptionStatusAndToggleButtons();
    }
  }

  async renderPage() {
    const url = getActiveRoute();
    const PageClass = routes[url];

    let newPageInstance;
    if (PageClass) {
        newPageInstance = new PageClass();
    } else {
        // Fallback untuk halaman 404 (pastikan punya metode render dan afterRender minimal)
        newPageInstance = {
            render: async () => '<h2>404 - Halaman Tidak Ditemukan</h2>',
            afterRender: async () => {},
            // Tambahkan metode no-op (tidak melakukan apa-apa) agar tidak error saat dipanggil
            disconnectCamera: () => {},
        };
        console.warn(`No route found for: ${url}. Rendering 404.`);
    }

    // --- LOGIKA BARU: Hentikan stream kamera dari halaman sebelumnya jika ada ---
    if (this.#currentPageInstance && typeof this.#currentPageInstance.disconnectCamera === 'function') {
        this.#currentPageInstance.disconnectCamera();
    }
    // --- AKHIR LOGIKA BARU ---

    if (!document.startViewTransition) {
      console.warn('View Transitions API not supported. Falling back to direct DOM update.');
      this.#content.innerHTML = await newPageInstance.render();
      await newPageInstance.afterRender();
      this.#content.focus();
      this.#currentPageInstance = newPageInstance; // Simpan instance halaman yang baru
      return;
    }

    document.startViewTransition(async () => {
      this.#content.innerHTML = await newPageInstance.render();
    }).finished.then(async () => {
      await newPageInstance.afterRender();
      this.#content.focus();
      this.#currentPageInstance = newPageInstance; // Simpan instance halaman yang baru
    }).catch(async (error) => {
      console.error('View Transition failed:', error);
      this.#content.innerHTML = await newPageInstance.render();
      await newPageInstance.afterRender();
      this.#content.focus();
      this.#currentPageInstance = newPageInstance; // Simpan instance halaman yang baru
    });
  }
}

export default App;