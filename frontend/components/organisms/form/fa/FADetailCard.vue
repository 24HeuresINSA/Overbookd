<template>
  <v-card :class="isDisabled ? 'disabled' : ''">
    <v-card-title>Détail</v-card-title>
    <v-card-subtitle
      >Décris ici ton activité, soit assez exhaustif, si tu le demandes, c'est
      ce texte qui sera publié sur le site 24heures.org</v-card-subtitle
    >
    <v-card-text>
      <v-form>
        <RichEditor
          :data="mFA.description"
          label="Description"
          :disabled="isDisabled"
          @change="onChange('description', $event)"
        ></RichEditor>
        <v-switch
          :value="mFA.is_publishable"
          label="Publier sur le site / plaquette"
          :disabled="isDisabled"
          @change="onChange('is_publishable', $event)"
        ></v-switch>
        <v-switch
          :value="mFA.is_major"
          label="Anim phare"
          :disabled="isDisabled"
          @change="onChange('is_major', $event)"
        ></v-switch>
        <v-switch
          :value="mFA.is_kids"
          label="Anim pour les gosses"
          :disabled="isDisabled"
          @change="onChange('is_kids', $event)"
        ></v-switch>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import RichEditor from "~/components/atoms/RichEditor.vue";

export default Vue.extend({
  name: "FADetailCard",
  components: { RichEditor },
  props: {
    isDisabled: {
      type: Boolean,
      default: () => false,
    },
  },
  computed: {
    mFA(): any {
      return this.$accessor.FA.mFA;
    },
  },
  methods: {
    onChange(key: string, value: any) {
      if (typeof value === "string") value = value.trim();
      this.$accessor.FA.updateFA({ key: key, value: value });
    },
  },
});
</script>

<style scoped>
.disabled {
  border-left: 5px solid green;
}
</style>
