// src/scripts/pages/login/login-presenter.js (FILE BARU)
import StoryApi from '../../data/api'; // Model
import LoginPageView from '../login/login-view'; // View

class LoginPagePresenter {
  #view = null;
  #api = null; // Model

  constructor(viewInstance, apiInstance) {
    this.#view = viewInstance;
    this.#api = apiInstance;
  }

  // Metode Presenter untuk menangani Event dari View
  async handleLoginSubmit(event) {
    event.preventDefault(); // Mencegah default form submission

    this.#view.showLoadingMessage(); // Presenter memerintahkan View

    const email = this.#view._elements.emailInput.value; // Presenter mengambil data dari elemen DOM
    const password = this.#view._elements.passwordInput.value;

    try {
      await this.#api.login({ email, password }); // Presenter memanggil Model
      this.#view.showSuccessMessage('Login berhasil! Mengarahkan ke Beranda...'); // Presenter memerintahkan View

      // Redirect ke halaman Beranda setelah login sukses
      window.location.hash = '#/'; // Presenter mengelola navigasi
    } catch (error) {
      console.error('Login failed:', error);
      this.#view.showErrorMessage(`Login gagal: ${error.message}`); // Presenter memerintahkan View
    }
  }
}

export default LoginPagePresenter; // <-- Penting: Export default