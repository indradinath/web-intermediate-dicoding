// src/scripts/data/api.js
import { API_BASE_URL } from '../config'; // Pastikan path ini benar jika config.js ada di scripts/ level yang sama

const StoryApi = {
    // Helper untuk menangani respons JSON dan error
    _handleResponse: async (response) => {
        const data = await response.json();
        if (data.error) {
            throw new Error(data.message || 'Terjadi kesalahan saat mengambil data.');
        }
        return data;
    },

    // 1. Register User
    async register({ name, email, password }) {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });
        return this._handleResponse(response);
    },

    // 2. Login User
    async login({ email, password }) {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        const data = await this._handleResponse(response);
        // Simpan token ke localStorage. Ini penting untuk request terautentikasi.
        localStorage.setItem('authToken', data.loginResult.token);
        localStorage.setItem('userId', data.loginResult.userId);
        localStorage.setItem('userName', data.loginResult.name);
        return data.loginResult;
    },

    // 3. Add New Story (Authenticated)
    async addStory({ description, photo, lat, lon }) {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('Anda harus login untuk menambahkan cerita.');
        }

        const formData = new FormData();
        formData.append('description', description);
        formData.append('photo', photo);
        if (lat !== undefined && lat !== null) formData.append('lat', lat);
        if (lon !== undefined && lon !== null) formData.append('lon', lon);

        const response = await fetch(`${API_BASE_URL}/stories`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });
        return this._handleResponse(response);
    },

    // 4. Add New Story with Guest Account (Without Authentication) - Opsional
    async addGuestStory({ description, photo, lat, lon }) {
        const formData = new FormData();
        formData.append('description', description);
        formData.append('photo', photo);
        if (lat !== undefined && lat !== null) formData.append('lat', lat);
        if (lon !== undefined && lon !== null) formData.append('lon', lon);

        const response = await fetch(`${API_BASE_URL}/stories/guest`, {
            method: 'POST',
            body: formData,
        });
        return this._handleResponse(response);
    },

    // 5. Get All Stories
    async getAllStories(page = 1, size = 10, location = 0) {
        const token = localStorage.getItem('authToken');
        let headers = {};
        if (token) {
            // Jika ada token, gunakan otentikasi
            headers = { Authorization: `Bearer ${token}` };
        }
        
        const response = await fetch(`${API_BASE_URL}/stories?page=${page}&size=${size}&location=${location}`, {
            headers: headers,
        });
        const data = await this._handleResponse(response);
        return data.listStory;
    },

    // 6. Get Detail Story
    async getDetailStory(id) {
        const token = localStorage.getItem('authToken');
        let headers = {};
        if (token) {
            headers = { Authorization: `Bearer ${token}` };
        }

        const response = await fetch(`${API_BASE_URL}/stories/${id}`, {
            headers: headers,
        });
        const data = await this._handleResponse(response);
        return data.story;
    },

    // Notifikasi (opsional, untuk pengembangan lanjutan jika Anda memilih)
    // getVapidPublicKey: () => VAPID_PUBLIC_KEY, // Import VAPID_PUBLIC_KEY dari config

    async subscribeNotification(subscription) {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('Anda harus login untuk berlangganan notifikasi.');
        }

        const response = await fetch(`${API_BASE_URL}/notifications/subscribe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(subscription),
        });
        return this._handleResponse(response);
    },

    async unsubscribeNotification(endpoint) {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('Anda harus login untuk berhenti berlangganan notifikasi.');
        }

        const response = await fetch(`${API_BASE_URL}/notifications/subscribe`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ endpoint }),
        });
        return this._handleResponse(response);
    },
};

export default StoryApi;