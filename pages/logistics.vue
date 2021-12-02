<template>
  <div>
    <v-container>
      <h1>La Log 🚚 (work in progess 🔨)</h1>
      <br />
      <Tabs>
        <Tab name="Matos FA" selected>
          <v-row sm="20" align="center" dense>
            <v-col cols="11">
              <v-select
                v-model="selectedItem"
                label="Filtrer par:"
                :items="equipments.map((e) => e.name)"
              >
              </v-select>
            </v-col>
            <v-col>
              <v-btn color="white" icon @click="clearFilter">
                <v-icon>mdi-broom</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-data-table
            :headers="headersFA"
            :items="selectedEquipments"
            @click:row="redirectToFA"
          >
          </v-data-table>
        </Tab>
        <Tab name="Matos FT">
          <v-select
            v-model="selectedItem"
            label="item a verifier"
            :items="equipments.map((e) => e.name)"
          ></v-select>
          <v-data-table :headers="headersFT" :items="selectedEquipments">
            <template #[`item.action`]>
              <v-btn text>FT</v-btn>
              <v-btn color="green" icon>
                <v-icon>mdi-check</v-icon>
              </v-btn>
              <v-btn color="red" icon>
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </Tab>
        <Tab name="Calendritos"> </Tab>
      </Tabs>
    </v-container>
  </div>
</template>

<script>
import { hasRole } from "../common/role";
import Tab from "../components/atoms/tab.vue";
import Tabs from "../components/molecules/tabs.vue";

export default {
  name: "Logistics",
  components: {
    Tab,
    Tabs,
  },

  data() {
    return {
      headersFT: [
        {
          text: "FT",
          value: "FT.name",
        },
        {
          text: "Quantité Demandée",
          value: "amount",
        },
        {
          text: "date",
          value: "date",
        },
        {
          text: "debut",
          value: "start",
        },
        {
          text: "fin",
          value: "end",
        },
        {
          text: "action",
          value: "action",
        },
      ],
      headersFA: [
        {
          text: "FA",
          value: "FA.name",
        },
        {
          text: "Equipement",
          value: "name",
        },
        {
          text: "Quantité Demandée",
          value: "amount",
        },
        {
          text: "Début",
          value: "start",
        },
        {
          text: "Fin",
          value: "end",
        },
        {
          text: "Action",
          value: "action",
        },
      ],
      search: {
        name: "",
        location: [],
        type: "",
      },
      equipments: [],
      selectedItem: "none",
    };
  },

  computed: {
    me: () => this.$store.state.user.me,
    filteredInventory() {
      console.log(this.search.location);
      return this.inventory.filter((item) => {
        return (
          item.name.toLowerCase().includes(this.search.name.toLowerCase()) &&
          (this.search.location.length === 0 ||
            this.search.location.includes(item.location)) &&
          item.type.toLowerCase().includes(this.search.type.toLowerCase())
        );
      });
    },

    selectedEquipments() {
      if (this.selectedItem === "none") {
        return this.equipments;
      }

      return this.equipments.filter((e) => e.name === this.selectedItem);
    },
  },

  async mounted() {
    if (hasRole(this, "log")) {
      const { data: FAs } = await this.$axios.get("/fa");
      FAs.forEach((FA) => {
        if (FA.equipments) {
          FA.equipments.forEach((FAequipment) => {
            if (FA.timeframes) {
              FA.timeframes.forEach((timeframe) => {
                let dS = new Date(timeframe.start);
                let dE = new Date(timeframe.end);
                dS =
                  [dS.getMonth() + 1, dS.getDate(), dS.getFullYear()].join(
                    "/"
                  ) +
                  " " +
                  [dS.getHours(), dS.getMinutes(), dS.getSeconds()].join(":");
                dE =
                  [dE.getMonth() + 1, dE.getDate(), dE.getFullYear()].join(
                    "/"
                  ) +
                  " " +
                  [dE.getHours(), dE.getMinutes(), dE.getSeconds()].join(":");
                this.equipments.push({
                  name: FAequipment.name,
                  start: dS,
                  end: dE,
                  amount: FAequipment.required,
                  FA: {
                    id: FA._id,
                    name: FA.general.name,
                    count: FA.count,
                  },
                });
              });
            }
          });
        }
      });
      // FAs.forEach((FA) => {
      //   if (FA.equipments) {
      //     FA.equipments.forEach((FAequipment) => {
      //       let existingEquipment = this.equipments.find(
      //         (equipment) => equipment.name === FAequipment.name
      //       );
      //       if (existingEquipment) {
      //         existingEquipment.requested.push(
      //           FA.timeframes.map(({ start, end }) => {
      //             return {
      //               start,
      //               end,
      //               amount: FAequipment.requested,
      //               FA: {
      //                 id: FA._id,
      //                 name: FA.general.name,
      //               },
      //             };
      //           })
      //         );
      //       } else {
      //         if (FA.timeframes) {
      //           this.equipments.push({
      //             name: FAequipment.name,
      //             requested: FA.timeframes.map(({ start, end }) => {
      //               return {
      //                 start,
      //                 end,
      //                 amount: FAequipment.required,
      //                 FA: {
      //                   id: FA._id,
      //                   name: FA.general.name,
      //                 },
      //               };
      //             }),
      //           });
      //         }
      //       }
      //     });
      //   }
      // });
      // const {
      //   data: { data: FTs },
      // } = await this.$axios.get("/ft");
      // FTs.forEach((FT) => {
      //   if (FT.equipments) {
      //     FT.equipments.forEach((FTequipment) => {
      //       let existingEquipment = this.equipments.find(
      //         (equipment) => equipment.name === FTequipment.name
      //       );
      //       if (existingEquipment) {
      //         existingEquipment.requested.push(
      //           FT.schedules.map(({ date, start, end }) => {
      //             return {
      //               date,
      //               start,
      //               end,
      //               amount: FTequipment.selectedAmount,
      //               FT: {
      //                 id: FT._id,
      //                 name: FT.name,
      //               },
      //             };
      //           })
      //         );
      //       } else {
      //         if (FT.schedules) {
      //           this.equipments.push({
      //             name: FTequipment.name,
      //             requested: FT.schedules.map(({ date, start, end }) => {
      //               return {
      //                 date,
      //                 start,
      //                 end,
      //                 amount: FTequipment.selectedAmount,
      //                 FT: {
      //                   id: FT._id,
      //                   name: FT.name,
      //                 },
      //               };
      //             }),
      //           });
      //         }
      //       }
      //     });
      //   }

      console.log("requested:", this.equipments[2].requested);
    } else {
      await this.$router.push({
        path: "/",
      });
    }
  },

  methods: {
    getRandomInt() {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
    },

    clearFilter() {
      this.selectedItem = "none";
    },

    async redirectToFA(item, data) {
      await this.$router.push({
        path: "/fa/" + item.FA.count,
      });
    },

    download(filename, text) {
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
      let csv = "Nom;Validité;Type;COMBIEN?\n";

      const equipments = this.equipments;
      for (let i = 0; i < equipments.length; i++) {
        csv +=
          equipments[i].name +
          ";" +
          equipments[i].isValid +
          ";" +
          equipments[i].type +
          ";" +
          equipments[i].amount +
          ";" +
          "\n";
      }

      const regex = new RegExp(/undefined/i, "g");

      let parsedCSV = csv.replaceAll(regex, "");
      // Prompt the browser to start file download
      this.download("utilisateurs.csv", parsedCSV);
    },
  },
};
</script>

<style scoped></style>
