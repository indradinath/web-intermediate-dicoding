// src/scripts/pages/login/login-page.js
import LoginPageView from '../login/login-view'; // Import View
import LoginPagePresenter from '../login/login-presenter'; // Import Presenter
import StoryApi from '../../data/api'; // Import Model

export default class LoginPage {
  #presenter = null;

  async render() {
    return `
      <section class="container">
        <h1>Masuk ke Akun Anda</h1>
        <form id="loginForm" class="login-form">
          <div class="form-group">
            <label for="emailInput">Email:</label>
            <input type="email" id="emailInput" name="email" required aria-label="Masukkan alamat email Anda">
          </div>
          <div class="form-group">
            <label for="passwordInput">Password:</label>
            <input type="password" id="passwordInput" name="password" required aria-label="Masukkan password Anda">
          </div>
          <button type="submit" class="submit-button" aria-label="Masuk">Masuk</button>
          <div id="message" class="form-message" role="status" aria-live="polite" style="margin-top: 15px;"></div>
          <p style="margin-top: 15px;">Belum punya akun? <a href="#/register">Daftar di sini</a></p>
        </form>
      </section>
    `;
  }

  async afterRender() {
    // Presenter mendapatkan referensi elemen DOM
    const elements = {
      loginForm: document.getElementById('loginForm'),
      emailInput: document.getElementById('emailInput'),
      passwordInput: document.getElementById('passwordInput'),
      messageElement: document.getElementById('message'),
    };

    // Inisialisasi View
    const loginPageViewInstance = new LoginPageView(elements);

    // Inisialisasi Presenter, berikan instance View dan Model
    this.#presenter = new LoginPagePresenter(loginPageViewInstance, StoryApi);

    // Hubungkan event listener dari View ke metode Presenter
    loginPageViewInstance.setLoginFormSubmitHandler(this.#presenter.handleLoginSubmit.bind(this.#presenter));
  }
}