<template>
  <v-card>
    <v-data-table
      v-model="selectedItems"
      :headers="headers"
      :items="tableItems"
      class="elevation-1"
      group-by="date"
      :show-select="!editorMode"
      disable-pagination
      dense
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>
            <v-icon>mdi-clock-outline</v-icon>
            <span class="title"> {{ timeslots[0].groupTitle }}</span>
            <br />
            <span class="text-caption">
              {{ timeslots[0].groupDescription }}</span
            >
          </v-toolbar-title>
          <v-spacer></v-spacer>

          <TimeslotDialog ref="dialog" :timeslot="editedItem"></TimeslotDialog>
        </v-toolbar>
      </template>
      <template #[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil</v-icon>
        <v-icon small @click="$refs.confirmDeleteSingle.open()">
          mdi-delete
        </v-icon>
        <ConfirmDialog ref="confirmDeleteSingle" @confirm="removeItem(item)"
          >Le créneau sera supprimé de façon <b>irreversible</b> !
        </ConfirmDialog>
      </template>
      <template
        v-if="!editorMode"
        #[`item.data-table-select`]="{ isSelected, select, item }"
      >
        <v-simple-checkbox
          v-if="item.isSelected"
          :value="item.isSelected"
          color="primary"
          :disabled="item.off"
        ></v-simple-checkbox>
        <v-simple-checkbox
          v-else
          :value="isSelected"
          color="primary"
          @input="select($event)"
        ></v-simple-checkbox>
      </template>
      <template #[`group.header`]="{ group, headers, toggle, isOpen }">
        <td :colspan="headers.length">
          <v-btn :ref="group" small icon :data-open="isOpen" @click="toggle">
            <v-icon v-if="isOpen">mdi-chevron-up</v-icon>
            <v-icon v-else>mdi-chevron-down</v-icon>
          </v-btn>
          {{ group }}
        </td>
      </template>
      <template #[`footer.prepend`]>
        <v-row class="justify-space-around mx-2 my-4">
          <v-btn v-if="editorMode" color="error" @click="askConfirmDelete">
            <v-icon left> mdi-plus</v-icon>
            Supprimer le tableau
          </v-btn>
          <v-dialog v-model="dialog" persistent max-width="500px">
            <template #activator="{ on }">
              <v-btn v-if="editorMode" color="success" v-on="on">
                <v-icon left> mdi-plus</v-icon>
                Ajouter un créneau
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">Ajouter un créneau</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-form ref="form" v-model="valid">
                    <v-row>
                      <v-col>
                        <v-text-field
                          v-model="charisma"
                          type="number"
                          label="Charisme"
                          single-line
                          :rules="charismaRules"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <OverDatePicker
                          label="Date de début"
                          @update:date="dayStart = $event"
                        >
                        </OverDatePicker>
                        <OverDatePicker
                          label="Date de fin"
                          @update:date="dayEnd = $event"
                        >
                        </OverDatePicker>
                      </v-col>
                      <v-col>
                        <OverTimePicker
                          label="Heure de début"
                          @update:time="hourStart = $event"
                        ></OverTimePicker>
                        <OverTimePicker
                          label="Heure de fin"
                          @update:time="hourEnd = $event"
                        ></OverTimePicker>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="dialog = false"
                  >Cancel
                </v-btn>
                <v-btn color="primary" text @click="addTimeslot()">Add</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
        <ConfirmDialog ref="confirmDelete" @confirm="removeTable"
          >Les créneaux sont supprimés de façon <b>irreversible.</b>
        </ConfirmDialog>
        <div v-if="!editorMode">
          <v-btn color="success" @click="$refs.confirm.open()">
            <v-icon left> mdi-plus</v-icon>
            Valider mes disponibilités
          </v-btn>
          <ConfirmDialog ref="confirm" @confirm="acceptSelection()"
            >Les créneaux que tu as choisis deviendront
            <b>non modifiable !</b></ConfirmDialog
          >
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import TimeslotDialog from "~/components/atoms/TimeslotDialog.vue";
import ConfirmDialog from "~/components/atoms/ConfirmDialog.vue";
import { Timeslot } from "utils/models/repo";
import OverDatePicker from "../../atoms/OverDatePicker.vue";
import OverTimePicker from "../../atoms/OverTimePicker.vue";

