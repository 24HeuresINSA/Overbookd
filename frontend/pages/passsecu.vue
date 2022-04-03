<template>
  <div>
    <v-row>
      <v-col md="2">
        <v-card>
          <v-card-title>
            <span class="headline">Export</span>
          </v-card-title>
          <v-card-text>
            <v-btn text @click="exportCSV">Exporter les pass</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col md="10">
        <v-data-table
          :headers="headers"
          :items="pass"
          dense
          :items-per-page="-1"
        >
          <template #[`item.fullname`]="{ item }">
            {{ item.fullname }}
          </template>
          <template #[`item.phone`]="{ item }">
            {{ item.phone }}
          </template>
          <template #[`item.email`]="{ item }">
            {{ item.email }}
          </template>
          <template #[`item.licensePlate`]="{ item }">
            {{ item.licensePlate }}
          </template>
          <template #[`item.timeslot`]="{ item }">
            <div v-for="slot in item.timeslot" :key="slot">
              {{ slot }}
              <br />
            </div>
          </template>
          <template #[`item.comment`]="{ item }">
            {{ item.comment }}
          </template>
          <template #[`item.linkedFA`]="{ item }">
            <a target="_blank" :href="`/fa/${item.linkedFA}`">{{
              item.linkedFA
            }}</a>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { values } from "lodash";
import Vue from "vue";
import { Header } from "~/utils/models/Data";

interface Data {
  headers: Header[];
  pass: any[];
}

export default Vue.extend({
  name: "PassSecu",
  data(): Data {
    return {
      headers: [
        { text: "Nom", value: "fullname", width: "15%" },
        { text: "Tél", value: "phone" },
        { text: "Mail", value: "email", width: "10%" },
        {
          text: "Plaque",
          value: "licensePlate",
          width: "10%",
          sortable: false,
        },
        { text: "Horaire", value: "timeslot", sortable: false, width: "15%" },
        {
          text: "Commentaire",
          value: "comment",
          width: "30%",
          sortable: false,
        },
        { text: "FA", value: "linkedFA", width: "5%" },
      ],
      pass: [],
    };
  },

  async beforeMount() {
    if (this.$accessor.user.hasRole("secu")) {
      await this.getAllPassSecu();
    } else {
      await this.$router.push({
        path: "/",
      });
    }
  },

  methods: {
    async getAllPassSecu() {
      this.pass = (await this.$axios.get("/passsecu")).data;
    },
    download(filename: string, text: string) {
      // We use the 'a' HTML element to incorporate file generation into
      // the browser rather than server-side
      const element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(text)
      );
      element.setAttribute("download", filename);

      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },

    async exportCSV() {
      // Parse data into a CSV string to be passed to the download function
      let csv =
        "Email;ID;Nom Prenom;Pass_entite;Imatriculation;Vendredi 18-20;Vendredi 20-5;Samedi 5-20;Samedi 20-5;Dimanche 5-20;Dimanche 20-00;PS1;PS2;PS3;PS4;PS5;FA;comment \n";
      for (let i = 0; i < this.pass.length; i++) {
        csv +=
          this.pass[i].email +
          ";" +
          i +
          ";" +
          this.pass[i].fullname +
          ";;" +
          this.pass[i].licensePlate +
          ";" +
          (this.pass[i].timeslot
            ? this.pass[i].timeslot.includes("Vendredi 18h-20h")
            : "false") +
          ";" +
          (this.pass[i].timeslot
            ? this.pass[i].timeslot.includes("vendredi 20h-5h")
            : "false") +
          ";" +
          (this.pass[i].timeslot
            ? this.pass[i].timeslot.includes("samedi 5h-20h")
            : "false") +
          ";" +
          (this.pass[i].timeslot
            ? this.pass[i].timeslot.includes("samedi 20h-5h")
            : "false") +
          ";" +
          (this.pass[i].timeslot
            ? this.pass[i].timeslot.includes("dimanche 5h-20h")
            : "false") +
          ";" +
          (this.pass[i].timeslot
            ? this.pass[i].timeslot.includes("dicmanche 20h-00h")
            : "false") +
          ";;;;;;" +
          this.pass[i].linkedFA +
          ";" +
          this.pass[i].comment +
          "\n";
      }

      const regex = new RegExp(/undefined/i, "g");

      let parsedCSV = csv.replaceAll(regex, "");
      // Prompt the browser to start file download
      this.download("passsecu.csv", parsedCSV);
    },
  },
});
</script>
