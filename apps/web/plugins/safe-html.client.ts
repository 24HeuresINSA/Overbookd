import VueSafeHTML, { allowedTags } from "vue-safe-html";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueSafeHTML, {
    allowedTags: [...allowedTags, "p"],
  });
});
