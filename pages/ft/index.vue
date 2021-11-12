<template>
  <div>
    <h1>Fiche Tache 👻</h1>
    <v-data-table :headers="headers" :items="FTs">
      <template #[`item.status`]="row">
        <v-avatar size="25" :color="color[row.item.status]">
          {{ row.item.count }}
        </v-avatar>
      </template>
      <template #[`item.action`]="row">
        <v-btn style="margin: 5px" icon small :to="'/ft/' + row.item.count">
          <v-icon small>mdi-link</v-icon>
        </v-btn>
        <v-btn
          icon
          small
          @click="
            mFT = row.item;
            isDialogOpen = true;
          "
        >
          <v-icon small>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <v-dialog v-model="isDialogOpen" width="600">
      <v-card>
        <v-img src="sure.jpeg"></v-img>
        <v-card-title>t'es sûr bébé ?</v-card-title>
        <v-card-actions>
          <v-btn right text @click="deleteFT()">oui 😏</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
const { hasRole } = require("../../common/role");
import { safeCall } from "../../utils/api/calls";
import ftRepo from "../../repositories/ftRepo";

export default {
  name: "Index",
  data() {
    return {
      color: {
        undefined: "grey",
        submitted: "orange",
        validated: "green",
        refused: "red",
      },

      headers: [
        {
          text: "Status",
          value: "status",
        },
        {
          text: "Nom",
          value: "general.name",
        },
        {
          text: "Resp",
          value: "general.inCharge.username",
        },
        {
          text: "Action",
          value: "action",
        },
      ],

      FTs: [],

      mFT: undefined,
      isDialogOpen: false,
    };
  },

  async mounted() {
    if (hasRole(this, "hard")) {
      this.FTs = (await this.$axios.$get("/FT")).data.filter(
        (ft) => ft.isValid !== false
      );
    } else {
      await this.$router.push({
        path: "/",
      });
    }
  },

  methods: {
    async deleteFT() {
      await safeCall(this.$store, ftRepo.deleteFT(this, this.mFT), "FT del");
      this.FTs = this.FTs.filter((ft) => ft.count !== this.mFT.count);
      this.isDialogOpen = false;
    },
  },
};
</script>

<style scoped></style>
