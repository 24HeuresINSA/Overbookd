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
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { PersonalAccountAlert } from "@overbookd/personal-account";
import { Alerts } from "@overbookd/alerts";
import { SettleAlert } from "@overbookd/contribution";
import PersonalAccount from "~/components/atoms/alerts/PersonalAccount.vue";
import Contribution from "~/components/atoms/alerts/Contribution.vue";

export default Vue.extend({
  name: "AlertListing",
  components: {
    PersonalAccount,
    Contribution,
  },
  computed: {
    personalAccountAlert(): PersonalAccountAlert | undefined {
      return this.$accessor.alert.alerts.personalAccount;
    },
    contributionAlert(): SettleAlert | undefined {
      return this.$accessor.alert.alerts.contribution;
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
#contribution {
  background-color: $yellow-24h;
  border-color: $yellow-24h;
}
</style>
