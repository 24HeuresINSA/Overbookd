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
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
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
        <v-btn v-if="editorMode" color="error" @click="askConfirmDelete">
          <v-icon left> mdi-plus </v-icon>
          Supprimer le tableau
        </v-btn>
        <ConfirmDialog ref="confirmDelete" @confirm="removeTable"
          >Les créneaux sont supprimés de façon <b>irreversible.</b>
        </ConfirmDialog>
        <div v-if="!editorMode">
          <v-btn color="success" @click="$refs.confirm.open()"
            ><v-icon left> mdi-plus </v-icon> Valider mes disponibilités
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
  name: "TimeslotTable",
  components: {
    TimeslotDialog,
    ConfirmDialog,
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
          isSelected: this.$accessor.user.me.availabilities.includes(
            timeslot._id
          ),
          off: this.userSelectedAvailabilities.includes(timeslot._id),
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
      this.$store.dispatch(
        "timeslot/setCreateStatus",
        "Créneaux selectionnés validés"
      );
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
  },
});
</script>

<style></style>
