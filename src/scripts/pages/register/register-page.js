// src/scripts/pages/register/register-page.js
import RegisterPageView from '../register/register-view'; // Import View
import RegisterPagePresenter from '../register/register-presenter'; // Import Presenter
import StoryApi from '../../data/api'; // Import Model

export default class RegisterPage {
  #presenter = null;

  async render() {
    return `
      <section class="container">
        <h1>Daftar Akun Baru</h1>
        <form id="registerForm" class="register-form">
          <div class="form-group">
            <label for="nameInput">Nama Lengkap:</label>
            <input type="text" id="nameInput" name="name" required aria-label="Masukkan nama lengkap Anda">
          </div>
          <div class="form-group">
            <label for="emailInput">Email:</label>
            <input type="email" id="emailInput" name="email" required aria-label="Masukkan alamat email Anda">
          </div>
          <div class="form-group">
            <label for="passwordInput">Password:</label>
            <input type="password" id="passwordInput" name="password" required minlength="8" aria-label="Masukkan password minimal 8 karakter">
          </div>
          <button type="submit" class="submit-button" aria-label="Daftar akun baru">Daftar</button>
          <div id="message" class="form-message" role="status" aria-live="polite" style="margin-top: 15px;"></div>
          <p style="margin-top: 15px;">Sudah punya akun? <a href="#/login">Masuk di sini</a></p>
        </form>
      </section>
    `;
  }

  async afterRender() {
    // Presenter mendapatkan referensi elemen DOM
    const elements = {
      registerForm: document.getElementById('registerForm'),
      nameInput: document.getElementById('nameInput'),
      emailInput: document.getElementById('emailInput'),
      passwordInput: document.getElementById('passwordInput'),
      messageElement: document.getElementById('message'),
    };

    // Inisialisasi View
    const registerPageViewInstance = new RegisterPageView(elements);

    // Inisialisasi Presenter, berikan instance View dan Model
    this.#presenter = new RegisterPagePresenter(registerPageViewInstance, StoryApi);

    // Hubungkan event listener dari View ke metode Presenter
    registerPageViewInstance.setRegisterFormSubmitHandler(this.#presenter.handleRegisterSubmit.bind(this.#presenter));
  }
}