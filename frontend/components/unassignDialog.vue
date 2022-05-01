<template>
  <v-card v-if="selectedTimeSpan" max-width="600">
    <v-card-title>
      <v-btn icon dark @click="closeDialog">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      FT {{ mFT.count }} - {{ mFT.general.name }}
    </v-card-title>
    <v-card-text>
      <v-simple-table>
        <tbody>
          <tr>
            <td>Debut</td>
            <td>{{ selectedTimeSpan.start.toLocaleString() }}</td>
          </tr>
          <tr>
            <td>Fin</td>
            <td>{{ selectedTimeSpan.end.toLocaleString() }}</td>
          </tr>
          <tr>
            <td>FT</td>
            <td>
              {{ mFT.general.name }}
            </td>
          </tr>
          <tr>
            <td>Numero</td>
            <td>
              <a :href="`/ft/${selectedTimeSpan.FTID}`">{{
                selectedTimeSpan.FTID
              }}</a>
            </td>
          </tr>
          <tr>
            <td>Lieu</td>
            <td>
              <div v-if="mFT.details !== undefined">
                <div v-for="location in mFT.details.locations" :key="location">
                  {{ location }} <br />
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>Affecté</td>
            <td>
              <v-chip
                v-for="user in assignedUsersToSelectedTimeSpan"
                :key="user._id"
                small
                close
                style="cursor: pointer"
                @click:close="unassign(user)"
                @click.right="calendar(user)"
              >
                {{ user.firstname }} {{ user.lastname }}
              </v-chip>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-card-text>
    <Loader :loading="isWaitingForResponse"></Loader>
  </v-card>
</template>

<script>
import Loader from "./atoms/Loader.vue";
export default {
  name: "UnassignDialog",
  components: { Loader },
  computed: {
    selectedTimeSpan() {
      return this.$accessor.assignment.selectedTimeSpan;
    },
    FTs() {
      return this.$accessor.assignment.FTs;
    },
    // eslint-disable-next-line vue/return-in-computed-property
    mFT() {
      if (this.FTs) {
        return this.FTs.find((FT) => FT.count === this.selectedTimeSpan.FTID);
      }
    },
    assignedUsersToSelectedTimeSpan() {
      return this.$accessor.assignment.userAssignedToSameTimespan;
    },
    isWaitingForResponse() {
      return this.$accessor.assignment.isWaitingForResponse;
    },
  },
  methods: {
    async unassign(user) {
      await this.$accessor.assignment.unassign(user.timespanId);
      this.$emit("close-dialog");
    },
    closeDialog() {
      this.$emit("close-dialog");
    },
    calendar(user) {
      window.open(`/calendar/${user._id}`, "_blank");
    },
  },
};
</script>

<style scoped></style>
