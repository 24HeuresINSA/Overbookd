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
        <AvailabilitiesSumup
          :readonly="isReadonlyCalendar"
          :availabilities="availabilities"
          @update:availabilities="updateAvailabilities"
        />
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
import { Period } from "@overbookd/period";
import { AFFECT_VOLUNTEER } from "@overbookd/permission";
import { defineComponent } from "vue";
import AvailabilitiesSumup from "~/components/molecules/availabilities/AvailabilitiesSumup.vue";
import VolunteerPersonalDataForm from "~/components/molecules/user/VolunteerPersonalDataForm.vue";

export default defineComponent({
  name: "VolunteerInformation",
  components: {
    VolunteerPersonalDataForm,
    AvailabilitiesSumup,
  },
  emits: ["volunteer-updated"],
  computed: {
    selectedVolunteerId(): number {
      return this.$accessor.user.selectedUser.id;
    },
    isReadonlyCalendar(): boolean {
      return !this.$accessor.user.can(AFFECT_VOLUNTEER);
    },
    availabilities(): Period[] {
      return this.$accessor.volunteerAvailability.availabilities.list;
    },
  },
  watch: {
    async selectedVolunteerId() {
      await this.fetchAvailabilities();
    },
  },
  async mounted() {
    await this.fetchAvailabilities();
  },
  methods: {
    volunteerUpdated() {
      this.$emit("volunteer-updated");
    },
    async fetchAvailabilities() {
      await this.$accessor.volunteerAvailability.fetchVolunteerAvailabilities(
        this.selectedVolunteerId,
      );
    },
    updateAvailabilities(availabilities: Period[]) {
      this.$accessor.volunteerAvailability.setAvailabilities(availabilities);
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
