<template>
  <v-card :class="validationStatus">
    <CardErrorList :type="cardType" />
    <v-card-title>Détail</v-card-title>
    <v-card-subtitle
      >Décris ici ton activité, soit assez exhaustif, si tu le demandes, c'est
      ce texte qui sera publié sur le site
      <a href="https://24heures.org">24heures.org</a>.</v-card-subtitle
    >
    <v-card-text>
      <v-form @submit.prevent="">
        <RichEditor
          :data="mFA.description ?? ''"
          label="Description"
          :disabled="isValidatedByOwner"
          class="mb-4"
          @change="updateFaDescription($event)"
        ></RichEditor>
        <v-switch
          v-model="isPublicAnimation"
          label="Publier sur le site / plaquette"
          :disabled="isValidatedByOwner"
          @change="switchPublicAnimation($event)"
        ></v-switch>
        <v-form v-if="isPublicAnimation">
          <v-text-field
            :value="mFA.publicAnimation?.photoLink"
            label="Lien de la photo de l'activité sur le drive"
            :disabled="isValidatedByOwner"
            @change="updatePublicAnimationPhotoLink($event)"
          ></v-text-field>
          <v-textarea
            :value="mFA.publicAnimation?.description"
            label="Description pour le site"
            :disabled="isValidatedByOwner"
            @change="updatePublicAnimationDescription($event)"
          ></v-textarea>
          <v-combobox
            :value="mFA.publicAnimation?.categories"
            chips
            multiple
            clearable
            dense
            label="Categories de l'animations"
            :items="categories"
            :disabled="isValidatedByOwner"
            @change="updatePublicAnimationCategories($event)"
          >
          </v-combobox>
          <v-switch
            :input-value="mFA.publicAnimation?.isFlagship"
            label="Anim phare qui sera mise en avant sur les réseaux sociaux"
            :disabled="isValidatedByOwner"
            @change="updatePublicAnimationIsFlagship($event)"
          ></v-switch>
        </v-form>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import RichEditor from "~/components/atoms/field/tiptap/RichEditor.vue";
import CardErrorList from "~/components/molecules/festival-event/validation/CardErrorList.vue";
import {
  getFAValidationStatus,
  isAnimationValidatedBy,
} from "~/utils/festival-event/faUtils";
import {
  Fa,
  FaCardType,
  PublicAnimation,
  publicAnimationCategoryTypes,
  PublicAnimationCategoryType,
} from "~/utils/models/fa";

export default Vue.extend({
  name: "FaDetailCard",
  components: { RichEditor, CardErrorList },
  data: () => ({
    owner: "humain",
    cardType: FaCardType.DETAIL,
    categories: Object.values(publicAnimationCategoryTypes),
    isPublicAnimation: false,
  }),
  computed: {
    mFA(): Fa {
      return this.$accessor.fa.mFA;
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
        if (this.mFA.publicAnimation) {
          this.isPublicAnimation = true;
        }
      },
      deep: true,
    },
  },
  methods: {
    updateFaDescription(description: string) {
      return this.$accessor.fa.updateFaChunk({
        description: description.trim(),
      });
    },
    updatePublicAnimationDescription(description: string) {
      return this.updatePublicAnimation({ description: description.trim() });
    },
    updatePublicAnimationPhotoLink(photoLink: string) {
      return this.updatePublicAnimation({ photoLink: photoLink.trim() });
    },
    updatePublicAnimationCategories(categories: PublicAnimationCategoryType[]) {
      return this.updatePublicAnimation({ categories });
    },
    updatePublicAnimationIsFlagship(isFlagship: boolean) {
      return this.updatePublicAnimation({ isFlagship });
    },
    updatePublicAnimation(publicAnimationChunk: Partial<PublicAnimation>) {
      this.$accessor.fa.updatePublicAnimation({
        ...this.mFA.publicAnimation,
        ...publicAnimationChunk,
      });
    },
    switchPublicAnimation(value: boolean) {
      if (value) return this.$accessor.fa.createPublicAnimation();
      if (this.mFA.publicAnimation) {
        return this.$accessor.fa.deletePublicAnimation();
      }
    },
  },
});
</script>
