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
      <template #[`item.data-table-select`]="{ isSelected, select, item }">
        <v-simple-checkbox
          v-if="item.isSelected"
          :value="item.isSelected"
          color="primary"
        ></v-simple-checkbox>
        <v-simple-checkbox
          v-else
          :value="isSelected"
          color="primary"
          @input="select($event)"
        ></v-simple-checkbox>
      </template>
      <template #[`item.deleteSlot`]="{ item }">
        <v-btn
          v-if="item.isSelected"
          color="red"
          @click="deleteAvailability(item.id)"
          >Supprimer ce créneaux</v-btn
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
      <template #[`footer.prepend`]>
        <div>
          <v-btn color="success" @click="$refs.confirm.open()"
            ><v-icon left> mdi-plus </v-icon> Valider les changements
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

export default Vue.extend({
  name: "TimeslotEditor",
  components: {
    TimeslotDialog,
    ConfirmDialog,
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
        {
          text: "Suppresion",
          value: "deleteSlot",
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
    async enterSelect() {
      this.$emit("select", this.selectedItems);
    },
    async acceptSelection() {
      if (this.selectedItems.length == 0) return;
      const ids = this.selectedItems.map((item: any) => item.id);
      await this.$store.dispatch("user/acceptSelection", ids);

      let charismaMessage = "";
      charismaMessage = this.$accessor.user.hasRole("hard")
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
    async deleteAvailability(slotId: string) {
      const data = { userID: this.user._id, timeslotID: slotId };
      this.$accessor.user.removeAvailability(data);
    },
  },
});
</script>

<style></style>
