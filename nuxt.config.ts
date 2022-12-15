// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    baseURL: '/website/'
  },
  imports: {
    dirs: ['stores'],
  },
  modules: [
    [
      '@pinia/nuxt',
      {
        autoImports: ['defineStore', 'acceptHMRUpdate', 'storeToRefs'],
      },
    ],
  ],

})
