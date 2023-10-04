<template>
  <div class="alerts">
    <PersonalAccount
      v-for="alert in alerts"
      :key="alert.summary"
      :alert="alert"
      @dismiss="dismiss(alert)"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { PersonalAccountAlert } from "@overbookd/personal-account";
import PersonalAccount from "~/components/atoms/alerts/PersonalAccount.vue";

export default Vue.extend({
  name: "AlertListing",
  components: {
    PersonalAccount,
  },
  computed: {
    alerts(): PersonalAccountAlert[] {
      return this.$accessor.alert.alerts.map(
        ({ summary, balance }) => new PersonalAccountAlert(summary, balance),
      );
    },
  },
  methods: {
    dismiss(alert: PersonalAccountAlert) {
      this.$accessor.alert.dismiss(alert);
    },
  },
});
</script>
