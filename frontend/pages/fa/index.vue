<template>
  <div>
    <h1>Fiches Activités</h1>

    <v-container style="display: grid; width: 100%; margin: 0">
      <v-row>
        <v-col md="3">
          <v-container style="padding: 0">
            <v-card>
              <v-card-title>Filtres</v-card-title>
              <v-card-text>
                <v-text-field v-model="search" label="Recherche" dense>
                </v-text-field>

                <v-select
                  v-model="selectedTeam"
                  label="Équipe"
                  :items="getConfig('teams').map((e) => e.name)"
                  clearable
                  dense
                ></v-select>

                <v-list dense shaped>
                  <v-list-item-group v-model="selectedStatus">
                    <v-list-item>
                      <v-list-item-title class="small">Tous</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title class="small"
                        >Brouillon</v-list-item-title
                      >
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title class="small"
                        >Soumise
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title class="small"
                        >Refusée
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title class="small"
                        >Validée
                      </v-list-item-title>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
                <div v-for="validator of validators" :key="validator">
                  <v-btn-toggle
                    v-model="filter[validator]"
                    tile
                    color="deep-purple accent-3"
                    group
                  >
                    <v-icon small>{{ getTeamIcon(validator) }}</v-icon>
                    <v-btn
                      x-small
                      :value="true"
                      style="padding-right: 2px; padding-left: 2px"
                      >validée
                    </v-btn>
                    <v-btn
                      x-small
                      :value="false"
                      style="padding-right: 2px; padding-left: 2px"
                      >refusée
                    </v-btn>
                    <v-btn
                      x-small
                      :value="2"
                      style="padding-right: 2px; padding-left: 2px"
                      >à valider
                    </v-btn>
                  </v-btn-toggle>
                </div>
                <v-switch
                  v-if="isAdmin"
                  v-model="isDeletedFilter"
                  label="Afficher les FA supprimées"
                ></v-switch>
                <v-btn text @click="exportCSV">Télécharger ces FA</v-btn>
              </v-card-text>
            </v-card>
          </v-container>
        </v-col>

        <v-col md="9">
          <v-data-table
            :headers="headers"
            :items="selectedFAs"
            :footer-props="{'items-per-page-options': [20, 100, -1]}"
            class="elevation-1"
          >
            <template #[`item.validation`]="{ item }">
              <ValidatorsIcons :form="item"></ValidatorsIcons>
            </template>
            <template #item.general.name="{ item }">
              <a
                :href="`/fa/${item.count}`"
                :style="
                  item.isValid === false
                    ? `text-decoration:line-through;`
                    : `text-decoration:none;`
                "
                >{{ item.general ? item.general.name : "" }}</a
              >
            </template>
            <template #[`item.action`]="row">
              <tr>
                <td>
                  <v-btn
                    class="mx-2"
                    icon
                    small
                    :href="`/fa/${row.item.count}`"
                  >
                    <v-icon small>mdi-circle-edit-outline</v-icon>
                  </v-btn>
                  <v-btn class="mx-2" icon small @click="preDelete(row.item)">
                    <v-icon small>mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>

            <template #[`item.status`]="row">
              <v-chip v-if="row.item" :color="color[row.item.status]" small
                >{{ row.item.count }}
              </v-chip>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="isNewFADialogOpen" max-width="600">
      <v-card>
        <v-card-title>Ajouter une nouvelle FA</v-card-title>
        <v-card-text>
          <v-text-field v-model="faName" label="Nom de la FA"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="createNewFA">crée la FA</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isDeleteFAOpen" max-width="600">
      <v-card>
        <v-card-title>Supprimer une FA</v-card-title>
        <v-card-text> Voulez-vous vraiment supprimer cette FA ?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="deleteFA">supprimer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-btn
      elevation="2"
      fab
      style="right: 20px; bottom: 45px; position: fixed"
      color="primary"
      small
      @click="isNewFADialogOpen = true"
    >
      <v-icon small> mdi-plus-thick</v-icon>
    </v-btn>
  </div>
</template>

<script>
import Fuse from "fuse.js";
import { safeCall } from "../../utils/api/calls";
import { RepoFactory } from "../../repositories/repoFactory";
import ValidatorsIcons from "../../components/atoms/validators-icons";
import { hasRole } from "../../common/role";

