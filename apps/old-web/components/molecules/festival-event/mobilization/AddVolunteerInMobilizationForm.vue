<template>
  <ConfirmationMessage
    confirm-color="success"
    @close-dialog="closeAddVolunteerDialog"
    @confirm="addVolunteer"
  >
    <template #title>Ajouter un bénévole</template>
    <template #statement>
      <SearchUser v-model="volunteer" :list="addableVolunteers" hide-details />
    </template>
    <template #confirm-btn-content>
      <v-icon left> mdi-plus-circle-outline </v-icon>Ajouter
    </template>
  </ConfirmationMessage>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ConfirmationMessage from "~/components/atoms/card/ConfirmationMessage.vue";
import SearchUser from "~/components/atoms/field/search/SearchUser.vue";
import { Mobilization, Volunteer } from "@overbookd/festival-event";
import { User } from "@overbookd/user";

type AddVolunteerInMobilizationFormData = {
  volunteer: Volunteer | null;
};

export default defineComponent({
  name: "AddVolunteerInMobilizationForm",
  components: { ConfirmationMessage, SearchUser },
  props: {
    mobilization: {
      type: Object as () => Mobilization | null,
      default: null,
    },
  },
  data: (): AddVolunteerInMobilizationFormData => ({
    volunteer: null,
  }),
  computed: {
    addableVolunteers(): User[] {
      return this.$accessor.user.volunteers.filter(
        (volunteer) =>
          !(this.mobilization?.volunteers ?? []).some(
            (v) => v.id === volunteer.id,
          ),
      );
    },
  },
  async mounted() {
    await this.$accessor.user.fetchVolunteers();
  },
  methods: {
    addVolunteer() {
      if (!this.volunteer || !this.mobilization) return;
      this.$accessor.festivalTask.addVolunteerToMobilization({
        mobilizationId: this.mobilization.id,
        volunteerId: this.volunteer.id,
      });
      this.closeAddVolunteerDialog();
    },
    closeAddVolunteerDialog() {
      this.volunteer = null;
      this.$emit("close-dialog");
    },
  },
});
</script>
