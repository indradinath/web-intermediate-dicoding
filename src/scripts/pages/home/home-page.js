// src/scripts/pages/home/home-page.js
import HomeView from './home-page-view'; // Import View
import HomePagePresenter from './home-page-presenter'; // Import Presenter
import StoryApi from '../../data/api'; // Import Model

export default class HomePage { // Ini adalah kelas yang akan diinstansiasi oleh router App
  #presenter = null;

  async render() {
    // Ini adalah murni markup HTML (View)
    return `
      <section class="container">
        <h1>Daftar Cerita Terbaru</h1> <div id="storiesMapContainer" style="height: 400px; margin-bottom: 30px; display: none;"></div>
        <p id="loadingIndicator">Memuat cerita, mohon tunggu...</p>
        <div id="storiesContainer" class="stories-list">
          </div>
        <a href="#/add" class="add-story-button" aria-label="Tambah Cerita Baru">
          <i class="fas fa-plus"></i> Tambah Cerita
        </a>
      </section>
    `;
  }

  async afterRender() {
    // Presenter mendapatkan referensi elemen DOM
    const elements = {
      storiesContainer: document.getElementById('storiesContainer'),
      loadingIndicator: document.getElementById('loadingIndicator'),
      storiesMapContainer: document.getElementById('storiesMapContainer'),
    };

    // Inisialisasi View
    const homeViewInstance = new HomeView(elements);

    // Inisialisasi Presenter, berikan instance View dan Model
    this.#presenter = new HomePagePresenter(homeViewInstance, StoryApi);

    // Presenter memerintahkan dirinya sendiri untuk memuat data
    await this.#presenter.loadStories();
  }
}