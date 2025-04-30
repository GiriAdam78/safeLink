import tailwindcss from "@tailwindcss/vite"
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/ui'],
  css:['@/assets/css/main.css'],
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  vite:{
    plugins:[
      tailwindcss(),
    ]
  },
  runtimeConfig :{
    public: {
      siteURL:"https://localhost:3000" //Ganti dengan URL Produksi
    }
  }
})
