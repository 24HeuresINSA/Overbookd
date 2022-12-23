<template>
  <v-card :class="validationStatus">
    <CardErrorList :type="cardType" />
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
        <v-switch
          v-model="isPublishable"
          label="Publier sur le site / plaquette"
          :disabled="isValidatedByOwner"
          @change="switchPublishAnimation($event)"
        ></v-switch>
        <v-form v-if="isPublishable">
          <v-text-field
            :value="mFA.faSitePublishAnimation?.photoLink"
            label="Lien de la photo de l'activité sur le drive"
            @change="onChangePublishAnimation('photoLink', $event)"
          ></v-text-field>
          <v-textarea
            :value="mFA.faSitePublishAnimation?.description"
            label="Description pour le site"
            @change="onChangePublishAnimation('description', $event)"
          ></v-textarea>
          <v-combobox
            :value="mFA.faSitePublishAnimation?.categories"
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
import { FA, FaSitePublishAnimation, fa_card_type } from "~/utils/models/FA";
import {
  isAnimationValidatedBy,
  getFAValidationStatus,
} from "~/utils/fa/faUtils";
import CardErrorList from "~/components/molecules/CardErrorList.vue";
import { SitePublishAnimationCategoryType } from "~/utils/models/FA";

export default Vue.extend({
  name: "FADetailCard",
  components: { RichEditor, CardErrorList },
  data: () => ({
    owner: "humain",
    cardType: fa_card_type.DETAIL,
    categories: Object.values(SitePublishAnimationCategoryType),
    isPublishable: false,
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
  watch: {
    mFA: {
      handler() {
        if (this.mFA.faSitePublishAnimation?.faId) {
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
        return this.$accessor.FA.createPublishAnimation(this.mFA.id);
      }

      return this.$accessor.FA.deletePublishAnimation(
        this.mFA.faSitePublishAnimation as FaSitePublishAnimation
      );
    },
  },
});
</script>
