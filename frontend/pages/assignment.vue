<template>
  <v-container class="assignment-container">
    <FilterableVolunteerList class="volunteer-list" />

    <FilterableTimespanList v-if="isModeOrgaTask" class="task-list" />
    <FilterableFtList v-else class="task-list" />
    <!--<OverCalendar @open-unassign-dialog="openUnassignDialog" />

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

<script lang="ts">
import Vue from "vue";
import FilterableVolunteerList from "~/components/organisms/assignment/FilterableVolunteerList.vue";
import FilterableTimespanList from "~/components/organisms/assignment/FilterableTimespanList.vue";
import { AssignmentModes, Volunteer } from "~/utils/models/assignment";
import { FtWithTimespan } from "~/utils/models/ftTimespan";
import FilterableFtList from "~/components/organisms/assignment/FilterableFtList.vue";

export default Vue.extend({
  name: "Assignment",
  components: {
    FilterableVolunteerList,
    FilterableTimespanList,
    FilterableFtList,
  },
  computed: {
    volunteers(): Volunteer[] {
      return this.$accessor.assignment.volunteers;
    },
    ftWithTimespans(): FtWithTimespan[] {
      return this.$accessor.assignment.fts;
    },
    isModeOrgaTask() {
      return this.$accessor.assignment.mode === AssignmentModes.ORGA_TASK;
    },
  },
  async mounted() {
    this.$accessor.assignment.setModeTaskOrga();
    if (this.isModeOrgaTask && !this.volunteers.length) {
      await this.$accessor.assignment.fetchVolunteers();
    }
    if (!this.isModeOrgaTask && !this.ftWithTimespans.length) {
      await this.$accessor.assignment.fetchFtsWithTimespans();
    }
  },
  /*data() {
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
});
</script>

<style lang="scss" scoped>
.assignment-container {
  padding: 0;
  left: 0;
  top: 0;
  max-width: none;
  margin-left: 0;
  margin-right: 0;
  position: absolute;
  display: flex;
  justify-content: space-between;
  height: 100%;
  width: 100%;
}

.volunteer-list {
  max-width: 350px;
}

.task-list {
  max-width: 450px;
}
</style>
