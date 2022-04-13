<template>
  <div style="width: 500px; height: 100%">
    <v-simple-table dense fixed-header height="800">
      <template #default>
        <thead>
          <tr>
            <td>FT</td>
            <td>Role</td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(ft, index) in FTs"
            :key="index"
            @click="multipleSolidTask(ft)"
          >
            <td>{{ ft.count + " - " + ft.general.name }}</td>
            <td>
              <MiniUserBadge
                v-for="team of rolesByFT[ft.count]"
                :key="team"
                :team="team"
                @click.native.stop="clickBadge(ft, team)"
              ></MiniUserBadge>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <v-snackbar v-model="snack.active" :timeout="snack.timeout">
      {{ snack.feedbackMessage }}
    </v-snackbar>
  </div>
</template>

<script>
import { Snack } from "~/utils/models/snack";
import MiniUserBadge from "~/components/atoms/MiniUserBadge.vue";

export default {
  name: "ListTasks",
  components: { MiniUserBadge },

  data() {
    return {
      selectedTasksIndex: undefined,
      height: window.innerHeight * 0.75,
      snack: new Snack(),
    };
  },

  computed: {
    FTs() {
      return this.$accessor.assignment.filteredFTs;
    },
    rolesByFT() {
      return this.$accessor.assignment.roles;
    },
  },

  methods: {
    async multipleSolidTask(ft) {
      if (ft) {
        this.$accessor.assignment.setMultipleSolidTask(ft);
      }
    },
    clickBadge(ft, team) {
      this.$accessor.assignment.setFTTeamFilter(team);
    },
  },
};
</script>

<style scoped></style>
