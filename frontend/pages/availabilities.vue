<template>
  <div>
    <h2>Mes disponibilités</h2>
    <p>{{ detailMessage }}</p>
    <h2>Mon Charisme : {{ charisma }}</h2>
    <v-spacer></v-spacer>
    <v-container>
      <v-row>
        <v-col v-for="title in existingGroupTitles" :key="title" md="12">
          <TimeslotTable :group-title="title"></TimeslotTable>
        </v-col>
      </v-row>
    </v-container>
    <TimeslotSnackBar></TimeslotSnackBar>
  </div>
</template>

<script>
import Vue from "vue";
import TimeslotTable from "../components/organisms/TimeslotTable";
import TimeslotSnackBar from "../components/atoms/TimeslotSnackBar.vue";

export default Vue.extend({
  name: "Availabilities",
  components: { TimeslotTable, TimeslotSnackBar },
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
        if (!acc.includes(cur.groupTitle)) {
          acc.push(cur.groupTitle);
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

<style scoped></style>
