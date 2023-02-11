<template>
  <div>
    <h1>Mes disponibilités</h1>
    <p>{{ detailMessage }}</p>
    <h2>Mon Charisme : {{ charisma }}</h2>
    <v-spacer></v-spacer>
    <v-container>
      <AvailabilitiesCard />
      <v-row>
        <v-col v-for="group in existingGroupTitles" :key="group.title" md="12">
          <TimeslotTable
            v-if="!group.onlyForHard || $accessor.user.me.team.includes('hard')"
            :group-title="group.title"
          ></TimeslotTable>
        </v-col>
      </v-row>
    </v-container>
    <TimeslotSnackBar></TimeslotSnackBar>
  </div>
</template>

<script>
import Vue from "vue";
import TimeslotTable from "~/components/molecules/timeslot/TimeslotTable.vue";
import AvailabilitiesCard from "~/components/organisms/availabilities/AvailabilitiesCard.vue";
import TimeslotSnackBar from "../components/atoms/TimeslotSnackBar.vue";

export default Vue.extend({
  name: "Availabilities",
  components: {
    TimeslotTable,
    TimeslotSnackBar,
    AvailabilitiesCard,
  },
  data() {
    return {
      detailMessage: this.getConfig("availabilities_description"),
      maxCharisma: this.getConfig("max_charisma"),
    };
  },
  computed: {
    timeslots: function () {
      return this.$accessor.timeslot.timeslots;
    },
    existingGroupTitles: function () {
      return this.$accessor.timeslot.timeslots.reduce((acc, cur) => {
        if (!acc.some((obj) => obj.title === cur.groupTitle)) {
          acc.push({
            title: cur.groupTitle,
            onlyForHard: cur.forHardOnly || false,
          });
        }
        return acc;
      }, []);
    },
    charisma() {
      return this.$accessor.user.me.charisma;
    },
  },

  async mounted() {
    await this.initStore();
  },

  methods: {
    getConfig(key) {
      return this.$accessor.config.getConfig(key);
    },
    async initStore() {
      await this.$accessor.user.fetchUser();
      await this.$accessor.timeslot.fetchTimeslots();
    },
  },
});
</script>

<style lang="scss" scoped>
h1 {
  margin-left: 12px;
}
</style>
