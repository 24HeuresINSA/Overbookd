<template>
  <v-card v-if="gearDetails" class="contractor-card">
    <v-btn class="gear-details-card__close-btn" icon @click="closeDialog">
      <v-icon>mdi-close</v-icon>
    </v-btn>

    <v-card-title class="gear-details-card__title">
      <h2>{{ gearDetails.name }}</h2>
    </v-card-title>

    <v-card-subtitle class="gear-details-card__subtitle">
      <v-chip color="primary">
        Du {{ formatDateToHumanReadable(gearDetails.start) }}
      </v-chip>
      <v-chip color="primary">
        Au {{ formatDateToHumanReadable(gearDetails.end) }}
      </v-chip>
    </v-card-subtitle>

    <v-card-text class="gear-details-card__details">
      <h3>
        Stock
        <v-chip color="primary" x-small>
          {{ gearDetails.stock }}
        </v-chip>
      </h3>

      <p>
        Répertorié dans l'inventaire:
        <strong>{{ gearDetails.inventory }}</strong>
      </p>

      <h3>
        Demandes
        <v-chip color="primary" x-small>
          {{ gearDetails.inquiry }}
        </v-chip>
      </h3>

      <details open>
        <summary>
          Venant des Fiches Activité
          <v-chip color="primary" x-small>
            {{ countInquiries(gearDetails.activities) }}
          </v-chip>
        </summary>
        <ul v-if="gearDetails.activities.length">
          <li v-for="activity in gearDetails.activities" :key="activity.id">
            <nuxt-link :to="`/fa/${activity.id}#inquiry`">
              FA #{{ activity.id }} - {{ activity.name }}:
              <strong>{{ activity.quantity }}</strong>
            </nuxt-link>
          </li>
        </ul>
        <p v-else>Aucune demande</p>
      </details>

      <details>
        <summary>
          Venant des Fiches Tâche
          <v-chip color="primary" x-small>
            {{ countInquiries(gearDetails.tasks) }}
          </v-chip>
        </summary>
        <ul v-if="gearDetails.tasks.length">
          <li v-for="task in gearDetails.tasks" :key="task.id">
            <nuxt-link :to="`/ft/${task.id}#inquiry`">
              FT #{{ task.id }} - {{ task.name }}:
              <strong>{{ task.quantity }}</strong>
            </nuxt-link>
          </li>
        </ul>
        <p v-else>Aucune demande</p>
      </details>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { GearDetails, Inquiry } from "@overbookd/http";
import { defineComponent } from "vue";
import { formatDateToHumanReadable } from "~/utils/date/date.utils";

export default defineComponent({
  name: "DashboardGearDetailsCard",
  props: {
    gearDetails: {
      type: Object as () => GearDetails & { name: string },
      required: true,
    },
  },
  emits: ["close-dialog"],
  methods: {
    closeDialog() {
      this.$emit("close-dialog");
    },
    formatDateToHumanReadable,
    countInquiries(inquiries: Inquiry[]): number {
      return inquiries.reduce((sum, { quantity }) => sum + quantity, 0);
    },
  },
});
</script>

<style lang="scss" scoped>
.gear-details-card {
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

details {
  border: 1px solid #aaa;
  border-radius: 4px;
  padding: 0.5em 0.5em 0;
  min-width: 100%;
  & summary {
    font-weight: bold;
    margin: -0.5em -0.5em 0;
    padding: 0.5em;
  }

  &[open] {
    padding: 0.5em;
    & summary {
      border-bottom: 1px solid #aaa;
      margin-bottom: 0.5em;
    }
  }
}
</style>
