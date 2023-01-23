<template>
  <v-card>
    <v-card-title>Détail</v-card-title>
    <v-card-text>
      <v-form>
        <RichEditor
          :value="mFT.description"
          class="mb-4"
          @change="onChange('description', $event)"
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
    onChange(key: string, value: any) {
      if (this.delay) clearInterval(this.delay);
      this.delay = setTimeout(() => {
        this.updateRichEditorValue(key, value);
      }, 500);
    },
    updateRichEditorValue(key: string, value: string) {
      value = value.trim();
      const updatedFT = { ...this.mFT, [key]: value };
      this.$accessor.FT.updateFT(updatedFT);
    },
  },
});
</script>
