<template>
  <div>
    <h1>Fiche Tache 👻</h1>

    <v-container style="display: grid; width: 100%; margin: 0">
      <v-row>
        <v-col md="3">
          <v-card>
            <v-card-title>Filtres</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="filters.search"
                label="recherche"
              ></v-text-field>
              <v-select
                v-model="filters.teams"
                label="Équipe"
                :items="getConfig('teams').map((e) => e.name)"
                clearable
                dense
              ></v-select>
              <label>Status</label>
              <v-btn-toggle
                v-model="filters.status"
                tile
                style="flex-direction: column"
                color="deep-purple accent-3"
                group
              >
                <v-btn x-small value="draft">Draft</v-btn>
                <v-btn x-small value="submitted">Soumise</v-btn>
                <v-btn x-small value="refused">Refusé</v-btn>
                <v-btn x-small value="validated">Validé</v-btn>
                <v-btn x-small value="ready">Prêt a affectation</v-btn>
              </v-btn-toggle>
              <v-switch
                v-model="filters.isDeleted"
                label="FT supprimées"
              ></v-switch>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col md="9">
          <v-data-table
            :headers="headers"
            :items="filteredFTs"
            sort-by="count"
            :items-per-page="20"
            :loading="loading"
          >
            <template #item.general.name="{ item }">
              <a
                :href="`/ft/${item.count}`"
                :style="
                  item.isValid === false
                    ? `text-decoration:line-through;`
                    : `text-decoration:none;`
                "
                >{{ item.general ? item.general.name : "" }}</a
              >
            </template>
            <template #[`item.FA`]="row">
              <v-chip v-if="row.item.FA && row.item.FA > 0" small>
                {{ row.item.FA }}
              </v-chip>
            </template>
            <template #[`item.status`]="row">
              <v-chip small :color="color[row.item.status]">
                {{ row.item.count }}
              </v-chip>
            </template>
            <template #item.validation="{ item }">
              <ValidatorsIcons
                :form="item"
                validators-key="ft_validators"
              ></ValidatorsIcons>
            </template>
            <template #[`item.action`]="row">
              <v-btn
                style="margin: 5px"
                icon
                small
                :href="'/ft/' + row.item.count"
              >
                <v-icon small>mdi-link</v-icon>
              </v-btn>
              <v-btn
                v-if="row.item.isValid !== false"
                icon
                small
                @click="
                  mFT = row.item;
                  isDeleteDialogOpen = true;
                "
              >
                <v-icon small>mdi-delete</v-icon>
              </v-btn>
              <v-btn
                v-else
                icon
                small
                @click="
                  mFT = row.item;
                  isRestoreDialogOpen = true;
                "
                ><v-icon small>mdi-delete-restore</v-icon></v-btn
              >
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>

    <v-btn
      color="secondary"
      elevation="2"
      fab
      class="fab-right"
      @click="isNewFTDialogOpen = true"
    >
      <v-icon> mdi-plus-thick</v-icon>
    </v-btn>

    <v-dialog v-model="isNewFTDialogOpen" width="600">
      <v-card>
        <v-card-title>Crée une nouvelle FT</v-card-title>
        <v-card-subtitle>Cette FT n'est relié a aucune FT</v-card-subtitle>
        <v-card-text>
          <v-text-field v-model="FTName" label="Nom de la FT"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn :disabled="!FTName" @click="createNewFT"
            >Crée une nouvelle FT</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isDeleteDialogOpen" width="600">
      <v-card>
        <v-img src="sure.jpeg"></v-img>
        <v-card-title>t'es sûr bébé ?</v-card-title>
        <v-card-actions>
          <v-btn right text @click="deleteFT()">oui 😏</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isRestoreDialogOpen" width="600">
      <v-card>
        <v-img src="sure.jpeg"></v-img>
        <v-card-title>t'es sûr bébé ?</v-card-title>
        <v-card-actions>
          <v-btn right text @click="restoreFT()">oui 😏</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <SnackNotificationContainer></SnackNotificationContainer>
  </div>

  <!-- snack bar -->
</template>

<script lang="ts">
import { safeCall } from "~/utils/api/calls";
import ftRepo from "../../repositories/ftRepo";
import { Header } from "~/utils/models/Data";
import Vue from "vue";
import { FT } from "~/utils/models/FT";
import Fuse from "fuse.js";
import ValidatorsIcons from "~/components/atoms/validators-icons.vue";
import SnackNotificationContainer from "~/components/molecules/snackNotificationContainer.vue";
import userRepo from "~/repositories/userRepo";
import faRepo from "~/repositories/faRepo";
import { SnackNotif } from "~/utils/models/store";

