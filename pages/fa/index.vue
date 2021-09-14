<template>
  <div>
    <h1>Fiche Anim 🎉</h1>

    <v-container style="display: grid">
      <v-row>
        <v-col cols="2">
          <v-container style="padding: 0">
            <v-card>
              <v-card-title>Filters</v-card-title>
              <v-card-text>
                <v-text-field label="recherche" v-model="search">
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
                        >refuse</v-list-item-title
                      >
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title class="small"
                        >walidé</v-list-item-title
                      >
                    </v-list-item>
                  </v-list-item-group>
                </v-list>

                <br />
                <v-select
                  label="équipe"
                  v-model="selectedTeam"
                  :items="getConfig('teams').map((e) => e.name)"
                ></v-select>
              </v-card-text>
            </v-card>
          </v-container>
        </v-col>

        <v-col cols="10">
          <v-data-table
            :headers="headers"
            :items="selectedFAs"
            :items-per-page="5"
            class="elevation-1"
          >
            <template v-slot:[`item.action`]="row">
              <tr>
                <td>
                  <v-btn
                      class="mx-2"
                      icon
                      dark
                      small
                      color="primary"
                      @click="onItemSelected(row.item)"
                  >
                    <v-icon dark>mdi-circle-edit-outline</v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>

            <template v-slot:[`item.status`]="row">
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

export default {
  name: "fa",
  data() {
    return {
      FAs: [],
      itemsPerPageArray: [4, 8, 12],
      search: "",
      filter: {},
      sortDesc: false,
      page: 1,
      itemsPerPage: 4,
      sortBy: "name",
      selectedStatus: 0,
      selectedTeam: undefined,
      headers: [
        { text: "status", value: "status" },
        { text: "nom", value: "name" },
        { text: "equipe", value: "team" },
        { text: "Resp", value: "inCharge" },
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
      if (this.search === undefined) {
        return mFAs;
      } else {
        const s = this.search.toLowerCase();
        return mFAs.filter((FA) => FA?.name.toLowerCase().includes(s));
      }
    },
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
        if (FA.team) {
          return FA.team === team;
        } else {
          return false;
        }
      });
    },

    filterByStatus(FAs, status) {
      if (status === 0) {
        return FAs;
      }
      const s = ["", "draft", "submitted", "refused", "accepted"];
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
  async mounted() {
    // get FAs
    this.FAs = (await this.$axios.get("/FA")).data;
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
