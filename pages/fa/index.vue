<template>
  <div>
    <h1>Fiche Animation 🎉</h1>

    <v-container style="display: grid; width: 100%; margin: auto">
      <v-row>
        <v-col md="2">
          <v-container style="padding: 0">
            <v-card>
              <v-card-title>Filters</v-card-title>
              <v-card-text>
                <v-text-field v-model="search" label="recherche">
                </v-text-field>

                <v-list shaped style="font-size: 10px">
                  <v-list-item-group v-model="selectedStatus">
                    <v-list-item>
                      <v-list-item-title class="small">Tous</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title class="small">Draft</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title class="small"
                        >Soumise</v-list-item-title
                      >
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title class="small"
                        >Refusée
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title class="small"
                        >Walidée
                      </v-list-item-title>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>

                <br />
                <v-select
                  v-model="selectedTeam"
                  label="équipe"
                  :items="getConfig('teams').map((e) => e.name)"
                ></v-select>
              </v-card-text>
            </v-card>
          </v-container>
        </v-col>

        <v-col md="10">
          <v-data-table
            :headers="headers"
            :items="selectedFAs"
            :items-per-page="20"
            class="elevation-1"
          >
            <template #[`item.action`]="row">
              <tr>
                <td>
                  <v-btn
                    class="mx-2"
                    icon
                    small
                    @click="onItemSelected(row.item)"
                  >
                    <v-icon small>mdi-circle-edit-outline</v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>

            <template #[`item.status`]="row">
              <v-avatar
                v-if="row.item"
                :color="color[row.item.status]"
                size="20"
              ></v-avatar>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>

    <v-btn color="secondary" elevation="2" fab to="/fa/newFA" class="fab-right">
      <v-icon> mdi-plus-thick </v-icon>
    </v-btn>
  </div>
</template>

<script>
import { getConfig } from "../../common/role";
import Fuse from "fuse.js";

export default {
  name: "Fa",
  data() {
    return {
      FAs: [],
      itemsPerPageArray: [4, 8, 12],
      search: undefined,
      filter: {},
      sortDesc: false,
      page: 1,
      itemsPerPage: 4,
      sortBy: "name",
      selectedStatus: 0,
      selectedTeam: undefined,
      headers: [
        { text: "status", value: "status" },
        { text: "nom", value: "general.name" },
        { text: "equipe", value: "general.team" },
        { text: "Resp", value: "general.inCharge.username" },
        { text: "action", value: "action" },
      ],
      color: {
        submitted: "warning",
        validated: "green",
        refused: "red",
        draft: "grey",
        undefined: "grey",
      },
    };
  },

  computed: {
    numberOfPages() {
      return Math.ceil(this.items.length / this.itemsPerPage);
    },

    selectedFAs() {
      let mFAs = this.filterByStatus(this.FAs, this.selectedStatus);
      mFAs = this.filterBySelectedTeam(mFAs, this.selectedTeam);
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
    // get FAs
    this.FAs = (await this.$axios.get("/FA")).data;
  },

  methods: {
    getConfig(key) {
      return getConfig(this, key);
    },

    filterBySelectedTeam(FAs, team) {
      if (team === undefined) {
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

    onItemSelected(item) {
      this.$router.push({ path: "fa/" + item.count });
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
  },
};
</script>

<style scoped>
.fab-right {
  position: absolute;
  right: 10px;
  bottom: 10px;
}

.small {
  font-size: small;
  margin-left: 0;
}
</style>
