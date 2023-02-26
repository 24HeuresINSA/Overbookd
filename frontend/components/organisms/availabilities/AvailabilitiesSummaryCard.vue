<template>
  <v-card :color="availabilities.length === 0 ? 'red' : ''">
    <v-card-title
      >Mes dispos : <v-spacer /><v-btn color="#5fdb48" :to="availabilitiesPath"
        >Renseigner plus de créneaux</v-btn
      >
    </v-card-title>
    <AvailabilitiesStepsCard class="desktop" />
  </v-card>
</template>

<script>
import AvailabilitiesStepsCard from "~/components/organisms/availabilities/AvailabilitiesStepsCard.vue";
export default {
  name: "AvailabilitiesSummaryCard",
  components: { AvailabilitiesStepsCard },
  data() {
    return {
      availabilitiesPath: "/availabilities",
    };
  },
  computed: {
    me() {
      return this.$accessor.user.me;
    },
    userId() {
      return +this.me.id;
    },
    availabilities() {
      return this.$accessor.volunteerAvailability.mAvailabilities;
    },
  },
  async mounted() {
    if (this.availabilities.length === 0) {
      await Promise.all([
        this.$accessor.charismaPeriod.fetchCharismaPeriods(),
        this.$accessor.volunteerAvailability.fetchVolunteerAvailabilities(
          this.userId
        ),
      ]);
    }
  },
};
</script>

<style>
.myCal {
  height: 50vh;
}
@media only screen and (max-width: 965px) {
  .desktop {
    display: none;
  }
}
</style>
