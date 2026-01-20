import tailwindcss from '@tailwindcss/vite'
import devtoolsJson from 'vite-plugin-devtools-json'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: { lang: 'id' },
    }
  },
  appConfig: {
    metaURL: process.env.META_BASE_URL || 'https://buku.bupin.id',
    soalURL: process.env.SOAL_BASE_URL || 'https://cbt.api.bupin.id',
  },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss(), devtoolsJson()],
  },
  modules: ['@vueuse/nuxt', '@nuxt/icon'],
})
