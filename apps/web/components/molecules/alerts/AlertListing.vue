<template>
  <div class="alerts" :class="{ multiple: multipleAlerts, expanded: expanded }">
    <PersonalAccount
      v-if="personalAccountAlert"
      class="alert"
      :alert="personalAccountAlert"
      @dismiss="dismiss('personalAccount')"
    />
    <Contribution
      v-if="contributionAlert"
      id="contribution"
      class="alert"
      :alert="contributionAlert"
      @dismiss="dismiss('contribution')"
    />
    <NotYetVolunteerAlert
      v-if="notYetVolunteerAlert"
      id="not-yet-volunteer"
      class="alert"
      @dismiss="dismiss('notYetVolunteer')"
    />
    <FriendsAlert
      v-if="friendsAlert"
      id="friends-alert"
      class="alert"
      @dismiss="dismiss('friends')"
    />
    <ProfilePictureAlert
      v-if="profilePictureAlert"
      id="profile-picture"
      class="alert"
      @dismiss="dismiss('profilePicture')"
    />
    <v-btn id="expand-alerts" block color="primary" @click="toggleExpand">
      <v-icon left>{{ toggleIcon }}</v-icon>
      {{ toggleMessage }}
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { PersonalAccountAlert } from "@overbookd/personal-account";
import { Alerts } from "@overbookd/alerts";
import { SettleAlert } from "@overbookd/contribution";
import PersonalAccount from "~/components/atoms/alerts/PersonalAccount.vue";
import Contribution from "~/components/atoms/alerts/Contribution.vue";
import ProfilePictureAlert from "~/components/atoms/alerts/ProfilePictureAlert.vue";
import FriendsAlert from "~/components/atoms/alerts/FriendsAlert.vue";
import NotYetVolunteerAlert from "~/components/atoms/alerts/NotYetVolunteerAlert.vue";

type AlertListingData = {
  expanded: boolean;
};

export default Vue.extend({
  name: "AlertListing",
  components: {
    PersonalAccount,
    Contribution,
    ProfilePictureAlert,
    FriendsAlert,
    NotYetVolunteerAlert,
  },
  data: (): AlertListingData => ({
    expanded: false,
  }),
  computed: {
    personalAccountAlert(): PersonalAccountAlert | undefined {
      return this.$accessor.alert.alerts.personalAccount;
    },
    contributionAlert(): SettleAlert | undefined {
      return this.$accessor.alert.alerts.contribution;
    },
    profilePictureAlert(): boolean | undefined {
      return this.$accessor.alert.alerts.profilePicture;
    },
    friendsAlert(): boolean | undefined {
      return this.$accessor.alert.alerts.friends;
    },
    notYetVolunteerAlert(): boolean | undefined {
      return this.$accessor.alert.alerts.notYetVolunteer;
    },
    multipleAlerts(): boolean {
      const allAlerts = Object.values(this.$accessor.alert.alerts);
      console.log(allAlerts);
      const displayedAlerts = allAlerts.filter((alert) => alert !== false);
      return displayedAlerts.length > 1;
    },
    toggleIcon(): string {
      return this.expanded ? "mdi-arrow-collapse" : "mdi-arrow-expand";
    },
    toggleMessage(): string {
      return this.expanded ? "Une seule alerte" : "Toutes les alertes";
    },
  },
  methods: {
    dismiss(alert: keyof Alerts) {
      this.$accessor.alert.dismiss(alert);
    },
    toggleExpand() {
      this.expanded = !this.expanded;
    },
  },
});
</script>

<style lang="scss">
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
#profile-picture,
#friends-alert,
#not-yet-volunteer {
  background-color: $yellow-24h;
  border-color: $yellow-24h;
  a {
    color: $red-24h;
  }
}
</style>
