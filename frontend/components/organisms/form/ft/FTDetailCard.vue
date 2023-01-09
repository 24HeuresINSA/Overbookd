<template>
  <v-card>
    <v-card-title>Détail</v-card-title>
    <v-card-text>
      <v-form>
        <RichEditor
          :value="mFT.description"
          class="mb-4"
          @change="onChange('descritpion', $event)"
        ></RichEditor>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import RichEditor from "~/components/atoms/RichEditor.vue";

export default Vue.extend({
  name: "FTDetailCard",
  components: { RichEditor },
  computed: {
    mFT() {
      return this.$accessor.FT.mFT;
    },
  },
  methods: {
    onChange(key: string, value: any) {
      if (typeof value === "string") value = value.trim();
      const updatedFT = { ...this.mFT, [key]: value };
      this.$accessor.FT.setFT(updatedFT);
    },
  },
});
</script>
