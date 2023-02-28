<template>
  <div>
    <div class="header">
      <h1>Mes disponibilités</h1>
      <p>
        Remplis tes disponibilités, plus tu as de points de charisme, plus tu as
        de chances de faire parti de l'aventure.
      </p>
      <p class="mb-3">
        Coche tout ce que tu peux, nous ne t'affecterons bien évidemment pas à
        tous tes créneaux et te laisserons du temps pour te reposer et profiter
        du festival !
        <strong>
          Les créneaux verts ne sont plus modifiables une fois sauvegardés.
        </strong>
      </p>
      <p class="important text-center">
        ⚠️ Les disponibilités doivent durer au moins 2 heures consécutives !
      </p>
      <h2>Mon Charisme : {{ charisma }} 😎</h2>
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
    charisma(): number {
      return this.$accessor.volunteerAvailability.currentCharisma ?? 0;
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
.header {
  margin: 1rem;
  text-align: justify;
}

h1 {
  font-size: 2rem;
  font-weight: 500;
  margin-bottom: 1rem;
}

h2 {
  font-size: 1.5rem;
  font-weight: 500;
  margin-top: 1rem;
  margin-bottom: 1rem;
}
</style>
