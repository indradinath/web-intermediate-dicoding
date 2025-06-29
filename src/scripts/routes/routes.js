// src/scripts/routes/routes.js
import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import AddStoryPage from '../pages/add-story/add-story-page'; // <-- Tambahkan ini
import DetailStoryPage from '../pages/detail-story/detail-story-page'; // <-- Tambahkan ini
import LoginPage from '../pages/login/login-page'; // Tambahkan halaman login jika diperlukan
import RegisterPage from '../pages/register/register-page'; // Tambahkan halaman register jika diperlukan

const routes = {
  '/': HomePage, // Simpan referensi ke kelas, bukan instansi
  '/about': AboutPage,
  '/add': AddStoryPage, // Rute untuk halaman tambah cerita
  '/stories/:id': DetailStoryPage, // Rute dinamis untuk detail cerita
  '/login': LoginPage, // Rute untuk halaman login
  '/register': RegisterPage, // Rute untuk halaman register
};

export default routes;