<template>
  <v-card>
    <div class="volunteer-info">
      <div class="volunteer-info__personal-data">
        <VolunteerPersonalDataForm
          @saved="volunteerUpdated"
          @deleted="volunteerUpdated"
        />
      </div>
      <div class="volunteer-info__availabilities">
        <AvailabilitiesSumupV2
          :readonly="canReadOnlyAvailabilities"
          :availabilities="availabilities"
          @update:availabilities="updateAvailabilities"
        />
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Period } from "@overbookd/period";
import { AFFECT_VOLUNTEER } from "@overbookd/permission";
import { UserPersonalData } from "@overbookd/user";
import AvailabilitiesSumupV2 from "~/components/molecules/availabilities/AvailabilitiesSumupV2.vue";
import VolunteerPersonalDataForm from "~/components/molecules/user/VolunteerPersonalDataForm.vue";

export default defineComponent({
  name: "VolunteerInformation",
  components: {
    VolunteerPersonalDataForm,
    AvailabilitiesSumupV2,
  },
  emits: ["volunteer-updated"],
  computed: {
    canReadOnlyAvailabilities(): boolean {
      return !this.$accessor.user.can(AFFECT_VOLUNTEER);
    },
    selectedVolunteer(): UserPersonalData {
      return this.$accessor.user.selectedUser;
    },
    availabilities(): Period[] {
      return this.$accessor.volunteerAvailability.availabilities.list;
    },
  },
  watch: {
    selectedVolunteer() {
      this.fetchAvailabilities();
    },
  },
  async mounted() {
    await this.fetchAvailabilities();
  },
  methods: {
    fetchAvailabilities() {
      return this.$accessor.volunteerAvailability.fetchVolunteerAvailabilities(
        this.selectedVolunteer.id,
      );
    },
    async updateAvailabilities(availabilities: Period[]) {
      const volunteerId = this.selectedVolunteer.id;
      await this.$accessor.volunteerAvailability.overrideVolunteerAvailabilities(
        { volunteerId, availabilities },
      );
      this.$accessor.user.findUserById(this.selectedVolunteer.id);
    },
    volunteerUpdated() {
      this.$emit("volunteer-updated");
    },
  },
});
</script>

<style lang="scss" scoped>
.volunteer-info {
  display: flex;
  gap: 15px;
  &__personal-data {
    width: 40%;
  }
  &__availabilities {
    width: 60%;
  }

  @media only screen and(max-width: $mobile-max-width) {
    flex-direction: column;
    &__personal-data {
      width: 100%;
    }
    &__availabilities {
      display: none;
    }
  }
}
</style>
