// src/scripts/pages/add-story/add-story-presenter.js (FILE BARU)
import StoryApi from '../../data/api'; // Model
import AddStoryView from './add-story-view'; // View

class AddStoryPresenter {
  #view = null;
  #api = null; // Model
  #currentStream = null; // Stream kamera dikelola Presenter

  constructor(viewInstance, apiInstance, initialStream = null) {
    this.#view = viewInstance;
    this.#api = apiInstance;
    this.#currentStream = initialStream; // Inisialisasi stream jika ada dari App
  }

  // --- Metode untuk memutuskan koneksi kamera saat halaman ditinggalkan ---
  disconnectCamera() {
    if (this.#currentStream) {
      this.#view.stopCameraStream(this.#currentStream); // Presenter memerintahkan View untuk menghentikan stream
      this.#currentStream = null; // Reset stream di Presenter
      this.#view.hideCameraFeed(); // Presenter memerintahkan View untuk menyembunyikan display
      this.#view.displayPreviewImage('', 'none'); // Pastikan preview juga direset
    }
  }

  // --- Metode Presenter untuk Menangani Event dari View ---
  handleMapClick(event) {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    // Presenter memperbarui data form (di elemen DOM yang dikelola oleh View)
    this.#view._elements.latitudeInput.value = lat;
    this.#view._elements.longitudeInput.value = lng;
    this.#view.updateLocationDisplay(lat, lng); // Presenter memerintahkan View untuk menampilkan koordinat
    this.#view.updateLocationMarker(lat, lng); // Presenter memerintahkan View untuk update marker
  }

  async handleOpenCamera() {
    try {
      if (this.#currentStream) {
        this.#view.stopCameraStream(this.#currentStream);
      }
      this.#view.showCameraFeed();
      this.#currentStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 720 }, height: { ideal: 480 } }
      });
      this.#view.setCameraStream(this.#currentStream);
    } catch (err) {
      console.error('Error accessing camera:', err);
      this.#view.showErrorMessage('Gagal mengakses kamera. Pastikan Anda memberikan izin.');
    }
  }

  handlePhotoInput(event) {
    if (this.#currentStream) {
      this.#view.stopCameraStream(this.#currentStream);
      this.#currentStream = null;
      this.#view.hideCameraFeed();
    }

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.#view.displayPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
        this.#view.displayPreviewImage('', 'none');
    }
  }

  async _takeSnapshot() {
    if (this.#currentStream) {
      const { width, height } = this.#view.getPhotoCanvasDimensions();
      const context = this.#view.getPhotoCanvasContext();
      context.drawImage(this.#view._elements.cameraFeed, 0, 0, width, height); // Akses elemen video di View untuk draw

      this.#view.stopCameraStream(this.#currentStream);
      this.#currentStream = null;
      this.#view.hideCameraFeed();

      return new Promise(resolve => {
        this.#view.getPhotoCanvasElement().toBlob((blob) => {
          const file = new File([blob], `story-photo-${Date.now()}.png`, { type: 'image/png' });
          resolve(file);
        }, 'image/png');
      });
    }
    return null;
  }

  async handleAddStorySubmit(event) {
    event.preventDefault();
    this.#view.showLoadingMessage();

    const description = this.#view._elements.descriptionInput.value; // Presenter mengambil data dari elemen DOM
    let photoFile = null;

    try {
      if (this.#currentStream) {
        photoFile = await this._takeSnapshot();
      } else if (this.#view._elements.photoInput.files.length > 0) {
        photoFile = this.#view._elements.photoInput.files[0];
      }

      if (!photoFile) {
        throw new Error('Mohon unggah atau ambil foto.');
      }
      if (photoFile.size > 1024 * 1024) {
        throw new Error('Ukuran gambar maksimal 1MB.');
      }
      if (!description) {
        throw new Error('Deskripsi cerita tidak boleh kosong.');
      }

      const lat = this.#view._elements.latitudeInput.value ? parseFloat(this.#view._elements.latitudeInput.value) : undefined;
      const lon = this.#view._elements.longitudeInput.value ? parseFloat(this.#view._elements.longitudeInput.value) : undefined;

      // Panggil API (Model)
      await this.#api.addStory({ description, photo: photoFile, lat, lon });

      this.#view.showSuccessMessage('Cerita berhasil ditambahkan!');
      this.#view.resetFormElements();

      window.location.hash = '#/';
      
      // Setelah submit, pastikan stream kamera dihentikan jika masih aktif
      this.disconnectCamera(); 

    } catch (error) {
      console.error('Error adding story:', error);
      this.#view.showErrorMessage(`Gagal menambahkan cerita: ${error.message}`);
    }
  }
}

export default AddStoryPresenter; // <-- Penting: Export default