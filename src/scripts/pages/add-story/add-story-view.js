// src/scripts/pages/add-story/add-story-view.js (FILE BARU)

class AddStoryView {
    constructor(elements) {
      this._elements = elements;
      this._locationMarker = null; // Marker peta dikelola oleh View
    }
  
    // --- Metode untuk Menampilkan/Menyembunyikan UI dan Pesan ---
    showLoadingMessage() {
      this._elements.messageElement.textContent = 'Mengirim cerita...';
      this._elements.messageElement.style.color = 'blue';
    }
  
    showSuccessMessage(message) {
      this._elements.messageElement.textContent = message;
      this._elements.messageElement.style.color = 'green';
    }
  
    showErrorMessage(message) {
      this._elements.messageElement.textContent = message;
      this._elements.messageElement.style.color = 'red';
    }
  
    showCameraFeed() {
      this._elements.cameraFeed.style.display = 'block';
      this._elements.previewImage.style.display = 'none';
      this._elements.photoCanvas.style.display = 'none';
    }
  
    hideCameraFeed() {
      this._elements.cameraFeed.style.display = 'none';
    }
  
    displayPreviewImage(src, displayStyle = 'block') {
      this._elements.previewImage.src = src;
      this._elements.previewImage.style.display = displayStyle;
    }
  
    updateLocationDisplay(lat, lon) {
      this._elements.displayLat.textContent = lat ? lat.toFixed(6) : '';
      this._elements.displayLon.textContent = lon ? lon.toFixed(6) : '';
    }
  
    showMapErrorMessage(message) {
      this._elements.locationMap.innerHTML = `<p tabindex="0">${message}</p>`;
    }
  
    resetFormElements() {
      this._elements.addStoryForm.reset();
      this.displayPreviewImage('', 'none'); // Sembunyikan preview
      this.updateLocationDisplay(null, null); // Kosongkan tampilan lat/lon
      this.removeLocationMarker();
    }
  
    // --- Metode untuk Inisialisasi dan Manipulasi Peta ---
    initLocationMap(centerLat, centerLng, clickHandler) {
      if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
          this.showMapErrorMessage('Peta tidak dapat dimuat. Coba refresh halaman.');
          console.warn('Google Maps API belum dimuat. Peta lokasi tidak dapat ditampilkan.');
          return;
      }
  
      const mapOptions = {
        center: { lat: centerLat, lng: centerLng },
        zoom: 10,
      };
      const map = new google.maps.Map(this._elements.locationMap, mapOptions);
  
      map.addListener('click', clickHandler); // Mendaftarkan event listener pada peta
      this._elements.locationMap.mapInstance = map; // Simpan instance map di elemen DOM jika perlu diakses dari Presenter
    }
  
    // Metode untuk memperbarui/menambahkan marker lokasi
    updateLocationMarker(lat, lng) {
      const position = { lat: lat, lng: lng };
      if (this._locationMarker) {
        this._locationMarker.setPosition(position);
      } else {
        this._locationMarker = new google.maps.Marker({
          position: position,
          map: this._elements.locationMap.mapInstance,
          title: 'Lokasi Dipilih',
        });
      }
    }
  
    removeLocationMarker() {
      if (this._locationMarker) {
        this._locationMarker.setMap(null);
        this._locationMarker = null;
      }
    }
  
    // --- Metode untuk Kontrol Kamera ---
    setCameraStream(stream) {
      this._elements.cameraFeed.srcObject = stream;
      this._elements.cameraFeed.play();
    }
  
    stopCameraStream(stream) {
      if (stream) {
          stream.getTracks().forEach(track => track.stop());
      }
      this._elements.cameraFeed.srcObject = null;
    }
  
    getPhotoCanvasContext() {
        return this._elements.photoCanvas.getContext('2d');
    }
  
    getPhotoCanvasDimensions() {
        return { width: this._elements.cameraFeed.videoWidth, height: this._elements.cameraFeed.videoHeight };
    }
  
    getPhotoCanvasElement() {
        return this._elements.photoCanvas;
    }
  
    // --- Metode untuk Mengatur Event Listener (dipanggil oleh Presenter) ---
    setOpenCameraButtonHandler(handler) {
      this._elements.openCameraButton.addEventListener('click', handler);
    }
  
    setPhotoInputHandler(handler) {
      this._elements.photoInput.addEventListener('change', handler);
    }
  
    setAddStoryFormSubmitHandler(handler) {
      this._elements.addStoryForm.addEventListener('submit', handler);
    }
  }
  
  export default AddStoryView; // <-- Penting: Export default