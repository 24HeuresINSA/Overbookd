<template>
  <v-card :class="validationStatus">
    <v-card-title>Détail</v-card-title>
    <v-card-subtitle
      >Décris ici ton activité, soit assez exhaustif, si tu le demandes, c'est
      ce texte qui sera publié sur le site 24heures.org</v-card-subtitle
    >
    <v-card-text>
      <v-form @submit.prevent="">
        <RichEditor
          :data="mFA.description"
          label="Description"
          :disabled="isValidatedByOwner"
          class="mb-4"
          @change="onChange('description', $event)"
        ></RichEditor>
        <v-text-field
          :value="mFA.photo_link"
          label=" Lien de la photo de l'activité sur le drive"
          :disabled="isValidatedByOwner"
          @change="onChange('photo_link', $event)"
        ></v-text-field>
        <v-switch
          :value="mFA.is_publishable"
          label="Publier sur le site / plaquette"
          :disabled="isValidatedByOwner"
          @change="onChange('is_publishable', $event)"
        ></v-switch>
        <v-switch
          :value="mFA.is_major"
          label="Anim phare"
          :disabled="isValidatedByOwner"
          @change="onChange('is_major', $event)"
        ></v-switch>
        <v-switch
          :value="mFA.is_kids"
          label="Anim pour les gosses"
          :disabled="isValidatedByOwner"
          @change="onChange('is_kids', $event)"
        ></v-switch>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import RichEditor from "~/components/atoms/RichEditor.vue";
import { FA } from "~/utils/models/FA";
import {
  isAnimationValidatedBy,
  getFAValidationStatus,
} from "~/utils/fa/faUtils";

export default Vue.extend({
  name: "FADetailCard",
  components: { RichEditor },
  data: () => ({
    owner: "humain",
  }),
  computed: {
    mFA(): FA {
      return this.$accessor.FA.mFA;
    },
    isValidatedByOwner(): boolean {
      return isAnimationValidatedBy(this.mFA, this.owner);
    },
    validationStatus(): string {
      return getFAValidationStatus(this.mFA, this.owner).toLowerCase();
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
