<template>
  <v-card :class="isDisabled ? 'disabled' : ''">
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
          :disabled="isDisabled"
          class="mb-4"
          @change="onChange('description', $event)"
        ></RichEditor>
        <v-switch
          v-model="isPublishable"
          label="Publier sur le site / plaquette"
          :disabled="isDisabled"
          @change="switchPublishAnimation($event)"
        ></v-switch>
        <v-form v-if="isPublishable">
          <v-text-field
            :value="mFA.fa_site_publish_animation?.photLink"
            label="Lien de la photo de l'activité sur le drive"
            :disabled="isDisabled"
            @change="onChangePublishAnimation('photoLink', $event)"
          ></v-text-field>
          <v-text-field
            :value="mFA.fa_site_publish_animation?.description"
            label="Description pour le site"
            :disabled="isDisabled"
            @change="onChangePublishAnimation('description', $event)"
          ></v-text-field>
          <v-combobox
            :value="mFA.fa_site_publish_animation?.categories"
            chips
            multiple
            clearable
            dense
            label="Categories de l'animations"
            :items="categories"
            @change="onChangePublishAnimation('categories', $event)"
          >
          </v-combobox>
        </v-form>
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
import { SitePublishAnimationCategoryType } from "~/utils/models/FA";

export default Vue.extend({
  name: "FADetailCard",
  components: { RichEditor },
  props: {
    isDisabled: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      categories: Object.values(SitePublishAnimationCategoryType),
      isPublishable: false,
    };
  },
  computed: {
    mFA(): any {
      return this.$accessor.FA.mFA;
    },
  },
  watch: {
    mFA: {
      handler() {
        if (this.mFA.fa_site_publish_animation?.faId) {
          this.isPublishable = true;
        }
      },
      deep: true,
    },
  },
  methods: {
    onChange(key: string, value: any) {
      if (typeof value === "string") value = value.trim();
      this.$accessor.FA.updateFA({ key: key, value: value });
    },
    onChangePublishAnimation(key: string, value: any) {
      if (key !== "categories") value = value.trim();
      this.$accessor.FA.updatePublishAnimation({ key, value });
    },
    switchPublishAnimation(value: boolean) {
      if (value) {
        return this.$accessor.FA.createPublishAnimation();
      }

      return this.$accessor.FA.deletePublishAnimation(
        this.mFA.fa_site_publish_animation
      );
    },
  },
});
</script>
