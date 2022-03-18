<template>
  <v-card v-if="selectedTimeSpan" max-width="600">
    <v-card-title>FT {{ mFT.count }} - {{ mFT.general.name }}</v-card-title>
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
              <a :href="`/ft/${selectedTimeSpan.FTID}`">{{
                selectedTimeSpan.FTID
              }}</a>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" :href="`/ft/${selectedTimeSpan.FTID}`">FT</v-btn>
      <v-spacer></v-spacer>
      <v-btn color="warning">DEAFFECTER</v-btn>
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
      return;
    },
  },
};
</script>

<style scoped></style>
