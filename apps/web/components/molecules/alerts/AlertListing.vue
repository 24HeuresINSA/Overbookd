<template>
  <div class="alerts">
    <PersonalAccount
      v-if="personalAccountAlert"
      :alert="personalAccountAlert"
      @dismiss="dismiss('personalAccount')"
    />
    <Contribution
      v-if="contributionAlert"
      id="contribution"
      :alert="contributionAlert"
      @dismiss="dismiss('contribution')"
    />
    <HardAvailabilitiesAlert
      v-if="hardAvailabilitiesAlert"
      id="hard-availabilities"
      @dismiss="dismiss('hardAvailabilities')"
    />
    <RegistreeAvailabilitiesAlert
      v-if="registreeAvailabilitiesAlert"
      id="registree-availabilities"
      @dismiss="dismiss('registreeAvailabilities')"
    />
    <ProfilePictureAlert
      v-if="profilePictureAlert"
      id="profile-picture"
      @dismiss="dismiss('profilePicture')"
    />
    <FriendsAlert
      v-if="friendsAlert"
      id="friends-alert"
      @dismiss="dismiss('friends')"
    />
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
import HardAvailabilitiesAlert from "~/components/atoms/alerts/HardAvailabilitiesAlert.vue";
import RegistreeAvailabilitiesAlert from "~/components/atoms/alerts/RegistreeAvailabilitiesAlert.vue";

export default Vue.extend({
  name: "AlertListing",
  components: {
    PersonalAccount,
    Contribution,
    ProfilePictureAlert,
    FriendsAlert,
    HardAvailabilitiesAlert,
    RegistreeAvailabilitiesAlert,
  },
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
    hardAvailabilitiesAlert(): boolean | undefined {
      return this.$accessor.alert.alerts.hardAvailabilities;
    },
    registreeAvailabilitiesAlert(): boolean | undefined {
      return this.$accessor.alert.alerts.registreeAvailabilities;
    },
  },
  methods: {
    dismiss(alert: keyof Alerts) {
      this.$accessor.alert.dismiss(alert);
    },
  },
});
</script>

<style lang="scss">
#contribution,
#profile-picture,
#friends-alert,
#registree-availabilities {
  background-color: $yellow-24h;
  border-color: $yellow-24h;
  a {
    color: $red-24h;
  }
}
</style>
