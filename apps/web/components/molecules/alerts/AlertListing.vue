<template>
  <div class="alerts" :class="{ multiple: multipleAlerts, expanded: expanded }">
    <PersonalAccountAlert
      v-if="personalAccountAlert"
      class="alert"
      :alert="personalAccountAlert"
      @dismiss="dismiss('personalAccount')"
    />
    <ContributionAlert
      v-if="contributionAlert"
      id="contribution"
      class="alert"
      :alert="contributionAlert"
      @dismiss="dismiss('contribution')"
    />
    <ProfilePictureAlert
      v-if="profilePictureAlert"
      id="profile-picture"
      class="alert"
      @dismiss="dismiss('profilePicture')"
    />
    <v-btn id="expand-alerts" block color="primary" @click="toggleExpand">
      <v-icon left>
        {{ expanded ? "mdi-arrow-collapse" : "mdi-arrow-expand" }}
      </v-icon>
      {{ expanded ? "Une seule alerte" : "Toutes les alertes" }}
    </v-btn>
  </div>
</template>

<script lang="ts" setup>
import { PersonalAccountAlert } from "@overbookd/personal-account";
import { Alerts } from "@overbookd/alerts";
import { SettleAlert } from "@overbookd/contribution";

const alertStore = useAlertStore();
alertStore.fetchAlerts();

const expanded = ref<boolean>(false);
const toggleExpand = () => (expanded.value = !expanded.value);

const personalAccountAlert = computed<PersonalAccountAlert | undefined>(
  () => alertStore.alerts.personalAccount,
);
const contributionAlert = computed<SettleAlert | undefined>(
  () => alertStore.alerts.contribution,
);
const profilePictureAlert = computed<boolean | undefined>(
  () => alertStore.alerts.profilePicture,
);

const multipleAlerts = computed<boolean>(() => {
  const allAlerts = Object.values(alertStore.alerts);
  const displayedAlerts = allAlerts.filter((alert) => alert !== false);
  return displayedAlerts.length > 1;
});

const dismiss = (alert: keyof Alerts) => alertStore.dismiss(alert);
</script>

<style lang="scss" scoped>
.alerts {
  .alert:nth-of-type(n + 2) {
    display: none;
  }
  #expand-alerts {
    display: none;
  }
  &.multiple {
    #expand-alerts {
      display: unset;
    }
    .alert:first-of-type {
      margin-bottom: 3px;
    }
    &.expanded {
      .alert:nth-of-type(n + 2) {
        display: block;
      }
      .alert:first-of-type {
        margin-bottom: 16px;
      }
      .alert:last-of-type {
        margin-bottom: 3px;
      }
    }
  }
}

#contribution,
#profile-picture {
  background-color: $yellow-24h;
  border-color: $yellow-24h;
  a {
    color: $red-24h;
  }
}
</style>
