// src/scripts/pages/login/login-view.js (FILE BARU)

export default class LoginPageView {
    constructor(elements) {
      this._elements = elements; // Simpan referensi elemen DOM
    }
  
    // Metode-metode View yang dipanggil oleh Presenter
    showLoadingMessage() {
      this._elements.messageElement.textContent = 'Mencoba masuk...';
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
  
    // Metode untuk mengatur event listener (Presenter akan memanggil ini)
    setLoginFormSubmitHandler(handler) {
      this._elements.loginForm.addEventListener('submit', handler);
    }
  }