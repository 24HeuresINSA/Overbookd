<template>
  <div>
    <h1>Mes disponibilités</h1>
    <p>{{ detailMessage }}</p>
    <h2>Mon Charisme : {{ charisma }}</h2>
    <v-spacer></v-spacer>
    <AvailabilitiesStepsCard />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import AvailabilitiesStepsCard from "~/components/organisms/availabilities/AvailabilitiesStepsCard.vue";

export default Vue.extend({
  name: "Availabilities",
  components: { AvailabilitiesStepsCard },
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
  margin-left: 12px;
}
</style>
