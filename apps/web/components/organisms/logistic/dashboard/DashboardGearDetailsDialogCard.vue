<template>
  <DialogCard without-actions @close="close">
    <template #title> {{ gearDetails.name }} </template>
    <template #subtitle>
      <div class="date-chips">
        <v-chip color="primary" variant="flat">
          Du {{ formatDateToHumanReadable(gearDetails.start) }}
        </v-chip>
        <v-chip color="primary" variant="flat">
          Au {{ formatDateToHumanReadable(gearDetails.end) }}
        </v-chip>
      </div>
    </template>

    <template #content>
      <h3>
        Stock
        <v-chip color="secondary" size="small" variant="flat">
          {{ gearDetails.stock }}
        </v-chip>
      </h3>

      <p>
        Répertorié dans l'inventaire:
        <strong>{{ gearDetails.inventory }}</strong>
      </p>

      <details>
        <summary>
          Venant des Fiches Achats
          <v-chip color="tertiary" size="x-small" variant="flat">
            {{ sumQuantities(gearDetails.purchases) }}
          </v-chip>
        </summary>
        <ul v-if="gearDetails.purchases.length">
          <li v-for="purchase in gearDetails.purchases" :key="purchase.id">
            <nuxt-link :to="`${PURCHASE_GEARS_URL}/${purchase.id}`">
              Achat #{{ purchase.id }} - {{ purchase.seller }}:
              <strong>{{ purchase.quantity }}</strong>
            </nuxt-link>
          </li>
        </ul>
        <p v-else>Aucun achat</p>
      </details>

      <details>
        <summary>
          Venant des Fiches Emprunts
          <v-chip color="tertiary" size="x-small" variant="flat">
            {{ sumQuantities(gearDetails.borrows) }}
          </v-chip>
        </summary>
        <ul v-if="gearDetails.borrows.length">
          <li v-for="borrow in gearDetails.borrows" :key="borrow.id">
            <nuxt-link :to="`${BORROW_GEARS_URL}/${borrow.id}`">
              Emprunt #{{ borrow.id }} - {{ borrow.lender }}:
              <strong>{{ borrow.quantity }}</strong>
            </nuxt-link>
          </li>
        </ul>
        <p v-else>Aucun emprunt</p>
      </details>

      <h3>
        Demandes
        <v-chip color="secondary" size="small" variant="flat">
          {{ gearDetails.inquiry }}
        </v-chip>
      </h3>

      <details>
        <summary>
          Venant des Fiches Activité
          <v-chip color="tertiary" size="x-small" variant="flat">
            {{ sumQuantities(gearDetails.activities) }}
          </v-chip>
        </summary>
        <ul v-if="gearDetails.activities.length">
          <li v-for="activity in gearDetails.activities" :key="activity.id">
            <nuxt-link :to="`${FA_URL}/${activity.id}#inquiry`">
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
          <v-chip color="tertiary" size="x-small" variant="flat">
            {{ sumQuantities(gearDetails.tasks) }}
          </v-chip>
        </summary>
        <ul v-if="gearDetails.tasks.length">
          <li v-for="task in gearDetails.tasks" :key="task.id">
            <nuxt-link :to="`${FT_URL}/${task.id}#inquiry`">
              FT #{{ task.id }} - {{ task.name }}:
              <strong>{{ task.quantity }}</strong>
            </nuxt-link>
          </li>
        </ul>
        <p v-else>Aucune demande</p>
      </details>
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import type { GearDetails } from "@overbookd/http";
import { formatDateToHumanReadable } from "@overbookd/time";
import {
  FA_URL,
  FT_URL,
  PURCHASE_GEARS_URL,
  BORROW_GEARS_URL,
} from "@overbookd/web-page";
import { sumQuantities } from "~/utils/logistic/quantity";

type GearDetailsWithName = GearDetails & { name: string };

defineProps({
  gearDetails: {
    type: Object as PropType<GearDetailsWithName>,
    required: true,
  },
});

const emit = defineEmits(["close"]);
const close = () => emit("close");
</script>

<style lang="scss" scoped>
h3 {
  margin-bottom: 3px;
  margin-top: 10px;
}
p {
  margin-bottom: 0px;
}
strong {
  font-weight: 900;
}
ul {
  margin-left: 15px;
}

.date-chips {
  display: flex;
  gap: 5px;
  justify-content: center;
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
