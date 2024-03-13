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
        <AvailabilitiesSumup />
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
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
  methods: {
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
