// src/scripts/pages/detail-story/detail-story-view.js
import { showFormattedDate } from '../../utils';

class DetailStoryView {
  constructor(elements) {
    this._storyDetailContainer = elements.storyDetailContainer;
    this._storyMapContainer = elements.storyMapContainer;
    this._loadingIndicator = elements.loadingIndicator;
    this._deleteFromCacheButton = elements.deleteFromCacheButton; // Referensi tombol
    this._messageElement = elements.messageElement; // Referensi elemen pesan
  }

  showLoading() {
    this._loadingIndicator.style.display = 'block';
    this._storyDetailContainer.style.display = 'none';
    this._storyMapContainer.style.display = 'none';
  }

  hideLoading() {
    this._loadingIndicator.style.display = 'none';
  }

  showStoryDetails(story) {
    this._storyDetailContainer.style.display = 'block';
    this._storyDetailContainer.innerHTML = `
      <img class="detail-story__photo" src="${story.photoUrl}" alt="Foto cerita dari ${story.name}">
      <h3>${story.name}</h3> <p class="detail-story__date">Diposting pada: ${showFormattedDate(story.createdAt, 'id-ID')}</p> <p class="detail-story__description">${story.description}</p> `;
  }

  showError(message) {
    this.hideLoading();
    this._storyDetailContainer.innerHTML = `<p>${message}</p>`; // tabindex="0" DIHAPUS
  }

  showIdNotFoundError() {
    this.hideLoading();
    this._storyDetailContainer.innerHTML = `<p>ID cerita tidak ditemukan.</p>`; // tabindex="0" DIHAPUS
  }

  initAndDisplayDetailMap(lat, lon, title) {
    this._storyMapContainer.style.display = 'block';

    if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
        this._storyMapContainer.innerHTML = `<p>Peta tidak dapat dimuat. Coba refresh halaman.</p>`; // tabindex="0" DIHAPUS
        console.warn('Google Maps API belum dimuat. Peta detail tidak dapat ditampilkan.');
        return;
    }

    const mapOptions = {
      center: { lat: lat, lng: lon },
      zoom: 12,
    };
    const map = new google.maps.Map(this._storyMapContainer, mapOptions);

    const marker = new google.maps.Marker({
      position: { lat: lat, lng: lon },
      map: map,
      title: title,
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `<h3>${title}</h3><p>Lokasi Cerita</p>`, // tabindex="0" DIHAPUS dari h3, p
    });

    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });
  }

  showNoLocationMessage() {
    this._storyMapContainer.innerHTML = `<p>Lokasi cerita tidak tersedia.</p>`; // tabindex="0" DIHAPUS
  }

  // --- Metode Baru untuk Tombol Hapus dari Cache ---
  showDeleteFromCacheButton() {
      if (this._deleteFromCacheButton) {
          this._deleteFromCacheButton.style.display = 'block';
      }
  }

  hideDeleteFromCacheButton() {
      if (this._deleteFromCacheButton) {
          this._deleteFromCacheButton.style.display = 'none';
      }
  }

  setDeleteFromCacheButtonHandler(handler) {
      if (this._deleteFromCacheButton) {
          this._deleteFromCacheButton.addEventListener('click', handler);
      }
  }

  // --- Metode Baru untuk Menampilkan Pesan (untuk sukses/error hapus cache) ---
  showSuccessMessage(message) {
    if (this._messageElement) {
        this._messageElement.textContent = message;
        this._messageElement.style.color = 'green';
    } else {
        alert(message); // Fallback jika elemen pesan tidak ada
    }
  }

  showErrorMessage(message) {
    if (this._messageElement) {
        this._messageElement.textContent = message;
        this._messageElement.style.color = 'red';
    } else {
        alert(message); // Fallback jika elemen pesan tidak ada
    }
  }
}

export default DetailStoryView;