<template>
  <v-card>
    <v-card-title>Détail</v-card-title>
    <v-card-text>
      <v-form>
        <RichEditor
          :data="mFT.description"
          class="mb-4"
          @change="onChange($event)"
        ></RichEditor>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import RichEditor from "~/components/atoms/RichEditor.vue";
import { FT } from "~/utils/models/ft";

export default Vue.extend({
  name: "FTDetailCard",
  components: { RichEditor },
  data: () => ({
    delay: undefined as any,
  }),
  computed: {
    mFT(): FT {
      return this.$accessor.FT.mFT;
    },
  },
  methods: {
    onChange(description: string) {
      if (this.delay) clearInterval(this.delay);
      this.delay = setTimeout(() => {
        this.updateDescription(description);
      }, 500);
    },
    updateDescription(description: string) {
      return this.updateFT({ description: description.trim() });
    },
    updateFT(ftChunk: Partial<FT>) {
      this.$accessor.FT.updateFT({ ...this.mFT, ...ftChunk });
    },
  },
});
</script>
