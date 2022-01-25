<template>
  <div>
    <h2>Mes disponibilités</h2>
    <p>{{ detailMessage }}</p>
    <v-spacer></v-spacer>
    <v-container>
      <v-row>
        <v-col offset-md="5" md="7">
          <OverTimeslotAdder
            v-if="
              $accessor.user.me.team.some((e) => {
                return authorizedEditor.includes(e);
              })
            "
          ></OverTimeslotAdder>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row>
        <v-col v-for="title in existingGroupTitles" :key="title" md="6">
          <overTimeslotTable
            :timeslots="timeslotDict[title]"
          ></overTimeslotTable>
        </v-col>
      </v-row>
    </v-container>
    <TimeslotSnackBar></TimeslotSnackBar>
  </div>
</template>

<script>
import { getConfig, getUser, hasRole } from "../common/role";
import overTimeslotTable from "../components/organisms/overTimeslotTable";
import { timeslotRepo } from "../repositories/repoFactory";
import OverTimeslotAdder from "../components/organisms/OverTimeslotAdder";
import TimeslotSnackBar from "../components/atoms/TimeslotSnackBar.vue";

export default {
  name: "Availabilities",
  components: { overTimeslotTable, OverTimeslotAdder, TimeslotSnackBar },
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
    timeslotDict: function () {
      return this.$accessor.timeslot.timeslots.reduce((acc, e) => {
        if (acc[e.groupTitle]) {
          acc[e.groupTitle].push(e);
        } else {
          acc[e.groupTitle] = [e];
        }
        return acc;
      }, {});
    },
  },

  async mounted() {
    this.$store.dispatch("timeslot/fetchTimeslots");
  },

  methods: {
    hasRole(role) {
      return hasRole(this, role);
    },

    getConfig(key) {
      return this.$accessor.config.getConfig(key);
    },
  },
};
</script>

<style scoped></style>
