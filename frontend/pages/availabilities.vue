<template>
  <div>
    <div class="header">
      <h1>Mes disponibilités</h1>
      <p>{{ detailMessage }}</p>
      <div class="important">
        ⚠️ Les disponibilités doivent durer au moins 2 heures consécutives !
      </div>
      <h2>Mon Charisme : {{ charisma }}</h2>
    </div>
    <AvailabilitiesStepsCard />
    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import AvailabilitiesStepsCard from "~/components/organisms/availabilities/AvailabilitiesStepsCard.vue";

export default Vue.extend({
  name: "Availabilities",
  components: { AvailabilitiesStepsCard, SnackNotificationContainer },
  computed: {
    userId(): number {
      return +this.$accessor.user.me.id;
    },
    detailMessage(): string {
      return this.$accessor.config.getConfig("availabilities_description");
    },
    charisma(): number {
      return this.$accessor.volunteerAvailability.currentCharisma ?? 0;
    },
    maxCharisma(): number {
      return +this.$accessor.config.getConfig("max_charisma");
    },
  },
  async mounted() {
    await Promise.all([
      this.$accessor.charismaPeriod.fetchCharismaPeriods(),
      this.$accessor.volunteerAvailability.fetchVolunteerAvailabilities(
        this.userId
      ),
    ]);
  },
});
</script>

<style lang="scss" scoped>
h1 {
  font-size: 2rem;
  font-weight: 500;
  margin-bottom: 1rem;
}
</style>
