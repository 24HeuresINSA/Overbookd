<template>
  <div class="volunteer-card">
    <span class="volunteer-name">{{ volunteerName }}</span>
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
import { defineComponent } from "vue";
import { HelpingVolunteer } from "@overbookd/http";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import {
  formatPhoneLink,
  formatUserPhone,
  formatUsername,
} from "~/utils/user/user.utils";

export default defineComponent({
  name: "NeedHelpVolunteerResumeCalendarHeader",
  components: { TeamChip },
  props: {
    volunteer: {
      type: Object as () => HelpingVolunteer,
      required: true,
    },
  },
  computed: {
    volunteerName(): string {
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
  flex-wrap: wrap;
  gap: 2px;
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
