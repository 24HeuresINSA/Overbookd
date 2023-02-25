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
    if (!this.$accessor.user.me) this.$accessor.user.fetchUser();
    await this.$accessor.charismaPeriod.fetchCharismaPeriods();
    await this.$accessor.volunteerAvailability.fetchVolunteerAvailabilities(
      +this.$accessor.user.me.id
    );
  },
});
</script>

<style lang="scss" scoped>
h1 {
  margin-left: 12px;
}
</style>
