// src/scripts/pages/home/home-page-presenter.js
import StoryApi from '../../data/api'; // Model
import HomeView from './home-page-view'; // View
import StoryIdb from '../../data/story-idb'; // IndexedDB Model

class HomePagePresenter {
  #view = null;
  #api = null; // Model

  constructor(viewInstance, apiInstance) {
    this.#view = viewInstance;
    this.#api = apiInstance;
  }

  async loadStories() {
    try {
      this.#view.showLoading(); // Perintah Presenter ke View

      const stories = await this.#api.getAllStories(1, 20, 1); // Presenter memanggil Model

      // Simpan setiap cerita yang berhasil diambil dari API ke IndexedDB
      // Pastikan StoryIdb.putStory juga menangani kasus update (keyPath 'id')
      await Promise.all(stories.map(story => StoryIdb.putStory(story))); // Menggunakan Promise.all untuk menunggu semua penyimpanan
      console.log('Stories saved/updated in IndexedDB.');

      this.#view.hideLoading(); // Perintah Presenter ke View
      this.#view.displayStories(stories); // Presenter mengirim data ke View

      const storiesWithLocation = stories.filter(story => story.lat !== null && story.lon !== null);
      this.#view.initAndDisplayMap(storiesWithLocation); // Perintah Presenter ke View

    } catch (error) {
      console.error('Error fetching stories from API (possibly offline):', error); // Pesan log lebih jelas
      // Tanpa menampilkan error langsung di UI di sini, karena kita akan mencoba fallback
      // this.#view.showError(error.message); // Hapus baris ini untuk menghindari pesan error ganda
      
      // Jika gagal dari API, coba tampilkan dari IndexedDB
      // console.log('Attempting to load stories from IndexedDB as fallback.'); // Pesan log
      this.loadStoriesFromIndexedDB(error.message); // Teruskan pesan error API jika perlu
    }
  }

  // Metode baru untuk memuat cerita dari IndexedDB
  async loadStoriesFromIndexedDB(apiErrorMessage = null) { // Tambahkan parameter untuk pesan error API
    try {
      this.#view.showLoading();
      const stories = await StoryIdb.getAllStories();
      this.#view.hideLoading();

      if (stories.length > 0) {
        this.#view.displayStories(stories);
        const storiesWithLocation = stories.filter(story => story.lat !== null && story.lon !== null);
        this.#view.initAndDisplayMap(storiesWithLocation);
        console.log('Stories loaded from IndexedDB (offline).');

        // Informasikan pengguna bahwa data mungkin offline/lama, atau API sempat gagal
        let infoMessage = 'Data ditampilkan dari cache lokal.';
        if (apiErrorMessage) {
            infoMessage = `Gagal terhubung ke server (${apiErrorMessage}). ${infoMessage}`;
        }
        this.#view.showError(infoMessage); // Gunakan showError untuk pesan info

      } else {
        // Jika IndexedDB juga kosong
        let errorMessage = 'Tidak ada cerita yang tersimpan secara offline.';
        if (apiErrorMessage) {
            errorMessage = `Gagal terhubung ke server (${apiErrorMessage}). ${errorMessage}`;
        }
        this.#view.showError(errorMessage); //
        console.warn('IndexedDB is empty.');
      }
    } catch (dbError) {
      console.error('Error loading stories from IndexedDB:', dbError);
      this.#view.showError('Gagal memuat cerita dari IndexedDB. Silakan coba lagi nanti.');
    }
  }
}

export default HomePagePresenter;