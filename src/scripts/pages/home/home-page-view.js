// src/scripts/pages/home/home-page-view.js (FILE BARU)
import { createStoryItemTemplate } from '../../templates/template-creator'; // Pastikan path ini benar

class HomeView {
  constructor(elements) {
    // Simpan referensi elemen DOM yang akan dimanipulasi
    this._storiesContainer = elements.storiesContainer;
    this._loadingIndicator = elements.loadingIndicator;
    this._storiesMapContainer = elements.storiesMapContainer;
  }

  // Metode-metode View yang dipanggil oleh Presenter untuk memperbarui UI
  showLoading() {
    this._loadingIndicator.style.display = 'block';
  }

  hideLoading() {
    this._loadingIndicator.style.display = 'none';
  }

  showError(message) {
    this._storiesContainer.innerHTML = `<p tabindex="0">Gagal memuat cerita. ${message}</p>`;
    this.hideLoading(); // Panggil metode View lain dari View
  }

  displayStories(stories) {
    this._storiesContainer.innerHTML = ''; // Kosongkan container
    if (stories.length === 0) {
      this._storiesContainer.innerHTML = '<p tabindex="0">Belum ada cerita yang tersedia.</p>';
      return;
    }
    stories.forEach(story => {
      this._storiesContainer.innerHTML += createStoryItemTemplate(story); // Pastikan fungsi ini diimpor dengan benar
    });
  }

  initAndDisplayMap(storiesWithLocation) {
    if (storiesWithLocation.length === 0) {
      this._storiesMapContainer.style.display = 'none';
      return;
    }

    this._storiesMapContainer.style.display = 'block';

    if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
        this._storiesMapContainer.innerHTML = '<p tabindex="0">Peta tidak dapat dimuat. Coba refresh halaman.</p>';
        console.warn('Google Maps API belum dimuat. Peta tidak dapat ditampilkan.');
        return;
    }

    const mapOptions = {
      center: { lat: 0, lng: 0 },
      zoom: 2,
    };
    const map = new google.maps.Map(this._storiesMapContainer, mapOptions); // Akses elemen container peta

    const bounds = new google.maps.LatLngBounds();

    storiesWithLocation.forEach(story => {
      const position = { lat: story.lat, lng: story.lon };
      const marker = new google.maps.Marker({
        position: position,
        map: map,
        title: story.name,
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div tabindex="0">
            <h3>${story.name}</h3>
            <p>${story.description.substring(0, 100)}${story.description.length > 100 ? '...' : ''}</p>
            <img src="${story.photoUrl}" alt="Foto cerita ${story.name}" style="width:100px; height:auto; display:block; margin-top:5px;">
            <p><a href="#/stories/${story.id}" aria-label="Lihat detail cerita dari ${story.name}">Lihat Detail</a></p>
          </div>
        `,
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
      bounds.extend(position); // Tambahkan posisi marker ke batas
    });

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds);
    }
  }
}

export default HomeView; // <-- Penting: Export default