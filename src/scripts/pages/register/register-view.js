// src/scripts/pages/register/register-view.js (FILE BARU)

export default class RegisterPageView {
    constructor(elements) {
      this._elements = elements; // Simpan referensi elemen DOM
    }
  
    // Metode-metode View yang dipanggil oleh Presenter
    showLoadingMessage() {
      this._elements.messageElement.textContent = 'Mencoba mendaftar...';
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
  
    resetForm() {
      this._elements.registerForm.reset();
    }
  
    // Metode untuk mengatur event listener (Presenter akan memanggil ini)
    setRegisterFormSubmitHandler(handler) {
      this._elements.registerForm.addEventListener('submit', handler);
    }
  }