interface Data {
  color: { [key: string]: string };
  headers: Header[];
  FTs: any[];
  mFT: any;
  isDeleteDialogOpen: boolean;
  isRestoreDialogOpen: boolean;
  isNewFTDialogOpen: boolean;
  FTName: string;
  users: any[] | undefined;
  FAs: any[] | undefined;
  loading: boolean;
  notifs: { [key: string]: SnackNotif };

  filters: {
    search: string;
    teams: string;
    isDeleted: boolean;
    status: string;
  };
}

const color = {
  undefined: "grey",
  draft: "grey",
  submitted: "orange",
  validated: "green",
  refused: "red",
  ready: "#bf2bbd",
};

export default Vue.extend({
  name: "Index",
  components: { ValidatorsIcons, SnackNotificationContainer },
  data(): Data {
    return {
      color,
      headers: [
        {
          text: "Status",
          value: "status",
        },
        { text: "Validation", value: "validation" },
        {
          text: "Nom",
          value: "general.name",
        },
        {
          text: "FA",
          value: "FA",
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
      FTName: "",
      FTs: [],
      filters: {
        search: "",
        teams: "",
        status: "",
        isDeleted: false,
      },
      mFT: undefined,
      isRestoreDialogOpen: false,
      isDeleteDialogOpen: false,
      isNewFTDialogOpen: false,
      users: undefined,
      FAs: undefined,
      loading: true,
      notifs: { serverError: { type: "error", message: "erreur serveur" } },
    };
  },

  computed: {
    filteredFTs(): FT[] {
      let res = this.FTs;
      const { FTs, filters } = this;
      const { search, teams, isDeleted, status } = filters;

      if (isDeleted) {
        res = res.filter((e) => e.isValid === false);
      } else {
        res = res.filter((e) => e.isValid !== false); // DO NOT CHANGE THIS LINE
      }
      if (teams) {
        res = res.filter((ft) => {
          // if db did not answer
          if (!this.users || !this.FAs) {
            this.$accessor.notif.pushNotification(this.notifs.serverError);
            return true;
          }
          // if FA is not set do not select
          if (!ft.FA) {
            return false;
          }
          const fa = this.FAs.find((fa) => fa.count == ft.FA);
          // if FA fetching failed or if fa does not have a team
          if (!fa || !fa.general.team) {
            return false;
          }
          // returns if fa team is the good one or not
          return teams == fa.general.team;
        });
      }
      const fuse = new Fuse(res, {
        keys: ["general.name"],
        threshold: 0.0,
      });
      if (search) {
        res = fuse.search(search).map((e) => e.item);
      }
      if (status) {
        res = res.filter((e) => e.status === status);
      }
      return res;
    },
  },

  async mounted() {
    if (this.hasRole("hard")) {
      let res = await safeCall(this.$store, ftRepo.getAllFTs(this));
      if (res) {
        this.FTs = res.data.data; // includes deleted FTs
      }
      res = await safeCall(this.$store, userRepo.getAllUsers(this));
      if (res) {
        this.users = res.data;
      }
      res = await safeCall(this.$store, faRepo.getAllFAs(this));
      if (res) {
        this.FAs = res.data;
      }
    } else {
      await this.$router.push({
        path: "/",
      });
    }
    this.loading = false;
  },

  methods: {
    hasRole(role: string) {
      return this.$accessor.user.hasRole(role);
    },

    getConfig(key: string) {
      return this.$accessor.config.getConfig(key);
    },

    async createNewFT() {
      const blankFT: Partial<FT> = {
        status: "draft",
        general: {
          name: this.FTName,
        },
        details: {},
        equipments: [],
        timeframes: [],
        validated: [],
        refused: [],
        comments: [],
      };
      let res = await safeCall(
        this.$store,
        ftRepo.createFT(this, blankFT),
        "sent"
      );
      if (res) {
        await this.$router.push({
          path: "/ft/" + res.data.count,
        });
      }
    },

    async deleteFT() {
      const res = await safeCall(
        this.$store,
        ftRepo.deleteFT(this, this.mFT),
        "sent",
        "server"
      );
      if (res) {
        const index = this.FTs.findIndex((ft) => ft._id == this.mFT._id);
        this.FTs[index].isValid = false;
        this.FTs.splice(index, 1, this.FTs[index]); // update vue rendering
      }
      this.isDeleteDialogOpen = false;
    },
    /**
     * Restore mFT
     */
    async restoreFT() {
      // switch FT to valid
      this.mFT.isValid = true;
      // call update on backend
      const res = await safeCall(
        this.$store,
        ftRepo.updateFT(this, this.mFT),
        "sent",
        "server"
      );
      // if success
      if (res) {
        // update current version
        const index = this.FTs.findIndex((ft) => ft._id == this.mFT._id);
        this.FTs[index].isValid = true;
        this.FTs.splice(index, 1, this.FTs[index]); // update vue rendering
      }
      // close dialog
      this.isRestoreDialogOpen = false;
    },
  },
});
</script>

<style scoped></style>
