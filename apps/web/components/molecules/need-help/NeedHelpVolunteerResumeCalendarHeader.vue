<template>
  <div class="volunteer-card">
    <span class="volunteer-name">{{ formattedVolunteerName }}</span>
    <div class="teams">
      <TeamChip
        v-for="team of volunteer.teams"
        :key="team"
        :team="team"
      ></TeamChip>
    </div>
    <v-divider />
    <div class="volunteer-phone">
      <v-btn icon :href="getPhoneLink(volunteer.phone)">
        <v-icon>mdi-phone</v-icon>
      </v-btn>
      <span>{{ formatPhone(volunteer.phone) }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import { Volunteer } from "~/utils/models/needHelp";
import {
  formatPhoneLink,
  formatUserPhone,
  formatUsername,
} from "~/utils/user/userUtils";

export default Vue.extend({
  name: "NeedHelpVolunteerResumeCalendarHeader",
  components: { TeamChip },
  props: {
    volunteer: {
      type: Object as () => Volunteer,
      required: true,
    },
  },
  computed: {
    formattedVolunteerName(): string {
      return formatUsername(this.volunteer);
    },
  },
  methods: {
    formatPhone(phone: string) {
      return formatUserPhone(phone);
    },
    getPhoneLink(phone: string) {
      return formatPhoneLink(phone);
    },
  },
});
</script>

<style lang="scss" scoped>
.volunteer-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.teams {
  display: flex;
  justify-content: center;
  align-items: center;
}

.volunteer-name {
  font-size: 1rem;
  font-weight: 500;
  margin-top: 2px;
  margin-bottom: 2px;
  text-align: center;
  min-width: 100%;
}

.volunteer-phone {
  font-weight: 500;
}
</style>
