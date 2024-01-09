<template>
  <v-card class="link-drive-card">
    <v-btn class="link-drive-card__close-btn" icon @click="closeDialog">
      <v-icon>mdi-close</v-icon>
    </v-btn>

    <v-card-title class="link-drive-card__title">
      <h2>Définir les lieux de retrait</h2>
    </v-card-title>

    <v-card-subtitle>
      <p>
        Tu es sur le point de valider l'activité
        <strong>{{ activityName }}</strong> .
      </p>
      <p>Il faut d'abord tu définisses où le matériel sera récupéré.</p>
    </v-card-subtitle>

    <v-card-text>
      <InquiryTable
        :inquiries="inquiries"
        :owner="owner"
        @remove="removeInquiry"
      />
    </v-card-text>

    <v-card-actions class="reject-card__actions">
      <v-btn
        :disabled="isMissingDrives"
        color="primary"
        large
        @click="complete"
      >
        <v-icon left> mdi-checkbox-marked-circle-outline </v-icon>
        Finaliser
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  InquiryOwner,
  InquiryRequest,
  MATOS,
  isAssignedToDrive,
} from "@overbookd/festival-event";
import InquiryTable from "~/components/molecules/festival-event/logistic/inquiry/InquiryTable.vue";

export default defineComponent({
  name: "FaLinkDriveFormCard",
  components: { InquiryTable },
  props: {
    inquiries: { type: Array as () => InquiryRequest[], default: () => [] },
    owner: { type: String as () => InquiryOwner, default: () => MATOS },
  },
  emits: ["completed", "close-dialog"],
  computed: {
    activityName(): string {
      return this.$accessor.festivalActivity.selectedActivity.general.name;
    },
    isMissingDrives(): boolean {
      return this.inquiries.some((request) => !isAssignedToDrive(request));
    },
  },
  methods: {
    closeDialog() {
      this.$emit("close-dialog");
    },
    complete() {
      this.$emit("completed");
      this.closeDialog();
    },
    removeInquiry(inquiry: InquiryRequest) {
      this.$accessor.festivalActivity.removeInquiryRequest(inquiry.slug);
    },
  },
});
</script>

<style lang="scss" scoped>
.link-drive-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  p {
    margin-bottom: 5px;
  }
  &__title {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
    h2 {
      flex: 1;
      text-align: center;
    }
  }
  &__actions {
    margin-bottom: 10px;
  }
  &__close-btn {
    position: absolute;
    top: 3px;
    right: 3px;
  }
}
</style>
