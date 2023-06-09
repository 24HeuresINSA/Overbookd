import vuetify from "vite-plugin-vuetify"

export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    // https://vuetifyjs.com/en/features/treeshaking
    async (options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', config => config.plugins.push(vuetify()))
    },
  ],
  css: ["vuetify/styles"],
  typescript: { shim: false },
  build: { transpile: ["vuetify"] },
  vite: { ssr: { noExternal: ["vuetify"]}}
})