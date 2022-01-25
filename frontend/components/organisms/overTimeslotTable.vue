<template>
  <v-card>
    <v-data-table
      v-model="selectedItems"
      :headers="headers"
      :items="items"
      class="elevation-1"
      group-by="date"
      show-select
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

          <OverTimeslotDialog
            ref="dialog"
            :timeslot="editedItem"
          ></OverTimeslotDialog>
        </v-toolbar>
      </template>
      <template
        v-if="roles.some((e) => authorizedEditor.includes(e))"
        #item.actions="{ item }"
      >
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="removeItem(item)"> mdi-delete </v-icon>
      </template>
      <template #item.data-table-select="{ isSelected, select, item }">
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
      <template #group.header="{ group, headers, toggle, isOpen }">
        <td :colspan="headers.length">
          <v-btn :ref="group" small icon :data-open="isOpen" @click="toggle">
            <v-icon v-if="isOpen">mdi-chevron-up</v-icon>
            <v-icon v-else>mdi-chevron-down</v-icon>
          </v-btn>
          {{ group }}
        </td>
      </template>
      <template #footer.prepend>
        <!-- <v-btn color="error" @click="removeItems" v-if="roles.some((e) => authorizedEditor.includes(e))">
          <v-icon left> mdi-plus </v-icon>
          Supprimer la selection
        </v-btn> -->

        <v-btn color="success" @click="$refs.confirm.open()"
          ><v-icon left> mdi-plus </v-icon> Me rendre disponible (ce tableau)
        </v-btn>
        <ConfirmDialog ref="confirm" @confirm="acceptSelection()"
          >Les créneaux que tu as choisis deviendront
          <b>non modifiable !</b></ConfirmDialog
        >
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import Vue from "vue";
import OverTimeslotDialog from "../atoms/OverTimeslotDialog";
import ConfirmDialog from "../atoms/ConfirmDialog";
export default {
  name: "OverTimeslotTable",
  components: {
    OverTimeslotDialog,
    ConfirmDialog,
  },
  props: {
    timeslots: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      headers: [
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
        { text: "Actions", value: "actions", sortable: false },
      ],
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
    items() {
      return this.overTimeslotTable();
    },
    roles() {
      return this.$accessor.user.me.team;
    },
    userSelectedAvailabilities() {
      return this.$accessor.user.me.availabilities;
    },
  },
  mounted() {
    Object.keys(this.$refs).forEach((k) => {
      console.log(this.$refs[k]);
      if (this.$refs[k] && this.$refs[k].$attrs["data-open"]) {
        this.$refs[k].$el.click();
      }
    });
  },
  methods: {
    overTimeslotTable() {
      //TODO better style for date !
      return this.timeslots.map((timeslot) => {
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
            new Date(timeslot.timeFrame.start).getDate(),
          charisma: timeslot.charisma,
          isSelected: this.$accessor.user.me.availabilities.includes(
            timeslot._id
          ),
          off: this.userSelectedAvailabilities.includes(timeslot._id),
        };
      });
    },
    async editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      await Vue.nextTick();
      this.$refs.dialog.open();
    },
    async enterSelect() {
      console.log(this.selectedItems.length);
      this.$emit("select", this.selectedItems);
    },
    async acceptSelection() {
      if (this.selectedItems.length == 0) return;
      const ids = this.selectedItems.map((item) => item.id);
      console.log(ids);
      await this.$store.dispatch("user/acceptSelection", ids);
      this.$store.dispatch(
        "timeslot/setCreateStatus",
        "Créneaux selectionnés validés"
      );
      this.selectedItems = [];
    },
    async removeItem(item) {
      await this.$store.dispatch("timeslot/deleteTimeslot", item.id);
    },
    padTime(time) {
      if (time < 10) {
        return "0" + time;
      }
      return time;
    },
  },
};
</script>

<style></style>
