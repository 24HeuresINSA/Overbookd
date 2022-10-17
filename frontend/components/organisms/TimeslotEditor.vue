<template>
  <v-card>
    <v-data-table
      v-model="selectedItems"
      :headers="headers"
      :items="tableItems"
      class="elevation-1"
      group-by="date"
      :show-select="true"
      disable-pagination
      dense
      :hide-default-footer="true"
      :items-per-page="-1"
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
      <template #[`item.data-table-select`]="{ isSelected, item }">
        <v-simple-checkbox
          v-if="item.isSelected"
          :value="item.isSelected"
          color="primary"
        ></v-simple-checkbox>
        <v-simple-checkbox
          v-else
          :value="isSelected"
          color="primary"
        ></v-simple-checkbox>
      </template>
      <template #[`item.modificationSlot`]="{ item }">
        <v-btn
          v-if="item.isSelected"
          color="red"
          @click="deleteAvailability(item)"
          >Supprimer</v-btn
        >
        <v-btn v-else color="green" @click="addAvailabilityToUser(item)"
          >Ajouter</v-btn
        >
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
    </v-data-table>
    <v-snackbar v-model="isSnackbarOpen" :timeout="5000">
      {{ feedbackMessage }}

      <template #action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="isSnackbarOpen = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import TimeslotDialog from "~/components/atoms/TimeslotDialog.vue";
import { Timeslot } from "utils/models/repo";

export default Vue.extend({
  name: "TimeslotEditor",
  components: {
    TimeslotDialog,
  },
  props: {
    groupTitle: {
      type: String,
      required: true,
    },
    user: {
      type: Object,
      required: true,
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
      selectedDeletion: [],
      authorizedEditor: ["admin", "humain", "bural"],
      isSnackbarOpen: false,
      feedbackMessage: "",
    };
  },
  computed: {
    tableItems(): any {
      return this.timeslots.map((timeslot: Timeslot) => {
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
            (new Date(timeslot.timeFrame.start).getMonth() + 1) +
            "-" +
            new Date(timeslot.timeFrame.start).getDate() +
            " " +
            new Date(timeslot.timeFrame.start).toLocaleDateString("fr-fr", {
              weekday: "long",
            }),
          charisma: timeslot.charisma,
          isSelected: this.user.availabilities.includes(timeslot._id),
        };
      });
    },
    timeslots(): Timeslot[] {
      return this.$accessor.timeslot.getTimeslotsByGroupTitle(this.groupTitle);
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
        {
          text: "Modification",
          value: "modificationSlot",
          sortable: false,
        },
      ];
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
    padTime(time: number): string {
      if (time < 10) {
        return "0" + time;
      }
      return time + "";
    },
    async deleteAvailability(item: any) {
      const data = { userID: this.user._id, timeslotID: item.id };
      this.$accessor.user.removeAvailability(data).then(() => {
        if (!this.isSnackbarOpen) {
          this.feedbackMessage =
            "Changement effectué ! Recharge la page pour le voir ou continue de supprimer des créneaux ils seront pris en compte !";
          this.isSnackbarOpen = true;
        }
      });
    },
    async addAvailabilityToUser(item: any) {
      const data = { userID: this.user._id, timeslotID: item.id };
      this.$accessor.user.addAvailabilityToUser(data).then(() => {
        if (!this.isSnackbarOpen) {
          this.feedbackMessage =
            "Changement effectué ! Recharge la page pour le voir ou continue d'ajouter des créneaux ils seront pris en compte !";
          this.isSnackbarOpen = true;
        }
      });
    },
  },
});
</script>

<style></style>
