<template>
  <v-card>
    <div class="volunteer-info">
      <div class="volunteer-info__personnal-data">
        <VolunteerPersonalDataForm />
      </div>
      <div class="volunteer-info__availabilities">
        <AvailabilitiesSumup :user-id="selectedVolunteer.id" />
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import AvailabilitiesSumup from "../../../molecules/availabilities/AvailabilitiesSumup.vue";
import VolunteerPersonalDataForm from "../../../molecules/user/VolunteerPersonalDataForm.vue";

export default Vue.extend({
  name: "VolunteerInformation",
  components: {
    VolunteerPersonalDataForm,
    AvailabilitiesSumup,
},
});
</script>

<style lang="scss" scoped>
.volunteer-info {
  display: flex;
  gap: 15px;
  &__personnal-data {
    width: 40%;
  }
  &__availabilities {
    width: 60%;
  }

  @media only screen and(max-width: $mobile-max-width) {
    flex-direction: column;
    &__personnal-data {
      width: 100%;
    }
    &__availabilities {
      display: none;
    }
  }
}
</style>
