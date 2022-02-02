<template>
  <div>
    <h2>Mes disponibilités</h2>
    <p>{{ detailMessage }}</p>
    <v-spacer></v-spacer>
    <v-container>
      <v-row>
        <v-col offset-md="5" md="7">
          <TimeslotAdder
            v-if="
              $accessor.user.me.team.some((e) => {
                return authorizedEditor.includes(e);
              })
            "
          ></TimeslotAdder>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row>
        <v-col v-for="title in existingGroupTitles" :key="title" md="6">
          <TimeslotTable
            :groupTitle="title"
          ></TimeslotTable>
        </v-col>
      </v-row>
    </v-container>
    <TimeslotSnackBar></TimeslotSnackBar>
  </div>
</template>

<script>
import Vue from 'vue'
import TimeslotTable from "../components/organisms/TimeslotTable";
import TimeslotAdder from "../components/organisms/TimeslotAdder";
import TimeslotSnackBar from "../components/atoms/TimeslotSnackBar.vue";

export default Vue.extend({
  name: "Availabilities",
  components: { TimeslotTable, TimeslotAdder, TimeslotSnackBar },
  data() {
    return {
      detailMessage: this.getConfig("availabilities_description"),
      userCharisma: this.$accessor.user.me.charisma,
      maxCharisma: this.getConfig("max_charisma"),
      authorizedEditor: ["humain", "admin"], //Maybe should be by config
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
  },

  async mounted() {
    this.$store.dispatch("timeslot/fetchTimeslots");
  },

  methods: {
    getConfig(key) {
      return this.$accessor.config.getConfig(key);
    },
  },
});
</script>

<style scoped></style>
