<template>
  <div class="min-h-screen flex items-center justify-center text-center">
    <div class="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
      <!-- Tampilkan tips random -->
      <div v-if="!expired && !isRedirecting" class="bg-blue-50 p-4 rounded-lg text-left text-sm text-blue-900 mb-4">
        <p class="font-semibold">💡 Tips:</p>
        <p>{{ randomTip }}</p>
      </div>

      <p class="text-lg mb-2">Sedang mengarahkan ke:</p>
      <p class="text-blue-600 underline break-all">{{ decodedUrl }}</p>

      <!-- Expired Link -->
      <div v-if="expired" class="text-red-600 mt-4">
        <p>Link ini sudah kedaluwarsa.</p>
        <NuxtLink to="/" class="underline text-blue-600">Kembali ke halaman utama</NuxtLink>
      </div>

      <!-- Password Verification -->
      <div v-else-if="requirePassword && !isRedirecting" class="mt-4">
        <p class="text-sm mb-2">Masukkan password untuk melanjutkan:</p>
        <UInput
          v-model="inputPassword"
          size="xl"
          type="password"
          placeholder="Password"
          class="outline-none"
        />
        <button
          @click="verifyPassword"
          class="ml-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>
        <p v-if="error" class="text-red-600 mt-2">{{ error }}</p>
      </div>

      <!-- Countdown before redirect -->
      <p v-else-if="isRedirecting" class="mt-2 text-sm">
        Anda akan dialihkan dalam {{ countdown }} detik...
      </p>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, onUnmounted } from "vue";

const route = useRoute();
const router = useRouter();

const decodedUrl = ref("");
const requirePassword = ref(false);
const inputPassword = ref("");
const expectedPassword = ref(null);
const countdown = ref(10);
const error = ref("");
const expired = ref(false);
const isRedirecting = ref(false);

// Tips array
const tips = [
  "Selalu cek domain sebelum login ke situs.",
  "Hindari membuka link dari email yang mencurigakan.",
  "Gunakan VPN di jaringan publik.",
  "Jangan pernah membagikan OTP atau password ke siapa pun.",
  "Pastikan HTTPS aktif di browser kamu.",
];

const randomTip = ref(tips[Math.floor(Math.random() * tips.length)]);

// Interval untuk update random tips setiap 5 detik
let tipsInterval;

onMounted(() => {
  // Mulai interval untuk mengganti tips setiap 5 detik
  tipsInterval = setInterval(() => {
    randomTip.value = tips[Math.floor(Math.random() * tips.length)];
  }, 2000);

  const id = route.params.id;
  const dataRaw = localStorage.getItem(`safelink:${id}`);

  if (!dataRaw) {
    alert("Link tidak ditemukan atau sudah tidak berlaku.");
    router.push("/");
    return;
  }

  const data = JSON.parse(dataRaw);

  if (Date.now() > data.expiresAt) {
    expired.value = true;
    return;
  }

  decodedUrl.value = data.url;

  if (data.password) {
    requirePassword.value = true;
    expectedPassword.value = data.password;
  } else {
    startRedirect();
  }
});

// Bersihkan interval saat komponen dihancurkan
onUnmounted(() => {
  clearInterval(tipsInterval);
});

const startRedirect = () => {
  isRedirecting.value = true;
  const interval = setInterval(() => {
    if (countdown.value <= 1) {
      clearInterval(interval);
      window.location.href = decodedUrl.value;
    } else {
      countdown.value--;
    }
  }, 1000);
};

const verifyPassword = () => {
  if (inputPassword.value === expectedPassword.value) {
    error.value = "";
    startRedirect();
  } else {
    error.value = "Password salah!";
  }
};
</script>

<style scoped>
/* Optional styling for your component */
</style>
