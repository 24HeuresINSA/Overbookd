<template>
  <DialogCard without-actions @close="close">
    <template #title>
      [{{ task.id }}] {{ task.name }}
      <v-icon size="small" @click="openFtInNewTab">mdi-open-in-new</v-icon>
    </template>

    <template #content>
      <div class="assignment-metadata">
        <v-chip color="primary" variant="flat" prepend-icon="mdi-map-marker">
          {{ task.appointment }}
        </v-chip>
        <v-chip color="secondary" variant="flat" prepend-icon="mdi-clock">
          {{ timetable }}
        </v-chip>
      </div>

      <v-data-table
        :headers="headers"
        :items="assignment.assignees"
        :items-per-page="-1"
        no-data-text="Aucun bénévole affecté sur ce créneau"
        :mobile="isMobile"
        disable-pagination
        hide-default-footer
      >
        <template #item.firstname="{ item }">
          {{ buildUserName(item) }}
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
            <v-btn
              icon="mdi-phone"
              :href="formatPhoneLink(item.phone)"
              variant="text"
              density="compact"
            />
            <h3>{{ formatUserPhone(item.phone) }}</h3>
          </div>
        </template>
      </v-data-table>
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import type { TimelineAssignment, TimelineTask } from "@overbookd/http";
import { formatDateToHumanReadable } from "@overbookd/time";
import { buildUserName } from "@overbookd/user";
import { FT_URL } from "@overbookd/web-page";
import type { TableHeaders } from "~/utils/vuetify/component-props";
import { formatPhoneLink, formatUserPhone } from "~/utils/user/user.utils";
import { openPageWithIdInNewTab } from "~/utils/navigation/router.utils";

const layoutStore = useLayoutStore();

const headers: TableHeaders = [
  { title: "Bénévole", value: "firstname", sortable: true },
  { title: "Equipes", value: "teams" },
  { title: "Affecté en tant que", value: "as" },
  { title: "Téléphone", value: "phone" },
];
const isMobile = computed<boolean>(() => layoutStore.isMobile);

const props = defineProps({
  task: {
    type: Object as PropType<TimelineTask>,
    required: true,
  },
  assignment: {
    type: Object as PropType<TimelineAssignment>,
    required: true,
  },
});

const timetable = computed<string>(() => {
  const start = formatDateToHumanReadable(props.assignment.start);
  const end = formatDateToHumanReadable(props.assignment.end);
  return `${start} - ${end}`;
});

const emit = defineEmits(["close"]);
const close = () => emit("close");

const openFtInNewTab = () => {
  openPageWithIdInNewTab(FT_URL, props.task.id);
};
</script>

<style lang="scss" scoped>
.assignment-metadata {
  display: flex;
  gap: 10px;
  justify-content: center;
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
