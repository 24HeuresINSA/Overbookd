<template>
  <v-chip
    v-show="showTeam"
    :size="size"
    :color="color"
    :class="{
      clickable: clickable,
      flip: isBde,
    }"
    :closable="closable"
    :ripple="clickable"
    variant="elevated"
    @click.stop="sendEvent"
    @click:close="sendCloseEvent"
  >
    <v-icon v-if="teamMetadata" :size="size">
      {{ teamMetadata.icon }}
    </v-icon>
    <span v-if="withName" class="name">
      {{ teamText }}
    </span>
    <v-tooltip
      v-if="!withName"
      :location="isBde ? 'bottom' : 'top'"
      activator="parent"
    >
      <p :class="{ flip: isBde }">{{ teamText }}</p>
    </v-tooltip>
  </v-chip>
</template>

<script lang="ts" setup>
import { BENEVOLE_CODE } from "@overbookd/team-constants";
import type { Team } from "@overbookd/team";

const { team, size, withName, showHidden, closable, clickable, prefix } =
  defineProps({
    team: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: "small",
    },
    withName: {
      type: Boolean,
      default: false,
    },
    showHidden: {
      type: Boolean,
      default: false,
    },
    closable: {
      type: Boolean,
      default: false,
    },
    clickable: {
      type: Boolean,
      default: false,
    },
    prefix: {
      type: String,
      default: null,
    },
  });

const teamStore = useTeamStore();

const teamMetadata = computed<Team | undefined>(() =>
  teamStore.getTeamByCode(team),
);
const showTeam = computed<boolean>(() => showHidden || team !== BENEVOLE_CODE);
const teamText = computed<string>(() => {
  const chipPrefix = prefix ? `${prefix} ` : "";
  return `${chipPrefix}${teamMetadata.value?.name}`;
});
const color = computed<string>(() => teamMetadata.value?.color ?? "grey");
const isBde = computed<boolean>(() => team === "bde");

const emit = defineEmits(["click", "close"]);
const sendEvent = () => {
  if (clickable) emit("click", teamMetadata.value);
};
const sendCloseEvent = () => emit("close", team);
</script>

<style scoped>
.v-chip {
  margin: 2px;
  cursor: default;
  padding: 0 10px;
}
span.name {
  margin-left: 4px;
}
.flip {
  transform: rotate(180deg);
}
.clickable {
  cursor: pointer;
}
</style>
