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
    <ProfilePictureAlert
      v-if="profilePictureAlert"
      id="profile-picture"
      @dismiss="dismiss('profilePicture')"
    />
    <Availabilities
      v-if="availabilitiesAlert"
      id="no-availabilities"
      :alert="availabilitiesAlert"
      @dismiss="dismiss('availabilities')"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { PersonalAccountAlert } from "@overbookd/personal-account";
import { Alerts } from "@overbookd/alerts";
import { SettleAlert } from "@overbookd/contribution";
import { AvailabilitesAlert } from "@overbookd/volunteer-availability";
import PersonalAccount from "~/components/atoms/alerts/PersonalAccount.vue";
import Contribution from "~/components/atoms/alerts/Contribution.vue";
import ProfilePictureAlert from "~/components/atoms/alerts/ProfilePictureAlert.vue";
import Availabilities from "~/components/atoms/alerts/Availabilities.vue";

export default Vue.extend({
  name: "AlertListing",
  components: {
    PersonalAccount,
    Contribution,
    ProfilePictureAlert,
    Availabilities,
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
    availabilitiesAlert(): AvailabilitesAlert | undefined {
      return this.$accessor.alert.alerts.availabilities;
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
#profile-picture {
  background-color: $yellow-24h;
  border-color: $yellow-24h;
  a {
    color: $red-24h;
  }
}
</style>
