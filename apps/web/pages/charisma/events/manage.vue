<template>
  <div class="charisma-event">
    <CharismaEventSettingsCard
      v-model:name="eventName"
      v-model:date="eventDate"
      v-model:charisma-per-hour="charismaPerHour"
      :participants="participants"
      class="charisma-event__settings"
      @save="addParticipations"
    />
    <CharismaEventParticipantTable
      v-model:potential-participants="potentialParticipantsWithHours"
      :charisma-per-hour="charismaPerHour"
      :loading="loading"
      class="charisma-event__participant-table"
    />
  </div>
</template>

<script lang="ts" setup>
import type { CharismaEventPotentialParticipant } from "@overbookd/http";
import type { CharismaEventParticipant } from "~/utils/charisma/charisma-event";

const charismaEventStore = useCharismaEventStore();

const eventName = ref<string>("");
const eventDate = ref<Date>(new Date());
const charismaPerHour = ref<number>(10);

const potentialParticipants = computed<CharismaEventPotentialParticipant[]>(
  () => charismaEventStore.potentialParticipants,
);
const potentialParticipantsWithHours = ref<CharismaEventParticipant[]>([]);
const resetParticipants = () => {
  potentialParticipantsWithHours.value = potentialParticipants.value.map(
    (participant) => ({ ...participant, hours: 0 }),
  );
};
const loading = ref<boolean>(potentialParticipants.value.length === 0);
charismaEventStore.fetchPotentialParticipants().then(() => {
  loading.value = false;
  resetParticipants();
});
const participants = computed<CharismaEventParticipant[]>(() =>
  potentialParticipantsWithHours.value.filter(
    (participant) => participant.hours > 0,
  ),
);

const addParticipations = async () => {
  const event = {
    name: eventName.value,
    eventDate: eventDate.value,
    charismaPerHour: charismaPerHour.value,
  };
  const baseParticipants = participants.value.map(({ id, hours }) => ({
    id,
    hours,
  }));
  await charismaEventStore.addParticipations(event, baseParticipants);
  resetParticipants();
};
</script>

<style lang="scss" scoped>
.charisma-event {
  display: flex;
  width: 100%;
  gap: 1rem;
  &__settings {
    width: 20%;
  }
  &__participant-table {
    width: 80%;
  }
}
</style>
