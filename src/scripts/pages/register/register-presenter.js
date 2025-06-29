// src/scripts/pages/register/register-presenter.js (FILE BARU)
import StoryApi from '../../data/api'; // Model
import RegisterPageView from '../register/register-view'; // View

class RegisterPagePresenter {
  #view = null;
  #api = null; // Model

  constructor(viewInstance, apiInstance) {
    this.#view = viewInstance;
    this.#api = apiInstance;
  }

  // Metode Presenter untuk menangani Event dari View
  async handleRegisterSubmit(event) {
    event.preventDefault(); // Mencegah default form submission

    this.#view.showLoadingMessage(); // Presenter memerintahkan View 

    const name = this.#view._elements.nameInput.value; // Presenter mengambil data dari elemen DOM 
    const email = this.#view._elements.emailInput.value; 
    const password = this.#view._elements.passwordInput.value; 

    // Validasi sederhana (sesuai kriteria API, password min 8 karakter)
    if (password.length < 8) {
        this.#view.showErrorMessage('Password harus minimal 8 karakter.'); // Presenter memerintahkan View 
        return;
    }

    try {
        await this.#api.register({ name, email, password }); // Presenter memanggil Model 
        this.#view.showSuccessMessage('Registrasi berhasil! Silakan masuk.'); // Presenter memerintahkan View 
        
        // Setelah registrasi berhasil, arahkan pengguna ke halaman login
        this.#view.resetForm(); // Presenter memerintahkan View 
        window.location.hash = '#/login'; // Presenter mengelola navigasi 
    } catch (error) {
        console.error('Registrasi gagal:', error); 
        this.#view.showErrorMessage(`Registrasi gagal: ${error.message}`); // Presenter memerintahkan View 
    }
  }
}

export default RegisterPagePresenter; // <-- Penting: Export default