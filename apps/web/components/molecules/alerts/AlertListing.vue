<template>
  <v-window
    v-model="current"
    continuous
    :show-arrows="alertCount > 1"
    @mouseenter="pause"
    @mouseleave="resume"
  >
    <template #prev="{ props }">
      <v-btn
        icon
        size="x-large"
        density="compact"
        variant="plain"
        @click="props.onClick"
      >
        <v-icon icon="mdi-chevron-left" :size="38" />
      </v-btn>
    </template>

    <template #next="{ props }">
      <v-btn
        icon
        size="x-large"
        density="compact"
        variant="plain"
        @click="props.onClick"
      >
        <v-icon icon="mdi-chevron-right" :size="38" />
      </v-btn>
    </template>

    <v-window-item v-if="personalAccountAlert">
      <PersonalAccountAlert
        :alert="personalAccountAlert"
        @dismiss="dismiss('personalAccount')"
      />
    </v-window-item>

    <v-window-item v-if="contributionAlert">
      <ContributionAlert
        id="contribution"
        :alert="contributionAlert"
        @dismiss="dismiss('contribution')"
      />
    </v-window-item>

    <v-window-item v-if="profilePictureAlert">
      <ProfilePictureAlert
        id="profile-picture"
        @dismiss="dismiss('profilePicture')"
      />
    </v-window-item>
  </v-window>
</template>

<script lang="ts" setup>
import { PersonalAccountAlert as PersonalAccountAlertType } from "@overbookd/personal-account";
import type { Alerts } from "@overbookd/alerts";
import { SettleAlert } from "@overbookd/contribution";
import { useIntervalFn } from "@vueuse/core";

const alertStore = useAlertStore();
await alertStore.fetchAlerts();

const personalAccountAlert = computed<PersonalAccountAlertType | undefined>(
  () => alertStore.alerts.personalAccount,
);
const contributionAlert = computed<SettleAlert | undefined>(
  () => alertStore.alerts.contribution,
);
const profilePictureAlert = computed<boolean | undefined>(
  () => alertStore.alerts.profilePicture,
);

const dismiss = (alert: keyof Alerts) => alertStore.dismiss(alert);

const current = ref<number>(0);
const alertCount = computed<number>(
  () => Object.values(alertStore.alerts).filter((value) => !!value).length,
);

watch(alertCount, (count) => {
  if (current.value >= count) current.value = Math.max(0, count - 1);
});

const { pause, resume } = useIntervalFn(() => {
  if (alertCount.value === 1) return;
  current.value = (current.value + 1) % alertCount.value;
}, 5000);
</script>
