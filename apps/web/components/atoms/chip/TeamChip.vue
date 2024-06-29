<template>
  <v-chip
    v-show="showTeam"
    :size="size"
    :color="color"
    :class="classes"
    :closable="closable"
    :ripple="clickable"
    variant="elevated"
    @click="sendEvent"
    @click:close="sendCloseEvent"
  >
    <v-icon v-if="teamMetadata" :size="size">
      {{ teamMetadata.icon }}
    </v-icon>
    <span v-if="withName" class="name">
      {{ teamText }}
    </span>
    <v-tooltip location="top" activator="parent">
      {{ teamText }}
    </v-tooltip>
  </v-chip>
</template>

<script lang="ts" setup>
import { BENEVOLE_CODE } from "@overbookd/team";

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

const emit = defineEmits(["click", "close"]);
const teamStore = useTeamStore();

const teamMetadata = computed(() => teamStore.getTeamByCode(team));
const showTeam = computed(() => showHidden || team !== BENEVOLE_CODE);
const teamText = computed(() => {
  const chipPrefix = prefix ? `${prefix} ` : "";
  return `${chipPrefix}${teamMetadata.value?.name}`;
});
const color = computed(() => teamMetadata.value?.color ?? "grey");
const classes = computed(() => ({
  clickable: clickable,
  flip: team === "bde",
}));

const sendEvent = () => {
  emit("click", teamMetadata.value);
};

const sendCloseEvent = () => {
  emit("close", team);
};
</script>

<style lang="scss" scoped>
.v-chip {
  margin: 2px;
  cursor: default;
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
