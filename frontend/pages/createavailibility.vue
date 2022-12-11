<template>
  <div>
    <h2>Création des disponibilités pour la manif</h2>
    <v-spacer></v-spacer>
    <v-container>
      <v-row>
        <v-col offset-md="5" md="7">
          <TimeslotAdder></TimeslotAdder>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row>
        <v-col v-for="title in existingGroupTitles" :key="title" md="6">
          <TimeslotTable
            :group-title="title"
            :editor-mode="true"
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
import TimeslotAdder from "~/components/molecules/timeslot/TimeslotAdder.vue";
import TimeslotSnackBar from "~/components/atoms/TimeslotSnackBar.vue";

export default Vue.extend({
  name: "Availabilities",
  components: { TimeslotTable, TimeslotAdder, TimeslotSnackBar },
  data() {
    return {};
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
    if (
      this.$accessor.permission.isAllowed(
        "can-affect",
        this.$accessor.user.me.team
      )
    ) {
      await this.$store.dispatch("timeslot/fetchTimeslots");
    } else {
      await this.$router.push({
        path: "/",
      });
    }
  },

  methods: {
    getConfig(key) {
      return this.$accessor.config.getConfig(key);
    },
  },
});
</script>

<style scoped></style>
