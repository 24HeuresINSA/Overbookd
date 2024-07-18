// @ts-expect-error - VueSecureHTML has no types
import VueSecureHTML from "vue-html-secure";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueSecureHTML);
});
