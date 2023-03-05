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
    <!--<FilteredUsers
      style="max-width: 350px; height: 100%"
      class="filteredUser"
    />

    <OverCalendar @open-unassign-dialog="openUnassignDialog" />

    <OverTasks
      v-if="isModeOrgaToTache"
      style="max-width: 550px; height: 100%"
    />
    <OverFT v-else style="max-width: 550px" />

    <v-dialog v-model="isUnassignDialogOpen" width="500px">
      <unassign-dialog @close-dialog="closeUnassignDialog" />
    </v-dialog>-->
  </v-container>
</template>

<script>
/*import FilteredUsers from "../components/FiltredUsers";
import OverTasks from "../components/OverTasks";
import OverCalendar from "../components/OverCalendar";
import OverFT from "../components/OverFT.vue";*/

export default {
  name: "Assignment",
  /*components: {
    OverCalendar,
    OverTasks,
    FilteredUsers,
    OverFT,
  },
  data() {
    return {
      isUnassignDialogOpen: false,
    };
  },

  computed: {
    isModeOrgaToTache() {
      return this.$accessor.assignment.filters.isModeOrgaToTache;
    },
  },

  watch: {},

  async mounted() {
    if (!this.hasPermission("hard")) {
      alert("vous avez pas le role 'hard' pour acceder a cette page");
      await this.$router.push({
        path: "/",
      });
    }
    await this.$accessor.assignment.initMode();
    await this.$accessor.assignment.initStore();
  },

  methods: {
    openUnassignDialog() {
      this.isUnassignDialogOpen = true;
    },
    hasPermission(permission) {
      return this.$accessor.user.hasPermission(permission);
    },

    getConfig(key) {
      return this.$accessor.config.getConfig(key);
    },
    closeUnassignDialog() {
      this.isUnassignDialogOpen = false;
    },
  },*/
};
</script>

<style scoped>
.container {
  padding: 0;
}
.filteredUser {
  height: 100vh;
}
</style>