export default Vue.extend({
  name: "TimeslotTable",
  components: {
    TimeslotDialog,
    ConfirmDialog,
    OverDatePicker,
    OverTimePicker,
  },
  props: {
    groupTitle: {
      type: String,
      required: true,
    },
    editorMode: {
      type: Boolean,
      default: false,
    },
  },
  data(): any {
    return {
      editedIndex: -1,
      editedItem: {
        id: "",
        groupTitle: "",
        start: "",
        end: "",
        date: "",
      },
      selectedItems: [],
      authorizedEditor: ["admin", "humain", "bural"],
      dialog: false,
      hourStart: "",
      hourEnd: "",
      dayStart: "",
      dayEnd: "",
      charisma: 10,
      valid: false,
      charismaRules: [
        (v: any) => !!v || "Charisma is required",
        (v: any) => (v && v >= 0) || "Charisma must be greater than 0",
      ],
    };
  },
  computed: {
    tableItems(): any {
      return this.timeslots
        .map((timeslot: Timeslot) => {
          return {
            id: timeslot._id,
            name: timeslot.groupTitle,
            start:
              this.padTime(new Date(timeslot.timeFrame.start).getHours()) +
              ":" +
              this.padTime(new Date(timeslot.timeFrame.start).getMinutes()),
            end:
              this.padTime(new Date(timeslot.timeFrame.end).getHours()) +
              ":" +
              this.padTime(new Date(timeslot.timeFrame.end).getMinutes()),
            date:
              new Date(timeslot.timeFrame.start).getFullYear() +
              "-" +
              String(
                new Date(timeslot.timeFrame.start).getMonth() + 1
              ).padStart(2, "0") +
              "-" +
              String(new Date(timeslot.timeFrame.start).getDate()).padStart(
                2,
                "0"
              ) +
              " " +
              new Date(timeslot.timeFrame.start).toLocaleDateString("fr-fr", {
                weekday: "long",
              }),
            charisma: timeslot.charisma,
            isSelected: this.$accessor.user.me.availabilities.includes(
              timeslot._id
            ),
            off: this.userSelectedAvailabilities.includes(timeslot._id),
          };
        })
        .sort((a: any, b: any) =>
          a.start.toLowerCase() < b.start.toLowerCase() ? -1 : 1
        );
    },
    timeslots(): Timeslot[] {
      return this.$accessor.timeslot.getTimeslotsByGroupTitle(this.groupTitle);
    },
    roles(): string[] {
      return this.$accessor.user.me.team;
    },
    userSelectedAvailabilities(): any {
      return this.$accessor.user.me.availabilities;
    },
    headers(): any {
      const h = [
        {
          text: "Heure de début",
          value: "start",
          sortable: false,
        },
        {
          text: "Heure de fin",
          value: "end",
          sortable: false,
        },
        {
          text: "Date",
          value: "date",
        },
        {
          text: "Charisme",
          value: "charisma",
          sortable: false,
        },
      ];
      if (this.editorMode) {
        h.push({ text: "Actions", value: "actions", sortable: false });
      }
      return h;
    },
  },
  mounted() {
    Object.keys(this.$refs).forEach((k) => {
      if (this.$refs[k] && (this.$refs[k] as any).$attrs["data-open"]) {
        (this.$refs[k] as any).$el.click();
      }
    });
  },
  methods: {
    async editItem(item: any): Promise<void> {
      this.editedIndex = this.tableItems.indexOf(item);
      this.editedItem = Object.assign({}, item);
      await Vue.nextTick();
      this.$refs.dialog.open();
    },
    async enterSelect() {
      this.$emit("select", this.selectedItems);
    },
    async acceptSelection() {
      if (this.selectedItems.length == 0) return;
      const ids = this.selectedItems.map((item: any) => item.id);
      await this.$store.dispatch("user/acceptSelection", ids);

      let charismaMessage = "";
      const charisma = this.$accessor.user.me.charisma;
      if (charisma) {
        if (charisma < 100) {
          charismaMessage =
            " Snif, tu n'as pas coché beaucoup de créneaux," +
            " ton charisme est assez faible pour le moment," +
            " il t'en faudrait plus si tu veux faire bénévole." +
            " Promis on ne t'affectera pas sur toutes tes dispo ";
        } else if (charisma >= 100 && charisma < 150) {
          charismaMessage =
            " C'est pas mal, mais tu es sûr que tu n'as pas d'autres dispo ?" +
            " Ton charisme est faible pour le moment, il t'en faudrait plus si" +
            " tu veux être sûr de faire bénévole. Rappelle-toi aussi qu'on ne" +
            " t'affectera pas sur toutes tes dispo, on te laissera du temps promis ";
        } else if (charisma >= 150 && charisma < 200) {
          charismaMessage =
            " Cool tu mis pas mal de dispo, mais tu es sûr que tu n'as pas encore" +
            " quelques autres dispo pour venir nous aider ? Rappelle-toi aussi qu'on" +
            " ne t'affectera pas sur toutes tes dispo, on te laissera du temps promis";
        } else {
          charismaMessage =
            " Au top ! Tu as mis plein de créneau, motive tes potes à faire pareil" +
            " et n'oublie pas que tu peux toujours en rajouter si tu veux nous aider" +
            " encore plus !";
        }
      } else {
        charismaMessage = "Tu n'as pas de charismes ?...";
      }
      //dont need complex message if the user is a hard
      charismaMessage = this.$accessor.user.hasPermission("hard")
        ? "Créneaux selectionnés validés"
        : charismaMessage;
      this.$store.dispatch("timeslot/setCreateStatus", charismaMessage);
      this.selectedItems = [];
    },
    async removeItem(item: any) {
      await this.$store.dispatch("timeslot/deleteTimeslot", item.id);
    },
    async removeTable() {
      await this.$accessor.timeslot.deleteByGroupTitle(this.groupTitle);
    },
    padTime(time: number): string {
      if (time < 10) {
        return "0" + time;
      }
      return time + "";
    },
    async askConfirmDelete() {
      (this.$refs.confirmDelete as any).open();
    },
    async addTimeslot() {
      this.$refs.form.validate();
      /* eslint no-constant-condition: "off" */
      if (!this.valid) return;
      let start = new Date(this.dayStart + "T" + this.hourStart + ":00");
      const end = new Date(this.dayEnd + "T" + this.hourEnd + ":00");
      if (start.getTime() > end.getTime()) {
        await this.$store.dispatch(
          "timeslot/setCreateStatus",
          "La date de fin doit être supérieure à la date de début"
        );
        return;
      }
      let timeslot = [
        {
          timeFrame: {
            start: start,
            end: end,
          },
          groupTitle: this.groupTitle,
          groupDescription: this.timeslots[0].groupDescription,
          charisma: this.charisma,
        },
      ];
      await this.$store.dispatch("timeslot/addTimeslots", timeslot);
      this.dialog = false;
    },
  },
});
</script>

<style></style>
