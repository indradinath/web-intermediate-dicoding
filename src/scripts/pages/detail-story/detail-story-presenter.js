// src/scripts/pages/detail-story/detail-story-presenter.js
import StoryApi from '../../data/api'; // Model
import DetailStoryView from './detail-story-view'; // View
import StoryIdb from '../../data/story-idb'; // Import IndexedDB Model (Ini akan di-inject)

class DetailStoryPresenter {
  #view = null;
  #api = null; // Model API
  #idb = null; // <-- TAMBAHKAN: Properti untuk IndexedDB Model
  #urlParser = null; // Fungsi parser URL
  #currentStoryId = null; // Tambahkan properti untuk menyimpan ID cerita yang sedang ditampilkan

  constructor(viewInstance, apiInstance, urlParserFunction, idbInstance) { // <-- TAMBAHKAN: idbInstance sebagai parameter
    this.#view = viewInstance;
    this.#api = apiInstance;
    this.#urlParser = urlParserFunction;
    this.#idb = idbInstance; // <-- INISIALISASI: Simpan instance IndexedDB Model
  }

  async loadStoryDetail() {
    const urlParsed = this.#urlParser();
    const storyId = urlParsed.id;
    this.#currentStoryId = storyId;

    console.log('Story ID being requested:', storyId);

    if (!storyId) {
      this.#view.showIdNotFoundError();
      return;
    }

    try {
      this.#view.showLoading();

      const story = await this.#api.getDetailStory(storyId); // Presenter memanggil Model
      console.log('Story data received:', story);

      this.#view.hideLoading();
      this.#view.showStoryDetails(story);

      if (story.lat !== null && story.lon !== null) {
        this.#view.initAndDisplayDetailMap(story.lat, story.lon, story.name);
      } else {
        this.#view.showNoLocationMessage();
      }

      // Opsional: Periksa apakah cerita sudah ada di IndexedDB, lalu tampilkan tombol hapus cache
      // const cachedStory = await StoryIdb.getStory(storyId); // <-- UBAH INI
      const cachedStory = await this.#idb.getStory(storyId); // <-- MENJADI INI
      if (cachedStory) {
          this.#view.showDeleteFromCacheButton();
      } else {
          this.#view.hideDeleteFromCacheButton();
      }

    } catch (error) {
      console.error('Error fetching story detail from API (trying IndexedDB):', error);
      this.loadStoryDetailFromIndexedDB(error.message);
    }
  }

  async loadStoryDetailFromIndexedDB(apiErrorMessage = null) {
      try {
          this.#view.showLoading();
          // const story = await StoryIdb.getStory(this.#currentStoryId); // <-- UBAH INI
          const story = await this.#idb.getStory(this.#currentStoryId); // <-- MENJADI INI
          this.#view.hideLoading();

          if (story) {
              this.#view.showStoryDetails(story);
              if (story.lat !== null && story.lon !== null) {
                  this.#view.initAndDisplayDetailMap(story.lat, story.lon, story.name);
              } else {
                  this.#view.showNoLocationMessage();
              }
              let infoMessage = 'Data ditampilkan dari cache lokal.';
              if (apiErrorMessage) {
                  infoMessage = `Gagal terhubung ke server (${apiErrorMessage}). ${infoMessage}`;
              }
              this.#view.showError(infoMessage);
          } else {
              let errorMessage = 'Cerita tidak ditemukan, bahkan di cache offline.';
              if (apiErrorMessage) {
                  errorMessage = `Gagal terhubung ke server (${apiErrorMessage}). ${errorMessage}`;
              }
              this.#view.showError(errorMessage);
          }
      } catch (dbError) {
          console.error('Error loading story detail from IndexedDB:', dbError);
          this.#view.showError('Gagal memuat detail cerita dari IndexedDB.');
      }
  }

  async handleDeleteFromCache() {
    if (!this.#currentStoryId) {
        this.#view.showError('Tidak ada cerita yang sedang ditampilkan untuk dihapus.');
        return;
    }
    try {
        // await StoryIdb.deleteStory(this.#currentStoryId); // <-- UBAH INI
        await this.#idb.deleteStory(this.#currentStoryId); // <-- MENJADI INI
        this.#view.showSuccessMessage('Cerita berhasil dihapus dari cache lokal.');
        this.#view.hideDeleteFromCacheButton();
        console.log(`Story ID ${this.#currentStoryId} deleted from IndexedDB.`);
    } catch (error) {
        console.error('Failed to delete story from IndexedDB:', error);
        this.#view.showErrorMessage('Gagal menghapus cerita dari cache lokal.');
    }
  }
}

export default DetailStoryPresenter;