<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
      <h1 class="text-xl font-semibold mb-4">Generate SafeLink</h1>
      <form @submit.prevent="generateLink">
        <UInput
          icon="i-lucide-link"
          v-model="url"
          type="text"
          size="xl"
          placeholder="Masukkan URL"
          class="w-full outline-none mb-4"
        />

        <!-- Toggle Password -->
        <div class="flex items-center justify-between mb-2">
          <label for="toggle" class="text-sm">Aktifkan Password?</label>
          <USwitch v-model="enablePassword" id="toggle" />
        </div>

        <UInput
          v-model="password"
          icon="i-lucide-lock"
          size="xl"
          :disabled="!enablePassword"
          type="password"
          placeholder="Masukkan Password"
          class="w-full mb-4 outline-none"
        />

        <button
          type="submit"
          :disabled="!isValidURL(url)"
          class="w-full py-2 rounded text-white transition cursor-pointer"
          :class="
            isValidURL(url)
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          "
        >
          Buat SafeLink
        </button>
      </form>
      <div v-if="shortLink" class="mt-4 bg-blue-50 p-4 rounded-lg text-left text-sm text-blue-900 ">
        <p class="text-sm">Results:</p>
        <NuxtLink
          :to="`/safelink/${shortLink}`"
          class="underline break-all"
        >
          {{ $config.public.siteURL }}/safelink/{{ shortLink }}
        </NuxtLink>
      </div>

      <!-- Grid 3 kolom -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div class="bg-gray-100 p-4 rounded-xl text-center shadow">
          <p class="text-sm font-medium text-gray-600">Encrypt With UUID</p>
          <UIcon name="i-lucide-key-round" class="size-9"/>
        </div>
        <div class="bg-gray-100 p-4 rounded-xl text-center shadow">
          <p class="text-sm font-medium text-gray-600">Safe Your Link With Password</p>
          <UIcon name="i-lucide-lock" class="size-9"/>
        </div>
        <div class="bg-gray-100 p-4 rounded-xl text-center shadow">
          <p class="text-sm font-medium text-gray-600">Made With Tailwind V4 + Nuxt</p>
          <UIcon name="i-lucide-layers" class="size-9"/>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

const url = ref("");
const password = ref("");
const shortLink = ref("");
const enablePassword = ref(false);

const isValidURL = (str) => {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};

const generateLink = () => {
  if (!isValidURL(url.value)) {
    alert("URL tidak valid!");
    return;
  }

  const id = uuidv4().split("-")[0]; // UUID pendek
  const expiresAt = Date.now() + 10 * 60 * 1000; // expired dalam 10 menit

  const data = {
    url: url.value,
    password: enablePassword.value ? password.value : null,
    expiresAt,
  };

  localStorage.setItem(`safelink:${id}`, JSON.stringify(data));
  shortLink.value = id;
};
</script>
