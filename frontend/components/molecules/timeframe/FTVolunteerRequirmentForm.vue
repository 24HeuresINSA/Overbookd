<template>
  <div>
    <v-card class="form-card">
      <v-card-title>
        <span class="headline">Ajouter un orga ou un team</span>
      </v-card-title>

      <v-card-text>
        <h3>Ajouter un orga</h3>
        <SearchUsers
          v-model="userRequests"
          :label="`Rechercher un orga`"
        ></SearchUsers>

        <h3>Ajouter une team</h3>
        <SearchTeam
          v-model="teamRequests"
          :label="`Rechercher une team`"
        ></SearchTeam>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="confirmVolunteerRequirment"
          >Sauvegarder</v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SearchTeam from "~/components/atoms/SearchTeam.vue";
import SearchUsers from "~/components/atoms/SearchUsers.vue";
import { FT, FTTimeWindow } from "~/utils/models/ft";

export default Vue.extend({
  name: "FTVolunteerRequirmentForm",
  components: { SearchUsers, SearchTeam },
  model: {
    prop: "timeWindow",
    event: "change",
  },
  props: {
    timeWindow: {
      type: Object,
      default: () => null,
    },
  },
  data: () => ({
    userRequests: [],
    teamRequests: [],
  }),
  computed: {
    mFT(): FT {
      return this.$accessor.FT.mFT;
    },
    mTimeWindow(): FTTimeWindow {
      return {
        ...this.timeWindow,
        userRequests: this.userRequests,
        teamRequests: this.teamRequests,
      };
    },
    manifDate(): string {
      return this.$accessor.config.getConfig("event_date");
    },
  },
  watch: {
    timeWindow() {
      this.updateLocalVariable();
    },
  },
  async mounted() {
    this.updateLocalVariable();
  },
  methods: {
    updateLocalVariable() {},
    confirmVolunteerRequirment() {
      this.$emit("change", this.mTimeWindow);
    },
  },
});
</script>

<style lang="scss" scoped>
.form-card {
  display: flex;
  flex-direction: column;

  .row {
    display: flex;
    flex-direction: row;
    margin-top: 3px;
    margin-bottom: 7px;

    .v-text-field {
      margin: 0 24px;
    }
  }
}
</style>
