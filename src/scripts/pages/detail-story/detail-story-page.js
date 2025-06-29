// src/scripts/pages/detail-story/detail-story-page.js
import DetailStoryView from './detail-story-view'; // Import View
import DetailStoryPresenter from './detail-story-presenter'; // Import Presenter
import StoryApi from '../../data/api'; // Import Model
import { parseActivePathname } from '../../routes/url-parser'; // Import untuk mendapatkan ID dari URL
import StoryIdb from '../../data/story-idb'; // <-- TAMBAHKAN IMPORT INI

export default class DetailStoryPage {
  #presenter = null;

  async render() {
    return `
      <section class="container">
        <h1>Detail Cerita</h1>
        <p id="loadingIndicator">Memuat detail cerita, mohon tunggu...</p>
        <div id="storyDetailContainer" class="story-detail-container" style="display:none;">
        </div>
        <div id="storyMapContainer" class="story-map-container" style="height: 400px; margin-top: 20px; display: none;"></div>
        
        <button id="deleteFromCacheButton" class="submit-button" style="display:none; margin-top: 20px; background-color: #dc3545;" aria-label="Hapus cerita ini dari cache lokal">Hapus dari Cache Lokal</button>
        <div id="message" class="form-message" role="status" aria-live="polite" style="margin-top: 15px;"></div>
      </section>
    `;
  }

  async afterRender() {
    const elements = {
      storyDetailContainer: document.getElementById('storyDetailContainer'),
      storyMapContainer: document.getElementById('storyMapContainer'),
      loadingIndicator: document.getElementById('loadingIndicator'),
      deleteFromCacheButton: document.getElementById('deleteFromCacheButton'),
      messageElement: document.getElementById('message'),
    };

    const detailStoryViewInstance = new DetailStoryView(elements);

    // Inisialisasi Presenter, berikan instance View dan Model
    // --- PERBAIKI PANGGILAN PRESENTER DI SINI ---
    this.#presenter = new DetailStoryPresenter(
      detailStoryViewInstance,
      StoryApi,
      parseActivePathname,
      StoryIdb // <-- TERUSKAN StoryIdb sebagai argumen terakhir
    );
    // --- AKHIR PERBAIKAN ---

    await this.#presenter.loadStoryDetail();

    detailStoryViewInstance.setDeleteFromCacheButtonHandler(this.#presenter.handleDeleteFromCache.bind(this.#presenter));
  }
}