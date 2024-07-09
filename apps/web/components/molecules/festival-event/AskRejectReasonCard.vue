<template>
  <DialogCard @close="close">
    <template #title> Rejeter une {{ eventIdentifier }} </template>
    <template #subtitle>
      <p>
        Tu es sur le point de rejeter la {{ identifier }}
        <strong>{{ name }}</strong> .
      </p>
      <p>Il faut que tu expliques ce qui ne va pas dedans.</p>
    </template>
    <template #content>
      <v-textarea
        v-model="reason"
        label="Explication"
        rows="3"
        outlined
        hide-details
        @keydown.enter="reject"
      />
    </template>
    <template #actions>
      <v-btn
        :text="`Rejeter la ${identifier}`"
        prepend-icon="mdi-alert-octagon-outline"
        :disabled="isReasonEmpty"
        color="primary"
        size="large"
        variant="elevated"
        @click="reject"
      />
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import type { FestivalEventIdentifier } from "@overbookd/festival-event";

const faStore = useFestivalActivityStore();
const ftStore = useFestivalTaskStore();

const props = defineProps({
  identifier: {
    type: String as PropType<FestivalEventIdentifier>,
    required: true,
  },
});

const reason = ref<string>("");
const isReasonEmpty = computed<boolean>(() => reason.value.trim() === "");

const isActivity = computed<boolean>(() => props.identifier === "FA");
const eventIdentifier = computed<string>(() =>
  isActivity.value ? "activité" : "tâche",
);

const name = computed<string>(() =>
  isActivity.value
    ? faStore.selectedActivity.general.name
    : ftStore.selectedTask.general.name,
);

const emit = defineEmits(["reject", "close"]);
const close = () => emit("close");
const reject = (event: Event) => {
  if (isReasonEmpty.value) return;
  event.preventDefault();

  emit("reject", reason.value);
  reason.value = "";
  close();
};
</script>
