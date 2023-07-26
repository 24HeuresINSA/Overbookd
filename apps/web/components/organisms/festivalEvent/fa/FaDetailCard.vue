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
          v-model="isPublishable"
          label="Publier sur le site / plaquette"
          :disabled="isValidatedByOwner"
          @change="switchPublishAnimation($event)"
        ></v-switch>
        <v-form v-if="isPublishable">
          <v-text-field
            :value="mFA.faSitePublishAnimation?.photoLink"
            label="Lien de la photo de l'activité sur le drive"
            :disabled="isValidatedByOwner"
            @change="updatePublishAnimationPhotoLink($event)"
          ></v-text-field>
          <v-textarea
            :value="mFA.faSitePublishAnimation?.description"
            label="Description pour le site"
            :disabled="isValidatedByOwner"
            @change="updatePublishAnimationDescription($event)"
          ></v-textarea>
          <v-combobox
            :value="mFA.faSitePublishAnimation?.categories"
            chips
            multiple
            clearable
            dense
            label="Categories de l'animations"
            :items="categories"
            :disabled="isValidatedByOwner"
            @change="updatePublishAnimationCategories($event)"
          >
          </v-combobox>
          <v-switch
            :input-value="mFA.faSitePublishAnimation?.isFlagship"
            label="Anim phare qui sera mise en avant sur les réseaux sociaux"
            :disabled="isValidatedByOwner"
            @change="updatePublishAnimationIsFlagship($event)"
          ></v-switch>
        </v-form>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import RichEditor from "~/components/atoms/field/tiptap/RichEditor.vue";
import CardErrorList from "~/components/molecules/festivalEvent/validation/CardErrorList.vue";
import {
  getFAValidationStatus,
  isAnimationValidatedBy,
} from "~/utils/festivalEvent/faUtils";
import {
  Fa,
  FaCardType,
  SitePublishAnimation,
  SitePublishAnimationCategoryType,
} from "~/utils/models/fa";

export default Vue.extend({
  name: "FaDetailCard",
  components: { RichEditor, CardErrorList },
  data: () => ({
    owner: "humain",
    cardType: FaCardType.DETAIL,
    categories: Object.values(SitePublishAnimationCategoryType),
    isPublishable: false,
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
        if (this.mFA.faSitePublishAnimation) {
          this.isPublishable = true;
        }
      },
      deep: true,
    },
  },
  methods: {
    updateFaDescription(description: string) {
      return this.updateFa({ description: description.trim() });
    },
    updateFa(faChunk: Partial<Fa>) {
      this.$accessor.fa.updateFa({ ...this.mFA, ...faChunk });
    },
    updatePublishAnimationDescription(description: string) {
      return this.updatePublishAnimation({ description: description.trim() });
    },
    updatePublishAnimationPhotoLink(photoLink: string) {
      return this.updatePublishAnimation({ photoLink: photoLink.trim() });
    },
    updatePublishAnimationCategories(
      categories: SitePublishAnimationCategoryType[]
    ) {
      return this.updatePublishAnimation({ categories });
    },
    updatePublishAnimationIsFlagship(isFlagship: boolean) {
      return this.updatePublishAnimation({ isFlagship });
    },
    updatePublishAnimation(
      faSitePublishAnimationChunk: Partial<SitePublishAnimation>
    ) {
      this.$accessor.fa.updatePublishAnimation({
        ...this.mFA.faSitePublishAnimation,
        ...faSitePublishAnimationChunk,
      });
    },
    switchPublishAnimation(value: boolean) {
      if (value) return this.$accessor.fa.createPublishAnimation();
      if (this.mFA.faSitePublishAnimation) {
        return this.$accessor.fa.deletePublishAnimation();
      }
    },
  },
});
</script>
