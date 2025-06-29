// src/scripts/pages/add-story/add-story-page.js
import AddStoryView from './add-story-view'; // Import View
import AddStoryPresenter from './add-story-presenter'; // Import Presenter
import StoryApi from '../../data/api'; // Import Model

export default class AddStoryPage {
  #presenter = null;
  #currentStream = null; // Stream kamera tetap dikelola di sini untuk diberikan ke Presenter

  async render() {
    return `
      <section class="container">
        <h1>Tambah Cerita Baru</h1>
        <form id="addStoryForm" class="add-story-form">
          <div class="form-group">
            <label for="descriptionInput">Deskripsi Cerita:</label>
            <textarea id="descriptionInput" name="description" required rows="5" aria-label="Deskripsi cerita Anda"></textarea>
          </div>

          <div class="form-group">
            <label for="photoInput">Foto Cerita:</label>
            <input type="file" id="photoInput" accept="image/*" capture="camera" aria-label="Pilih foto dari galeri atau kamera Anda">
            <button type="button" id="openCameraButton" class="btn-secondary" aria-label="Buka kamera untuk mengambil foto">
              <i class="fas fa-camera"></i> Ambil Foto
            </button>
            <video id="cameraFeed" class="camera-feed" autoplay style="display:none;"></video>
            <canvas id="photoCanvas" class="photo-canvas" style="display:none;"></canvas>
            <img id="previewImage" src="" alt="Pratinjau Foto Cerita" class="preview-image" style="display:none;">
          </div>

          <div class="form-group">
            <label>Lokasi (Opsional):</label>
            <div id="locationMap" class="location-map"></div>
            <p class="map-instruction">Klik pada peta untuk memilih lokasi cerita Anda.</p>
            <input type="hidden" id="latitudeInput" name="lat">
            <input type="hidden" id="longitudeInput" name="lon">
            <p>Latitude: <span id="displayLat" aria-live="polite"></span></p>
            <p>Longitude: <span id="displayLon" aria-live="polite"></span></p>
          </div>

          <button type="submit" class="submit-button" aria-label="Kirim cerita baru">Kirim Cerita</button>
          <div id="message" class="form-message" role="status" aria-live="polite" style="margin-top: 15px;"></div>
        </form>
      </section>
    `;
  }

  async afterRender() {
    // Presenter mendapatkan referensi elemen DOM
    const elements = {
        addStoryForm: document.getElementById('addStoryForm'),
        descriptionInput: document.getElementById('descriptionInput'),
        photoInput: document.getElementById('photoInput'),
        openCameraButton: document.getElementById('openCameraButton'),
        cameraFeed: document.getElementById('cameraFeed'),
        photoCanvas: document.getElementById('photoCanvas'),
        previewImage: document.getElementById('previewImage'),
        locationMap: document.getElementById('locationMap'),
        latitudeInput: document.getElementById('latitudeInput'),
        longitudeInput: document.getElementById('longitudeInput'),
        displayLat: document.getElementById('displayLat'),
        displayLon: document.getElementById('displayLon'),
        messageElement: document.getElementById('message'),
    };

    // Inisialisasi View
    const addStoryViewInstance = new AddStoryView(elements);

    // Inisialisasi Presenter, berikan instance View, Model, dan stream kamera (jika ada)
    this.#presenter = new AddStoryPresenter(addStoryViewInstance, StoryApi, this.#currentStream);

    // Hubungkan event listener dari View ke metode Presenter
    addStoryViewInstance.setOpenCameraButtonHandler(this.#presenter.handleOpenCamera.bind(this.#presenter));
    addStoryViewInstance.setPhotoInputHandler(this.#presenter.handlePhotoInput.bind(this.#presenter));
    addStoryViewInstance.setAddStoryFormSubmitHandler(this.#presenter.handleAddStorySubmit.bind(this.#presenter));
    addStoryViewInstance.initLocationMap(
      -6.2, 106.8, // Default center
      //'YOUR_GOOGLE_MAP_ID_HERE', // Map ID (opsional, jika tidak digunakan, hapus)
      this.#presenter.handleMapClick.bind(this.#presenter) // Handler klik peta
    );
  }

  // Metode untuk memutuskan koneksi kamera saat halaman ditinggalkan
  disconnectCamera() {
    if (this.#presenter && typeof this.#presenter.disconnectCamera === 'function') {
      this.#presenter.disconnectCamera();
    }
  }
}