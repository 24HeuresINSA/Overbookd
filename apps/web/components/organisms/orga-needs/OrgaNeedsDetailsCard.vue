<template>
  <v-card v-if="orgaNeedsDetails" class="orga-needs-card">
    <v-btn class="details-card__close-btn" icon @click="closeDialog">
      <v-icon>mdi-close</v-icon>
    </v-btn>

    <v-card-title class="details-card__title">
      <h2>FT avec des bénévoles demandés {{ formattedTeams }}</h2>
    </v-card-title>

    <v-card-subtitle class="details-card__subtitle">
      <v-chip color="primary">
        Du {{ formatDateToHumanReadable(orgaNeedsDetails.start) }}
      </v-chip>
      <v-chip color="primary">
        Au {{ formatDateToHumanReadable(orgaNeedsDetails.end) }}
      </v-chip>
    </v-card-subtitle>

    <v-card-text class="details-card__details">
      <h3>
        FT
        <v-chip color="secondary" x-small>
          {{ orgaNeedsDetails.tasks.length }}
        </v-chip>
      </h3>
      <ul v-if="orgaNeedsDetails.tasks.length">
        <li v-for="task in orgaNeedsDetails.tasks" :key="task.id">
          <nuxt-link :to="`/ft/${task.id}`">
            FT #{{ task.id }} - {{ task.name }}
            <v-chip color="primary" x-small>{{ task.count }}</v-chip>
          </nuxt-link>
        </li>
      </ul>
      <p v-else>Aucune demande</p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { OrgaNeedDetails } from "@overbookd/http";
import { formatDateToHumanReadable } from "~/utils/date/date.utils";

export default defineComponent({
  name: "OrgaNeedsDetailsCard",
  props: {
    orgaNeedsDetails: {
      type: Object as () => OrgaNeedDetails,
      required: true,
    },
    filterTeams: {
      type: Array as () => string[],
      required: true,
    },
  },
  emits: ["close-dialog"],
  computed: {
    formattedTeams(): string {
      if (this.filterTeams.length === 0) return "";
      return this.filterTeams
        .map((team) => `(${this.findTeamName(team)})`)
        .join(", ");
    },
  },
  methods: {
    closeDialog() {
      this.$emit("close-dialog");
    },
    findTeamName(code: string): string {
      return this.$accessor.team.getTeamByCode(code)?.name || "";
    },
    formatDateToHumanReadable,
  },
});
</script>

<style lang="scss" scoped>
.details-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  &__title {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
    h2 {
      flex: 1;
      text-align: center;
    }
  }
  &__subtitle {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 10px;
  }
  &__details {
    h3 {
      margin-bottom: 3px;
      margin-top: 3px;
    }
    p {
      margin-bottom: 0px;
    }
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  &__close-btn {
    position: absolute;
    top: 3px;
    right: 3px;
  }
  strong {
    font-weight: 900;
  }
}
</style>
