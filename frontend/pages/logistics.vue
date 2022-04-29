<template>
  <div>
    <v-container>
      <h1>La Log 🚚 (work in progress 🔨)</h1>
      <br />
      <Tabs>
        <Tab name="Matos FA" selected>
          <v-row sm="20" align="center" dense>
            <v-col cols="11">
              <v-select
                v-model="selectedItem"
                label="Filtrer par:"
                :items="equipPerTimeFrame.map((e) => e.name)"
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
            :items="equipPerTimeFrame.map((e) => e.name)"
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
          value: "parsedStart",
        },
        {
          text: "fin",
          value: "parsedEnd",
        },
        {
          text: "action",
          value: "action",
        },
      ],
      headersFA: [
        {
          text: "status",
          value: "FA.status",
        },
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
          value: "parsedStart",
        },
        {
          text: "Fin",
          value: "parsedEnd",
        },
        {
          text: "Manque?",
          value: "conflict",
        },
      ],
      search: {
        name: "",
        location: [],
        type: "",
      },
      equipPerTimeFrame: [],
      equipmentNames: [],
      conflicts: [],
      inventory: [],
      selectedItem: "none",
      color: {
        submitted: "grey",
        validated: "green",
        refused: "red",
      },
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
        return this.equipPerTimeFrame;
      }
      return this.equipPerTimeFrame.filter((e) => e.name === this.selectedItem);
    },
  },

  async mounted() {
    if (this.hasRole("log")) {
      const { data: FAs } = await this.$axios.get("/fa");
      console.log(FAs);
      FAs.forEach((FA) => {
        if (FA.equipments) {
          FA.equipments.forEach((FAequipment) => {
            if (FA.timeframes) {
              if (this.equipmentNames.indexOf(FAequipment.name) == -1) {
                this.equipmentNames.push(FAequipment.name);
              }

              FA.timeframes.forEach((timeframe) => {
                let dS = new Date(timeframe.start);
                let dE = new Date(timeframe.end);
                let conf = "";
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
                this.equipPerTimeFrame.push({
                  name: FAequipment.name,
                  start: timeframe.start,
                  end: timeframe.end,
                  parsedStart: dS,
                  parsedEnd: dE,
                  amount: FAequipment.required,
                  conflict: conf,
                  FA: {
                    id: FA._id,
                    name: FA.general.name,
                    count: FA.count,
                    status: FA.status,
                  },
                });
              });
            }
          });
        }
      });
      console.log(this.equipmentNames);
      this.computeAllConflicts();
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

    async redirectToFA(item) {
      await this.$router.push({
        path: "/fa/" + item.FA.count,
      });
    },

    colorize(status) {
      console.log(status);
      if (status == "submitted") {
        return this.color.submitted;
      } else if (status == "validated") {
        return this.color.validated;
      } else if (status == "refused") {
        return this.color.refused;
      }
    },

    computeUsage(equipmentName) {
      // Array of objects with the following footprint: [requested_amount, [equipIndex]].
      // Index represents a 2-hour period starting from the week before the manif
      // [equipIndex] is a list of all the equipments responsible for incrementation

      let equipmentConflicts = [];
      // List of all the timeframes where a specific equipment is requested
      let allEquipmentSlots = this.equipPerTimeFrame
        // We want to keep a trace of who's at fault
        .map((equipment, index) => {
          return [equipment, index];
        });
      // We only want the current equipment
      allEquipmentSlots = allEquipmentSlots.filter(
        (elem) => elem[0].name == equipmentName
      );

      let magicNumber = 7200000;
      let tenthOfMay = 1652140800000;
      allEquipmentSlots.forEach((equipment) => {
        let diff = Math.ceil(
          (equipment[0].end - equipment[0].start) / magicNumber
        );
        let tabStart = Math.ceil(
          (equipment[0].start - tenthOfMay) / magicNumber
        );
        for (let i = tabStart; i < tabStart + diff; i++) {
          if (equipmentConflicts[i] != undefined) {
            equipmentConflicts[i][1].push(equipment[1]);
            equipmentConflicts[i][0] += equipment[0].amount;
          } else {
            equipmentConflicts[i] = [equipment[0].amount, [equipment[1]]];
          }
        }
      });

      return equipmentConflicts;
    },

    async computeAllConflicts() {
      this.inventory = (await this.$axios.$get("/equipment")).filter(
        (e) => e.isValid !== false
      );
      console.log("inv:", this.inventory);

      this.equipmentNames.forEach((name) => {
        let invIndex = this.inventory.findIndex((item) => item.name == name);
        if (invIndex != -1) {
          let conflict = this.computeUsage(name);
          conflict.forEach((period) => {
            if (period[0] > this.inventory[invIndex].amount) {
              period[1].forEach((index) => {
                this.equipPerTimeFrame[index].conflict = "Conflit";
              });
            }
          });
          this.conflicts.push([name, conflict]);
        }
      });
    },
    hasRole(roles) {
      return this.$accessor.user.hasRole(roles);
    }
  },
};
</script>

<style scoped></style>
