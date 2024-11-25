<template>
  <v-chip
    v-show="showTeam"
    :size="size"
    :color="color"
    :class="classes"
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
    <v-tooltip location="top" activator="parent" :text="teamText" />
  </v-chip>
</template>

<script lang="ts" setup>
import { BENEVOLE_CODE, SOFT_CODE } from "@overbookd/team-constants";
import type { Team } from "@overbookd/team";
import { SEE_SOFT_TEAM } from "@overbookd/permission";

const props =
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
const userStore = useUserStore();

const teamMetadata = computed<Team | undefined>(() =>
  teamStore.getTeamByCode(props.team),
);
const canSeeSoftTeam = computed<boolean>(() =>
  userStore.can(SEE_SOFT_TEAM),
);
const showTeam = computed<boolean>(() => {
  const isSoftTeamHidden = props.team === SOFT_CODE && !canSeeSoftTeam.value;
  const isBenevoleTeamHidden = props.team === BENEVOLE_CODE && !props.showHidden;
  return !isSoftTeamHidden && !isBenevoleTeamHidden;
});

const teamText = computed<string>(() => {
  const chipPrefix = props.prefix ? `${props.prefix} ` : "";
  return `${chipPrefix}${teamMetadata.value?.name}`;
});
const color = computed<string>(() => teamMetadata.value?.color ?? "grey");
const classes = computed(() => ({
  clickable: props.clickable,
  flip: props.team === "bde",
}));

const emit = defineEmits(["click", "close"]);
const sendEvent = () => emit("click", teamMetadata.value);
const sendCloseEvent = () => emit("close", props.team);
</script>

<style scoped>
.v-chip {
  margin: 2px;
  cursor: default;
}
.v-icon {
  margin-top: 4px;
}
span.name {
  margin-left: 4px;
  margin-top: 4px;
}
.flip {
  transform: rotate(180deg);
}
.clickable {
  cursor: pointer;
}
</style>
