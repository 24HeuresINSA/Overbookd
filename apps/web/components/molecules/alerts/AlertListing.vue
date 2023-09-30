<template>
  <div class="alerts">
    <PersonnalAccount
      v-for="alert in alerts"
      :key="alert.summary"
      :alert="alert"
      @dismiss="dismiss(alert)"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { PersonnalAccountAlert } from "@overbookd/personnal-account";
import PersonnalAccount from "~/components/atoms/alerts/PersonnalAccount.vue";

export default Vue.extend({
  name: "AlertListing",
  components: {
    PersonnalAccount,
  },
  computed: {
    alerts(): PersonnalAccountAlert[] {
      return this.$accessor.alert.alerts;
    },
  },
  methods: {
    dismiss(alert: PersonnalAccountAlert) {
      this.$accessor.alert.dismiss(alert);
    },
  },
});
</script>
