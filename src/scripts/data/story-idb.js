// src/scripts/data/story-idb.js (FILE BARU)
import { openDB } from 'idb'; // Import openDB dari library idb

const DATABASE_NAME = 'story-app-db'; // Nama database Anda
const DATABASE_VERSION = 1; // Versi database. Tingkatkan jika Anda mengubah skema.
const OBJECT_STORE_NAME = 'stories'; // Nama object store untuk menyimpan cerita

// Fungsi untuk membuka koneksi ke database IndexedDB
const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(database) {
    // Metode ini dipanggil saat database baru dibuat atau versi diperbarui.
    // Di sini Anda membuat 'object store' yang berfungsi seperti tabel di database relasional.
    database.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id' });
  },
});

const StoryIdb = {
  // a. Menyimpan data: Menambahkan atau memperbarui sebuah cerita
  async putStory(story) {
    // Membuka transaksi 'readwrite' untuk bisa menulis ke object store.
    return (await dbPromise).put(OBJECT_STORE_NAME, story);
  },

  // b. Menampilkan data: Mengambil semua cerita
  async getAllStories() {
    // Membuka transaksi 'readonly' untuk bisa membaca dari object store.
    return (await dbPromise).getAll(OBJECT_STORE_NAME);
  },

  // b. Menampilkan data: Mengambil satu cerita berdasarkan ID
  async getStory(id) {
    return (await dbPromise).get(OBJECT_STORE_NAME, id);
  },

  // c. Menghapus data: Menghapus sebuah cerita berdasarkan ID
  async deleteStory(id) {
    // Membuka transaksi 'readwrite' untuk bisa menghapus dari object store.
    return (await dbPromise).delete(OBJECT_STORE_NAME, id);
  },
};

export default StoryIdb;