export default {
  name: "Fa",
  components: { ValidatorsIcons },
  data() {
    return {
      FAs: [],
      mFA: null,
      search: undefined,
      filter: {},
      isDeletedFilter: false, // true if deleted FAs are displayed
      sortDesc: false,
      page: 1,
      itemsPerPage: 4,
      selectedStatus: 0,
      selectedTeam: undefined,
      validators: [],
      headers: [
        { text: "Statut", value: "status" },
        { text: "Validation", value: "validation" },
        { text: "Nom", value: "general.name" },
        { text: "Equipe", value: "general.team" },
        { text: "Resp", value: "general.inCharge.username" },
        { text: "Action", value: "action" },
      ],
      color: {
        submitted: "warning",
        validated: "green",
        refused: "red",
        draft: "grey",
        undefined: "grey",
      },

      isNewFADialogOpen: false,
      isDeleteFAOpen: false,
      faName: undefined,
    };
  },

  computed: {
    numberOfPages() {
      return Math.ceil(this.items.length / this.itemsPerPage);
    },

    isAdmin() {
      return this.$accessor.user.hasRole("admin");
    },
    selectedFAs() {
      let mFAs = this.filterByStatus(this.FAs, this.selectedStatus);
      mFAs = this.filterByDeletedStatus(mFAs);
      mFAs = this.filterBySelectedTeam(mFAs, this.selectedTeam);
      mFAs = this.filterByValidatorStatus(mFAs);
      const options = {
        // Search in `author` and in `tags` array
        keys: ["general.name", "details.description"],
      };
      const fuse = new Fuse(mFAs, options);
      if (this.search === undefined || this.search === "") {
        return mFAs;
      }
      return fuse.search(this.search).map((e) => e.item);
    },
  },
  async mounted() {
    if (this.$accessor.user.hasRole("hard")) {
      this.validators = this.$accessor.config.getConfig("fa_validators");
      // get FAs
      const res = await safeCall(
        this.$store,
        RepoFactory.faRepo.getAllFAs(this)
      );
      if (res) {
        this.FAs = res.data;
      } else {
        alert("error");
      }
    } else {
      await this.$router.push({
        path: "/",
      });
    }
  },

  methods: {
    preDelete(fa) {
      this.mFA = fa;
      this.isDeleteFAOpen = true;
    },

    getConfig(key) {
      return this.$accessor.config.getConfig(key);
    },

    getTeamIcon(team) {
      return this.$accessor.config.getTeamIcon(team);
    },

    filterBySelectedTeam(FAs, team) {
      if (!team) {
        return FAs;
      }
      return FAs.filter((FA) => {
        if (FA.general && FA.general.team) {
          return FA.general.team === team;
        } else {
          return false;
        }
      });
    },

    filterByDeletedStatus(FAs) {
      if (this.isDeletedFilter === false) {
        return FAs.filter((FA) => FA.isValid !== false);
      }
      return FAs.filter((FA) => FA.isValid === false);
    },

    filterByValidatorStatus(FAs) {
      const filter = this.filter;
      Object.entries(filter).forEach(([validator, value]) => {
        FAs = FAs.filter((FA) => {
          if (value === true) {
            return FA.validated.includes(validator);
          } else if (value === false) {
            return FA.refused.includes(validator);
          } else if (value === 2) {
            return (
              !FA.validated.includes(validator) && FA.status === "submitted"
            );
          }
          return true;
        });
      });
      return FAs;
    },

    filterByStatus(FAs, status) {
      if (status === 0) {
        return FAs;
      }
      const s = ["", "draft", "submitted", "refused", "validated"];
      FAs = FAs.map((FA) => {
        if (FA) {
          if (FA.status === undefined) {
            FA.status = "draft";
          }
        }
        return FA;
      });
      return FAs.filter((FA) => FA?.status === s[status]);
    },

    async createNewFA() {
      if (!this.faName) {
        return;
      }
      const FA = {
        general: {
          name: this.faName,
        },
      };
      const res = await safeCall(
        this.$store,
        RepoFactory.faRepo.createNewFA(this, FA),
        "FA created 🥳"
      );
      if (res) {
        await this.$router.push({ path: "fa/" + res.count });
      }
    },
    async deleteFA() {
      const res = await safeCall(
        this.$store,
        RepoFactory.faRepo.deleteFA(this, this.mFA),
        "FA deleted 🥳",
        "FA not deleted 😢"
      );
      if (res) {
        this.FAs = this.FAs.filter((e) => e.count !== this.mFA.count);
        this.isDeleteFAOpen = false;
        this.mFA = undefined;
      }
    },

    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1;
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number;
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
      element.click();
    },

    parseHeaders(rawHeaders, prefix) {
      let header = rawHeaders.next();
      let str = "";

      while (!header.done) {
        if (typeof header.value == "string") {
          str += prefix + header.value + "|";
        } else {
          str += prefix + header.value.key + "|";
        }
        header = rawHeaders.next();
      }
      return str;
    },

    // Turns a unique (FA, equipment, timeframe) tuple into a CSV line
    chunkToLine(FA, headers, valid, equipment, start, end) {
      let csv = [];

      headers.forEach((header, index) => {
        header = header.split(".");
        //console.log(header);
        try {
          if (header.length == 2) {
            if (Array.isArray(FA[header[0]])) {
              let length = FA[header[0]].length;
              for (let i = 0; i < length; i++) {
                csv[i + index] = FA[header[0]][i][header[1]];
              }
            } else {
              csv[index] = FA[header[0]][header[1]];
            }
          } else if (header.length == 3) {
            csv[index] = FA[header[0]][header[1]][header[2]];
          } else {
            csv[index] = FA[header];
          }
        } catch (TypeError) {
          csv[index] = undefined;
        }
      });

      if (typeof equipment != "string") {
        csv[headers.length - 1] = equipment.name;
        csv[headers.length] = start;
        csv[headers.length + 1] = end;
        csv[headers.length + 2] = equipment.required;
      } else {
        csv[headers.length - 1] = equipment;
        csv[headers.length] = start;
        csv[headers.length + 1] = end;
        csv[headers.length + 2] = 0;
      }

      for (let i = 0; i < 6; i++) csv[i + 3 + headers.length] = valid[i];

      return csv.join("|") + "\n";
    },

    // Splits a FA into a CSV line for every timeframe and every equipment
    faToCSV(FA, headers, validStatuses) {
      let csv = "";

      if (FA.timeframes.length == 0 && FA.equipments.length == 0) {
        csv += this.chunkToLine(
          FA,
          headers,
          validStatuses,
          "Aucun équipement",
          "N/A",
          "N/A"
        );
      } else if (FA.timeframes.length == 0) {
        FA.equipments.forEach((equipment) => {
          csv += this.chunkToLine(
            FA,
            headers,
            validStatuses,
            equipment,
            "N/A",
            "N/A"
          );
        });
      } else if (FA.equipments.length == 0) {
        FA.timeframes.forEach((timeframe) => {
          let dS = new Date(timeframe.start);
          let dE = new Date(timeframe.end);
          dS =
            [dS.getMonth() + 1, dS.getDate(), dS.getFullYear()].join("/") +
            " " +
            [dS.getHours(), dS.getMinutes(), dS.getSeconds()].join(":");
          dE =
            [dE.getMonth() + 1, dE.getDate(), dE.getFullYear()].join("/") +
            " " +
            [dE.getHours(), dE.getMinutes(), dE.getSeconds()].join(":");

          csv += this.chunkToLine(
            FA,
            headers,
            validStatuses,
            "Aucun équipement",
            dS,
            dS
          );
        });
      } else {
        FA.timeframes.forEach((timeframe) => {
          FA.equipments.forEach((equipment) => {
            let dS = new Date(timeframe.start);
            let dE = new Date(timeframe.end);
            dS =
              [dS.getMonth() + 1, dS.getDate(), dS.getFullYear()].join("/") +
              " " +
              [dS.getHours(), dS.getMinutes(), dS.getSeconds()].join(":");
            dE =
              [dE.getMonth() + 1, dE.getDate(), dE.getFullYear()].join("/") +
              " " +
              [dE.getHours(), dE.getMinutes(), dE.getSeconds()].join(":");

            csv += this.chunkToLine(
              FA,
              headers,
              validStatuses,
              equipment,
              dS,
              dE
            );
          });
        });
      }
      return csv;
    },

    // Gets config, generates headers, builds CSV and sends it off to download.
    async exportCSV() {
      let csv = "";
      let headers = "";

      let forms = [
        [this.$accessor.config.getConfig("fa_general_form"), "general."],
        [this.$accessor.config.getConfig("fa_external_form"), "external."],
        [this.$accessor.config.getConfig("fa_details_form"), "details."],
        [this.$accessor.config.getConfig("fa_security_form"), "security."],
        [this.$accessor.config.getConfig("fa_water_form"), "elec."],
        [
          this.$accessor.config.getConfig("fa_signalisation_form"),
          "signalisation.",
        ],
      ];

      forms.forEach((form) => {
        headers += this.parseHeaders(form[0].values(), form[1]);
      });

      headers = headers.replaceAll(
        "general.inCharge",
        "general.inCharge.username"
      );

      const FAs = this.selectedFAs;
      let validators = this.$accessor.config.getConfig("fa_validators");
      csv += headers + "equipment|début|fin|qté|" + validators.join("|") + "\n";

      FAs.forEach((FA) => {
        let validStatuses = [];
        validators.forEach((validator, index) => {
          if (FA.validated.includes(validator)) {
            validStatuses[index] = "oui";
          } else if (validator in FA.refused) {
            validStatuses[index] = "non";
          } else {
            validStatuses[index] = "n/a";
          }
        });

        csv += this.faToCSV(FA, headers.split("|"), validStatuses);
      });

      const regex = new RegExp(/undefined/i, "g");

      let parsedCSV = csv.replaceAll(regex, "@");
      // Prompt the browser to start file download
      this.download("choucroute.csv", parsedCSV);
    },
  },
};
</script>

<style scoped>
.fab-right {
  position: sticky;
  right: 10px;
  bottom: 35px;
}

.small {
  font-size: small;
  margin-left: 0;
}
</style>
