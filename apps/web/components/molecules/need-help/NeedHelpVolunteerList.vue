<template>
  <v-data-table :headers="headers" :items="volunteers" :loading="loading">
    <template #item.volunteer="{ item }">
      <v-chip class="assignee-chip" @click="openCalendarInNewTab(item.id)">
        {{ item.firstname }} {{ item.lastname }}
      </v-chip>
    </template>
    <template #item.teams="{ item }" class="teams">
      <TeamChip v-for="team in item.teams" :key="team" :team="team"></TeamChip>
    </template>
    <template #item.phone="{ item }">
      <div class="assignee-phone">
        <v-btn icon :href="getPhoneLink(item.phone)">
          <v-icon>mdi-phone</v-icon>
        </v-btn>
        <h3>{{ formatPhone(item.phone) }}</h3>
      </div>
    </template>
    <template #no-data> Aucun bénévole disponible pour t'aider. 😭 </template>
  </v-data-table>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { HelpingVolunteer } from "@overbookd/http";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import { Header } from "~/utils/data-table/header";
import { formatPhoneLink, formatUserPhone } from "~/utils/user/user.utils";

export default defineComponent({
  name: "NeedHelpVolunteerList",
  components: { TeamChip },
  computed: {
    volunteers(): HelpingVolunteer[] {
      return this.$accessor.needHelp.filteredVolunteers;
    },
    loading(): boolean {
      return false;
    },
    headers(): Header[] {
      const volunteer = {
        text: "Bénévole",
        value: "volunteer",
        sortable: false,
      };
      const teams = {
        text: "Equipes",
        value: "teams",
        sortable: false,
      };
      const phone = {
        text: "Téléphone",
        value: "phone",
        sortable: false,
      };
      return [volunteer, teams, phone];
    },
  },
  async mounted() {
    if (this.volunteers.length > 0) return;
    await this.$accessor.needHelp.fetchVolunteers();
  },
  methods: {
    formatPhone(phone: string) {
      return formatUserPhone(phone);
    },
    getPhoneLink(phone: string) {
      return formatPhoneLink(phone);
    },
    openCalendarInNewTab(volunteerId: number) {
      window.open(`/planning/${volunteerId}`, "_blank");
    },
  },
});
</script>

<style lang="scss" scoped>
.assignee-phone {
  display: flex;
  gap: 5px;
  align-items: center;
}
.teams {
  display: flex;
  gap: 5px;
}
</style>
