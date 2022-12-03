<template>
  <div>
    <v-card :class="isDisabled ? 'disabled' : ''">
      <v-card-title>Créneaux</v-card-title>

      <v-data-table
        :headers="headers"
        :items="timeframes"
        dense
        :items-per-page="-1"
        sort-by="dateStart"
      >
        <template #[`item.dateStart`]="{ item }">
          {{ formatDate(item.start) }}
        </template>
        <template #[`item.timeStart`]="{ item }">
          {{ formatTime(item.start) }}
        </template>
        <template #[`item.dateEnd`]="{ item }">
          {{ formatDate(item.end) }}
        </template>
        <template #[`item.timeEnd`]="{ item }">
          {{ formatTime(item.end) }}
        </template>
        <template #[`item.action`]="{ index }">
          <v-btn
            v-if="!isDisabled"
            icon
            @click="
              isEditDialogOpen = true;
              editIndex = index;
            "
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn v-if="!isDisabled" icon @click="deleteTimeframe(index)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="isAddDialogOpen = true">Ajouter un créneau</v-btn>
      </v-card-actions>

      <TimeframeCalendar :data="timeframes"></TimeframeCalendar>
    </v-card>

    <v-dialog v-model="isAddDialogOpen" max-width="600">
      <TimeframeForm @close-dialog="isAddDialogOpen = false"></TimeframeForm>
    </v-dialog>

    <v-dialog v-model="isEditDialogOpen" max-width="600">
      <TimeframeForm
        :edit-index="editIndex"
        @close-dialog="isEditDialogOpen = false"
      ></TimeframeForm>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TimeframeCalendar from "~/components/molecules/timeframe/TimeframeCalendar.vue";
import TimeframeForm from "~/components/molecules/timeframe/TimeframeForm.vue";

export default Vue.extend({
  name: "TimeframeTable",
  components: { TimeframeCalendar, TimeframeForm },
  props: {
    isDisabled: {
      type: Boolean,
      default: () => false,
    },
  },
  data: () => ({
    headers: [
      { text: "Type", value: "type" },
      { text: "Date de début", value: "dateStart" },
      { text: "Heure de début", value: "timeStart" },
      { text: "Date de fin", value: "dateEnd" },
      { text: "Heure de fin", value: "timeEnd" },
      { text: "Action", value: "action" },
    ],
    isAddDialogOpen: false,
    isEditDialogOpen: false,
    editIndex: null,
  }),
  computed: {
    timeframes(): any {
      return this.$accessor.FA.mFA.time_windows;
    },
  },
  methods: {
    formatDate(date: string): string {
      return new Date(date).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      });
    },
    formatTime(date: string): string {
      return new Date(date).toLocaleTimeString("fr-FR", {
        hour: "numeric",
        minute: "numeric",
      });
    },
    async deleteTimeframe(index: number) {
      await this.$accessor.FA.deleteTimeWindow(index);
    },
  },
});
</script>

<style scoped>
.disabled {
  border-left: 5px solid green;
}
</style>
