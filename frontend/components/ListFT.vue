<template>
  <div style="width: 500px; height: 100%">
    <v-simple-table dense fixed-header height="575">
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
            style="cursor: pointer"
            @click="multipleSolidTask(ft)"
            @contextmenu.prevent="openFtNewTab(ft)"
          >
            <td>{{ ft.count + " - " + ft.general.name }}</td>
            <td>
              <template v-for="data of getFTExtraData(ft.count)">
                <MiniUserBadge
                  v-if="data"
                  :key="data"
                  :team="data"
                  @click.native.stop="clickBadge(ft, data)"
                ></MiniUserBadge>
              </template>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <v-snackbar v-model="snack.active" :timeout="snack.timeout">
      {{ snack.feedbackMessage }}
    </v-snackbar>
    <p>Nombres de FTs : {{ FTs.length }}</p>
  </div>
</template>

<script>
import { Snack } from "~/utils/models/snack";
import MiniUserBadge from "~/components/atoms/MiniUserBadge.vue";

export default {
  name: "ListFT",
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
    missingRolesOnFTs() {
      return this.$accessor.assignment.missingRolesOnFTs;
    },
  },

  methods: {
    getFTExtraData(FTID) {
      return this.missingRolesOnFTs[FTID] ?? [];
    },
    openFtNewTab(ft) {
      window.open(`/ft/${ft.count}`, "_blank");
    },

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
