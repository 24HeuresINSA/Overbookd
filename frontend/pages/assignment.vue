<template>
  <v-container
    style="
      left: 0;
      max-width: none;
      margin-left: 0;
      margin-right: 0;
      position: absolute;
      display: flex;
      height: 100%;
      width: 100%;
    "
  >
    <FilteredUsers style="max-width: 350px"></FilteredUsers>

    <!-- calendar --->
    <OverCalendar
      :center-day="new Date().setDate(new Date().getDate() - 5)"
      @open-unassign-dialog="openUnassignDialog"
    ></OverCalendar>

    <OverTasks style="max-width: 550px"></OverTasks>

    <v-dialog v-model="isUnassignDialogOpen" width="500px">
      <unassign-dialog @close-dialog="closeUnassignDialog"></unassign-dialog>
    </v-dialog>
  </v-container>
</template>

<script>
import FilteredUsers from "../components/filtredUsers";
import OverTasks from "../components/overTasks";
import OverCalendar from "../components/overCalendar";

export default {
  name: "Assignment",
  components: { OverCalendar, OverTasks, FilteredUsers },
  data() {
    return {
      isUnassignDialogOpen: false,
    };
  },

  computed: {},

  watch: {},

  async mounted() {
    if (!(await this.hasRole("hard"))) {
      alert("vous avez pas le role 'hard' pour acceder a cette page");
      await this.$router.push({
        path: "/",
      });
    }

    await this.$accessor.assignment.initStore();
  },

  methods: {
    openUnassignDialog() {
      this.isUnassignDialogOpen = true;
    },
    async hasRole(role) {
      return this.$accessor.user.hasRole(role);
    },

    getConfig(key) {
      return this.$accessor.config.getConfig(key);
    },
    closeUnassignDialog() {
      this.isUnassignDialogOpen = false;
    },
  },
};
</script>

<style scoped>
.container {
  padding: 0;
}
</style>
