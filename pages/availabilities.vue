<template>
  <div>
    <h2>Mes disponibilités</h2>
    <p>{{ detailMessage }}</p>

    <br />
    <h2>Mes point de charisme: {{ userCharisma }}/{{ maxCharisma }}</h2>
    <v-progress-linear height="25" :value="(userCharisma / maxCharisma) * 100">
      <template #default="{ value }">
        <strong>{{ Math.ceil(value) }}%</strong>
      </template>
    </v-progress-linear>

    <template v-for="(availability, index) in availabilities">
      <br />
      <h3>{{ availability.name }}</h3>
      <p>{{ availability.description }}</p>
      <v-btn
        v-if="hasEditRole"
        :key="availability.name"
        @click="openDayDialog(availability)"
        >ajouter une journe
      </v-btn>
      <div style="display: flex">
        <v-container v-for="(day, index) in availability.days" :key="index">
          <v-card v-if="hasRole(availability.role)" width="400px">
            <v-card-title
              >{{ new Date(day.date).toLocaleDateString() }}
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item v-for="(frame, i2) in day.frames" :key="i2">
                  <v-list-item-content>
                    <h4>{{ frame.start }} ➡️ {{ frame.end }}</h4>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-list-item-action-text
                      style="display: flex; align-items: center"
                    >
                      <v-chip v-if="frame.charisma" style="margin-right: 10px"
                        >{{ frame.charisma }}
                      </v-chip>
                      <v-switch v-model="frame.isSelected"></v-switch>
                    </v-list-item-action-text>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card-text>
            <v-card-actions>
              <v-btn text @click="toggleAll(day)">selectionner tous</v-btn>
              <v-btn
                v-if="hasEditRole"
                text
                @click="openTimeframeDialog(availability, day)"
                >ajouter un creneau</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-container>
      </div>
    </template>

    <v-btn fab style="bottom: 40px; position: fixed; right: 100px" @click="save"
      ><v-icon>mdi-content-save</v-icon></v-btn
    >

    <v-btn
      v-if="hasEditRole"
      color="secondary"
      elevation="2"
      fab
      style="bottom: 40px; position: fixed; right: 20px"
      @click="isDialogOpen = true"
    >
      <v-icon> mdi-plus-thick </v-icon>
    </v-btn>

    <v-snackbar v-model="isSnackbarOpen" timeout="5000">
      disponibilite mis a jour 🚀

      <template #action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="isSnackbarOpen = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <v-dialog v-model="isDialogOpen" max-width="600">
      <v-card>
        <v-card-title>Ajouter des dispo 📆</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newAvailability.name"
            label="Titre"
          ></v-text-field>
          <v-text-field
            v-model="newAvailability.description"
            label="Desciption"
          ></v-text-field>
          <v-select
            v-model="newAvailability.role"
            label="qui peut voir ces dispo?"
            :items="getConfig('teams').map((e) => e.name)"
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="addAvailability()"
            ><v-icon>mdi-content-save</v-icon></v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isDayDialogOpen" max-width="600">
      <v-card>
        <v-card-title>Ajouter une journe</v-card-title>
        <v-card-text>
          <v-date-picker v-model="newDay"></v-date-picker>
        </v-card-text>
        <v-card-actions>
          <v-btn left text @click="addDay()">ajouter</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isTimeframeDialog" max-width="1000">
      <v-card>
        <v-card-title>Ajouter une creneau</v-card-title>
        <v-card-text>
          <v-time-picker v-model="newTimeframe.start"></v-time-picker>
          <v-time-picker v-model="newTimeframe.end"></v-time-picker>
          <v-text-field
            v-model="newTimeframe.charisma"
            label="charisme"
            type="number"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn v-if="hasEditRole" left text @click="addTimeframe()"
            >ajouter creneau</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { getConfig, getUser, hasRole } from "../common/role";

export default {
  name: "Availabilities",

  data() {
    return {
      detailMessage: this.getConfig("availabilities_description"),
      userCharisma: this.$accessor.user.me.charisma,
      maxCharisma: this.getConfig("max_charisma"),
      availabilities: [],
      isAllToggled: false,
      isSnackbarOpen: false,
      isDialogOpen: false,
      isDayDialogOpen: false,
      hasEditRole: hasRole(
        this,
        this.getConfig(this, "add_availabilities_roles")
      ),
      newDay: undefined,
      selectedAvailability: false,
      selectedDate: undefined,
      isTimeframeDialog: false,
      newAvailability: {
        name: undefined,
        description: undefined,
        role: undefined,
      },
      newTimeframe: {
        start: undefined,
        end: undefined,
        charisma: undefined,
      },
    };
  },

  async mounted() {
    this.availabilities = (await this.$axios.get("/availabilities")).data;
    const mAvailabilities = this.getUser().availabilities;
    if (mAvailabilities) {
      // fill in availabilities\
      this.availabilities.forEach((availability) => {
        let mAvailability = mAvailabilities.find(
          (e) => e._id === availability._id
        );
        if (mAvailability) {
          this.$set(availability, "days", mAvailability.days);
        }
      });
    }
  },

  methods: {
    async addAvailability() {
      await this.$axios.post("/availabilities", this.newAvailability);
      this.isDialogOpen = false;
      this.isSnackbarOpen = true;
    },

    openDayDialog(availability) {
      this.isDayDialogOpen = true;
      this.selectedAvailability = availability;
    },

    openTimeframeDialog(availability, date) {
      this.isTimeframeDialog = true;
      this.selectedAvailability = availability;
      this.selectedDate = date;
    },

    async addTimeframe() {
      let mAvailability = this.selectedAvailability;
      let day = mAvailability.days.find((day) => day === this.selectedDate);
      if (day.frames === undefined) {
        day.frames = [];
      }
      day.frames.push(this.newTimeframe);
      await this.$axios.put("/availabilities", mAvailability);
    },

    async addDay() {
      let mAvailability = this.selectedAvailability;
      if (mAvailability.days === undefined) {
        mAvailability.days = [];
      }
      mAvailability.days.push({
        date: this.newDay,
      });
      await this.$axios.put("/availabilities", mAvailability);
    },

    hasRole(role) {
      return hasRole(this, role);
    },

    getConfig(key) {
      return this.$accessor.config.getConfig(key);
    },

    toggleAll(day) {
      day.frames.forEach((frame) => (frame.isSelected = this.isAllToggled));
      this.isAllToggled = !this.isAllToggled;
    },

    getUser() {
      return getUser(this);
    },

    save() {
      // compute new charisma
      const me = this.$accessor.user.me;
      let charisma = 0;
      if (me.charisma !== undefined) {
        charisma = me.charisma;
      }

      let oldCharisma = 0;
      me.availabilities.forEach((availability) => {
        availability.days.forEach((day) => {
          if (day.frames) {
            day.frames.forEach((frame) => {
              if (frame.isSelected) {
                oldCharisma += +frame.charisma;
              }
            });
          }
        });
      });

      this.availabilities.forEach((availability) => {
        availability.days.forEach((day) => {
          if (day.frames) {
            day.frames.forEach((frame) => {
              if (frame.isSelected) {
                charisma += +frame.charisma;
              }
            });
          }
        });
      });

      charisma = charisma - oldCharisma;

      this.$accessor.user.updateUser({
        userId: me._id,
        userData: {
          availabilities: this.availabilities,
          charisma,
        },
      });
      this.isSnackbarOpen = true;
    },
  },
};
</script>

<style scoped></style>
