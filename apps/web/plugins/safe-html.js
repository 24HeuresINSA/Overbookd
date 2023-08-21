import Vue from 'vue';
import VueSafeHTML, { allowedTags } from 'vue-safe-html';

Vue.use(VueSafeHTML, {
  allowedTags: [...allowedTags, 'p'],
});
