<template>
  <v-card :class="validationStatus">
    <CardErrorList festival-event="FT" :type="cardType" />
    <v-card-title>Détail</v-card-title>
    <v-card-text>
      <v-form>
        <RichEditor
          :data="mFT.description"
          class="mb-4"
          :disabled="!canEditDescription"
          @change="updateDescription($event)"
        ></RichEditor>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import RichEditor from "~/components/atoms/field/tiptap/RichEditor.vue";
import CardErrorList from "~/components/molecules/festival-event/validation/CardErrorList.vue";
import {
  getFTValidationStatus,
  isTaskValidatedBy,
} from "~/utils/festival-event/ftUtils";
import { Ft, FtCardType } from "~/utils/models/ft.model";

export default Vue.extend({
  name: "FtDetailCard",
  components: { RichEditor, CardErrorList },
  data: () => ({
    owner: "humain",
    cardType: FtCardType.DETAIL,
  }),
  computed: {
    mFT(): Ft {
      return this.$accessor.ft.mFT;
    },
    isValidatedByOwner(): boolean {
      return isTaskValidatedBy(this.mFT.reviews, this.owner);
    },
    canEditDescription(): boolean {
      return !this.isValidatedByOwner || this.canAffect;
    },
    canAffect(): boolean {
      return this.$accessor.user.can("affect-volunteer");
    },
    validationStatus(): string {
      return getFTValidationStatus(this.mFT, this.owner).toLowerCase();
    },
  },
  methods: {
    updateDescription(description: string) {
      if (this.mFT.description === description) return;
      return this.updateFT({ description: description.trim() });
    },
    updateFT(ftChunk: Partial<Ft>) {
      this.$accessor.ft.updateFT({ ...this.mFT, ...ftChunk });
    },
  },
});
</script>
