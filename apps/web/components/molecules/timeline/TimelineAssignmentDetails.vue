<template>
  <v-card class="assignment-details">
    <v-btn class="close-btn" icon @click="closeDialog">
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-card-title>
      [{{ task.id }}] {{ task.name }}
      <v-icon right @click="openFtInNewTab">mdi-open-in-new</v-icon>
    </v-card-title>
    <v-card-text class="assignment-details__content">
      <div class="assignment-metadata">
        <v-chip color="primary">
          <v-icon left>mdi-map-marker</v-icon>
          <span>{{ task.appointment }}</span>
        </v-chip>
        <v-chip color="primary">
          <v-icon left>mdi-clock</v-icon>
          <span>{{ timetable }}</span>
        </v-chip>
      </div>
      <v-data-table
        :headers="headers"
        :items="assignment.assignees"
        :items-per-page="-1"
        disable-pagination
        hide-default-footer
      >
        <template #item.firstname="{ item }">
          {{ item.firstname }} {{ item.lastname }}
        </template>
        <template #item.teams="{ item }">
          <TeamChip
            v-for="team in item.teams"
            :key="team"
            :team="team"
            class="assignees__assignee-team"
          />
        </template>
        <template #item.as="{ item }">
          <TeamChip
            v-if="item?.as"
            :team="item.as"
            size="medium"
            with-name
            show-hidden
          />
          <v-chip v-else> Requis </v-chip>
        </template>
        <template #item.phone="{ item }">
          <div class="assignee-phone">
            <v-btn icon :href="getPhoneLink(item.phone)">
              <v-icon>mdi-phone</v-icon>
            </v-btn>
            <h3>{{ formatPhone(item.phone) }}</h3>
          </div>
        </template>
        <template #no-data> Aucun bénévole affecté sur ce créneau </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { TimelineAssignment, TimelineTask } from "@overbookd/http";
import { defineComponent } from "vue";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import { formatDateToHumanReadable } from "~/utils/date/date.utils";
import { Header } from "~/utils/models/data-table.model";
import { formatPhoneLink, formatUserPhone } from "~/utils/user/user.utils";

type TimelineAssignmentDetailsData = {
  headers: Header[];
};

export default defineComponent({
  name: "TimelineAssignmentDetails",
  components: { TeamChip },
  props: {
    task: {
      type: Object as () => TimelineTask,
      required: true,
    },
    assignment: {
      type: Object as () => TimelineAssignment,
      required: true,
    },
  },
  emits: ["close-dialog"],
  data: (): TimelineAssignmentDetailsData => ({
    headers: [
      { text: "Bénévole", value: "firstname" },
      { text: "Equipes", value: "teams" },
      { text: "Affecté en tant que", value: "as", sortable: false },
      { text: "Téléphone", value: "phone", sortable: false },
    ],
  }),
  computed: {
    timetable(): string {
      const start = formatDateToHumanReadable(this.assignment.start);
      const end = formatDateToHumanReadable(this.assignment.end);
      return `${start} - ${end}`;
    },
  },
  methods: {
    openFtInNewTab() {
      window.open(`/ft/${this.task.id}`, "_blank");
    },
    formatPhone(phone: string) {
      return formatUserPhone(phone);
    },
    getPhoneLink(phone: string) {
      return formatPhoneLink(phone);
    },
    closeDialog() {
      this.$emit("close-dialog");
    },
  },
});
</script>

<style lang="scss" scoped>
.close-btn {
  position: absolute;
  top: 3px;
  right: 3px;
}

.assignment-metadata {
  display: flex;
  gap: 15px;
}

.assignment-details {
  &__content {
    display: flex;
    flex-direction: column;
    gap: 20px;
    h2 {
      margin-bottom: 5px;
    }
    .friend-list {
      display: flex;
      gap: 5px;
      flex-wrap: wrap;
      margin: 4px 0;
    }
  }
}

.assignees {
  &__assignee-team {
    margin-left: 4px;
  }
}

.assignee-phone {
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>
