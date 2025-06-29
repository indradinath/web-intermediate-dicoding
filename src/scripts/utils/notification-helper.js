// src/scripts/utils/notification-helper.js
import { VAPID_PUBLIC_KEY } from '../config';
import StoryApi from '../data/api';

// Fungsi helper untuk mengubah VAPID key base64 menjadi Uint8Array
function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// Fungsi utama untuk berlangganan push notification
async function subscribePushNotification() {
    // ... (kode pengecekan awal dan permintaan izin) ...

    try {
        const serviceWorkerRegistration = await navigator.serviceWorker.ready;
        let subscription = await serviceWorkerRegistration.pushManager.getSubscription();

        if (subscription) {
            console.log('Sudah berlangganan push notification:', subscription);
            alert('Anda sudah berlangganan notifikasi.');
            return;
        }

        const permissionState = await Notification.requestPermission();
        if (permissionState === 'denied') {
            console.warn('Akses notifikasi ditolak oleh pengguna.');
            alert('Akses notifikasi ditolak. Anda tidak akan menerima notifikasi.');
            return;
        }
        if (permissionState === 'default') {
            console.warn('Pengguna belum memberikan pilihan akses notifikasi.');
            alert('Mohon berikan izin notifikasi untuk menerima update.');
            return;
        }

        subscription = await serviceWorkerRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlB64ToUint8Array(VAPID_PUBLIC_KEY),
        });
        console.log('Langganan push berhasil (browser):', subscription); // Log objek lengkap untuk debugging
        alert('Berlangganan notifikasi berhasil!');

        // --- Perbaikan di sini: Periksa keberadaan 'keys' dan propertinya ---
        if (!subscription.keys || !subscription.keys.p256dh || !subscription.keys.auth) {
            console.error('PushSubscription object is malformed: missing required keys (p256dh or auth).', subscription); // Log error spesifik
            throw new Error('Data langganan push tidak lengkap. Tidak dapat mengirim ke server.'); // Lempar error ke blok catch utama
        }

        const subscriptionData = {
            endpoint: subscription.endpoint,
            keys: {
                p256dh: subscription.keys.p256dh,
                auth: subscription.keys.auth,
            },
        };
        // -----------------------------------------------------------------------------

        await StoryApi.subscribeNotification(subscriptionData); // Kirim data yang sudah difilter
        console.log('Langganan dikirim ke backend API.');
    } catch (error) {
        console.error('Gagal berlangganan push notification:', error);
        alert(`Gagal berlangganan notifikasi: ${error.message}.`);
    }
}

// Fungsi utama untuk berhenti berlangganan push notification (opsional, tapi baik jika ada)
async function unsubscribePushNotification() {
    const serviceWorkerRegistration = await navigator.serviceWorker.ready;
    const subscription = await serviceWorkerRegistration.pushManager.getSubscription();

    if (!subscription) {
        console.log('Tidak ada langganan aktif untuk berhenti.');
        alert('Anda belum berlangganan notifikasi.');
        return;
    }

    try {
        // Hapus langganan dari backend API terlebih dahulu
        await StoryApi.unsubscribeNotification({ endpoint: subscription.endpoint });
        
        // Kemudian, berhenti berlangganan di browser
        await subscription.unsubscribe();
        console.log('Berhenti berlangganan push notification berhasil.');
        alert('Anda telah berhenti berlangganan notifikasi.');
    } catch (error) {
        console.error('Gagal berhenti berlangganan push notification:', error);
        alert(`Gagal berhenti berlangganan notifikasi: ${error.message}.`);
    }
}

export { subscribePushNotification, unsubscribePushNotification };