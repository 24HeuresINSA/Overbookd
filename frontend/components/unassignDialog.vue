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
              <v-chip v-for="user in assignedUsersToSelectedTimeSpan" small>{{
                user
              }}</v-chip>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" text :href="`/ft/${selectedTimeSpan.FTID}`"
        >FT</v-btn
      >
      <v-spacer></v-spacer>
      <v-btn color="warning" text @click="unassign">DEAFFECTER</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "UnassignDialog",
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
      return this.$accessor.assignment.assignedUsersToSelectedTimeSpan;
    },
  },
  methods: {
    async unassign() {
      await this.$accessor.assignment.unassign(
        this.$accessor.assignment.selectedTimeSpan._id
      );
      this.$emit("close-dialog");
    },
    closeDialog() {
      this.$emit("close-dialog");
    },
  },
};
</script>

<style scoped></style>
