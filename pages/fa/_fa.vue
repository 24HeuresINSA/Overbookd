<template>
  <div>
    <div
      style="display: flex; justify-content: space-between; align-items: center"
    >
      <h1>Fiche Anime 🤯</h1>
      <h2 v-if="isNewFA">Create new FA</h2>
      <h2 v-if="FA.count">FA: {{ FA.count }}</h2>
      <h3>{{ FA.status ? FA.status : "draft" }}</h3>
      <v-icon
        v-for="(validator, i) of validators"
        :key="i"
        :color="validator.status ? color[validator.status] : 'grey'"
      >
        {{ validator.icon }}
      </v-icon>
    </div>
    <br />

    <OverForm :fields="form" @form-change="onFormChange"> </OverForm>

    <v-divider></v-divider>
    <h2>Horaires ⏱</h2>
    <v-simple-table v-if="FA.schedules">
      <template #default>
        <thead>
          <tr>
            <th class="text-left">jour</th>
            <th>debut</th>
            <th class="text-left">fin</th>
            <th class="text-left">action</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="schedule in FA.schedules"
            :key="schedule.day + schedule.start + schedule.end"
          >
            <td>{{ schedule.date }}</td>
            <td>{{ schedule.start }}</td>
            <td>{{ schedule.end }}</td>
            <td><v-btn @click="deleteSchedule(schedule)">🗑</v-btn></td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <v-container style="display: grid">
      <v-row>
        <v-col>
          <h3>Date</h3>
        </v-col>
        <v-col>
          <h3>Debut</h3>
        </v-col>
        <v-col>
          <h3>Fin</h3>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-date-picker
            v-model="schedule.date"
            first-day-of-week="1"
          ></v-date-picker>
        </v-col>
        <v-col>
          <v-time-picker
            v-model="schedule.start"
            :allowed-minutes="allowedMinutes"
            format="24hr"
          ></v-time-picker>
        </v-col>
        <v-col>
          <v-time-picker
            v-model="schedule.end"
            :allowed-minutes="allowedMinutes"
            format="24hr"
          ></v-time-picker>
        </v-col>
        <v-btn fab style="margin: 20px" @click="addSchedule">
          <v-icon> mdi-plus-thick </v-icon>
        </v-btn>
      </v-row>
    </v-container>

    <v-divider></v-divider>
    <h2>Matos 🚚</h2>
    <v-data-table :headers="equipmentsHeader" :items="selectedEquipments">
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Equipments</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            dark
            class="mb-2"
            @click="dialogModifySelectedItem = true"
          >
            Add new equipment
          </v-btn>
        </v-toolbar>
      </template>
    </v-data-table>

    <v-divider></v-divider>
    <h2>Comments</h2>
    <v-simple-table v-if="FA.comments">
      <template #default>
        <thead>
          <tr>
            <th class="text-left">validateur</th>
            <th>autheur</th>
            <th class="text-left">commentaire</th>
            <th class="text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="comment in FA.comments" :key="comment.time">
            <td>
              <v-icon :color="color[comment.action]">{{
                getIcon(comment)
              }}</v-icon>
            </td>
            <td>{{ comment.by }}</td>
            <td>{{ comment.comment }}</td>
            <td>{{ new Date(comment.time).toLocaleString() }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <h4 v-else>
      pas de commentaire pour l'instant il faut se mettre au charbon
    </h4>

    <br />
    <v-divider></v-divider>
    <h2>Fiche tâche 🤩</h2>
    <v-data-table :headers="FTHeader" :items="FA.FTs">
      <template #[`item.action`]="item">
        <v-btn :href="'/ft/' + item.item._id">
          <v-icon>mdi-link</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <v-text-field v-model="FTname" label="nom de la FT*"></v-text-field>
    <v-btn @click="addFT">ajouter une FT</v-btn>

    <div style="height: 100px"></div>

    <div
      style="
        display: flex;
        justify-content: space-evenly;
        position: sticky;
        bottom: 20px;
      "
    >
      <v-btn v-if="getValidator()" color="green" @click="validate()"
        >validate
      </v-btn>
      <v-btn v-if="getValidator()" color="red" @click="dialogValidator = true"
        >refuse
      </v-btn>
      <v-btn color="secondary" @click="dialog = true"
        >soumettre à validation
      </v-btn>
      <v-btn color="warning" @click="saveFA">sauvgarder 💾</v-btn>
    </div>

    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-img
          height="620"
          src="https://media.discordapp.net/attachments/726537148119122023/806793684598128640/WhatsApp_Image_2021-02-03_at_23.36.35.jpeg"
        ></v-img>

        <v-card-title class="text-h5 grey lighten-2">
          ⚠️ Warning ⚠️
        </v-card-title>

        <v-card-text>
          {{ dialogText }}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="submitForReview"> Submit </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogValidator" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Refuse FA</span>
        </v-card-title>
        <v-card-text>
          <h4>pourquoi c'est de la 💩</h4>
          <p>sans trop de 🧂</p>
          <v-text-field v-model="refuseComment" required></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="refuse"> Submit </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogModifySelectedItem">
      <v-card>
        <v-card-title>
          <span class="text-h5">Ajouter un nouveau item</span>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="equipmentsHeader"
            :items="availableEquipments"
          >
            <template #[`item.amount`]="props">
              {{
                +(props.item.borrowed
                  ? props.item.borrowed
                      .map((i) => i.amount)
                      .reduce((a, e) => +a + +e, 0)
                  : 0) + +props.item.amount
              }}
            </template>
            <template #[`item.selected`]="props">
              <v-text-field
                v-model="props.item.selected"
                type="number"
              ></v-text-field>
            </template>
          </v-data-table>
          <v-text-field
            v-model="requestedEquipment"
            label="Demander un material non present sur la liste"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="saveItems"> save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="isSnackbar" :timeout="5000">
      {{ snackbarMessage }}

      <template #action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="isSnackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import OverForm from "../../components/overForm";

export default {
  name: "Fa",
  components: { OverForm },

  data() {
    return {
      FAID: this.$route.params.fa,
      isNewFA: this.$route.params.faID === "newFA",
      FA: {},
      dialog: false,
      dialogValidator: false,
      dialogModifySelectedItem: false,
      requestedEquipment: undefined,
      refuseComment: "",
      isSnackbar: false,
      snackbarMessage: "la FA a bien ete sauvgarder 😅",
      dialogText: this.getConfig("fb_confirm_submit"),
      validators: this.getConfig("fa_validators"),
      FTname: undefined,
      schedule: {
        date: undefined,
        start: undefined,
        end: undefined,
      },
      color: {
        submitted: "grey",
        validated: "green",
        refused: "red",
      },
      form: this.getConfig("fa_form"), // FA form settings
      availableEquipments: [],
      selectedEquipments: [],
      equipmentsHeader: [
        {
          text: "name",
          value: "name",
        },
        {
          text: "disponible",
          value: "amount",
        },
        {
          text: "sélectionner",
          value: "selected",
        },
      ],
      FTHeader: [
        { text: "nom", value: "name" },
        { text: "action", value: "action" },
      ],
    };
  },
  async mounted() {
    // getFormConfig
    const teamField = this.form.find((field) => field.key === "team");
    if (teamField) {
      teamField.options = this.getConfig("teams").map((team) => team.name);
    }
    this.availableEquipments = await this.$axios.$get("/equipment");

    if (!this.isNewFA) {
      this.FA = (await this.fetchFAbyID(this.FAID)).data;
      // update the form that is going to be displayed
      Object.keys(this.FA).forEach((key) => {
        let mField = this.form.find((field) => field.key === key);
        if (mField) {
          this.$set(mField, "value", this.FA[key]);
          mField.value = this.FA[key];
        }
      });

      if (this.FA.equipments) {
        // update equipments
        this.selectedEquipments = this.FA.equipments;
      }

      // update validator status
      if (this.FA.refused) {
        this.FA.refused.forEach((v) => {
          let refuse = this.validators.find((e) => e.name === v);
          console.log(refuse);
          this.$set(refuse, "status", "refused");
        });
      }

      if (this.FA.validated) {
        this.FA.validated.forEach((v) => {
          let refuse = this.validators.find((e) => e.name === v);
          this.$set(refuse, "status", "validated");
        });
      }
    }
  },

  methods: {
    getUser() {
      return this.$store.state.user.data;
    },

    hasRole(role) {
      const teams = this.getUser()?.team;
      if (teams === undefined) {
        return false;
      }
      return teams.includes(role);
    },

    async fetchFAbyID(id) {
      return this.$axios.get("fa/" + id);
    },

    getIcon(comment) {
      let mValidator = this.validators.find(
        (v) => v.name === comment.validator
      );
      if (mValidator) {
        return mValidator.icon;
      }
    },

    allowedMinutes: (m) => m % 15 === 0,

    async saveFA() {
      // save the FA in the DB
      this.FA.equipments = this.selectedEquipments;
      if (this.isNewFA) {
        await this.$axios.post("/fa", this.FA);
      } else {
        await this.$axios.put("/fa", this.FA);
      }
      this.isSnackbar = true;
    },

    deleteSchedule(schedule) {
      this.FA.schedules = this.FA.schedules.filter((s) => {
        return (
          s.date !== schedule.date &&
          s.end !== schedule.end &&
          s.start !== schedule.start
        );
      });
    },

    getValidator() {
      let mValidator = null;
      this.validators.forEach((validator) => {
        if (this.hasRole(validator.name)) {
          mValidator = validator.name;
        }
      });
      return mValidator;
    },

    submitForReview() {
      // change status to submitted for review and save in DB
      this.FA.status = "submitted";
      this.dialog = false;
      this.saveFA();
    },

    validate() {
      const validator = this.getValidator();
      if (this.FA.validated === undefined) {
        this.FA.validated = [];
      }
      if (this.FA.refused) {
        this.FA.refused = this.FA.refused.filter((e) => e !== validator);
      }
      this.addComment("validated");

      this.FA.validated.push(validator);

      if (this.FA.validated.length === this.validators.length) {
        this.FA.status = "validated";
        this.addComment("accepted");
      }
      this.dialog = false;
      this.saveFA();
    },

    refuse() {
      // refuse FA
      const validator = this.getValidator();
      if (this.FA.refused === undefined) {
        this.FA.refused = [];
      }
      this.addComment("refused", this.refuseComment);
      this.FA.refused.push(validator);
      this.FA.status = "refused";
      this.dialogValidator = false;
      this.saveFA();
    },

    addComment(action, comment) {
      if (!this.FA.comments) {
        this.FA.comments = [];
      }
      this.FA.comments.unshift({
        time: new Date(),
        action,
        comment,
        by: this.getUser().nickname
          ? this.getUser().nickname
          : this.getUser().lastname,
        validator: this.getValidator(),
      });
    },

    addSchedule() {
      if (!this.FA.schedules) {
        this.$set(this.FA, "schedules", []);
      }
      this.$set(this.FA.schedules, this.FA.schedules.length, {
        ...this.schedule,
      });
    },

    saveItems() {
      this.selectedEquipments = this.availableEquipments.filter(
        (equipment) => equipment.selected
      );
      this.dialogModifySelectedItem = false;
    },

    onFormChange(form) {
      const count = this.FA.count;
      this.FA = form;
      this.FA.count = count;
    },

    getConfig(key) {
      return this.$store.state.config.data.data.find((e) => e.key === key)
        .value;
    },

    async addFT() {
      if (!this.FA.FTs) {
        this.FA.FTs = [];
      }
      const FT = (await this.$axios.post("/FT", { name: this.FTname })).data;
      this.FA.FTs.push(FT._id);
      await this.saveFA();
      await this.$router.push({
        path: "/ft/" + FT._id,
      });
    },
  },
};
</script>

<style scoped></style>
