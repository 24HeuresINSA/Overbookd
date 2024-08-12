<template>
  <v-card>
    <v-card-title>Responsable</v-card-title>
    <v-card-subtitle>
      <p>
        N'hésite pas si tu as des questions à contacter
        <a :href="`mailto:${HUMAINS_EMAIL}`">{{ HUMAINS_EMAIL }}</a
        >.
      </p>
      <p>
        Tu peux aussi t'aider en allant voir les FA de l'année dernière sur
        <a href="https://cetaitmieuxavant.24heures.org">cetaitmieuxavant</a>
        en te connectant avec {{ CTMA_EMAIL }}.
      </p>
    </v-card-subtitle>
    <v-card-text>
      <SearchUser
        v-model="inCharge.adherent"
        label="Adhérent"
        :list="adherents"
        @update:model-value="updateAdherent"
      />
      <SearchTeam
        v-model="inChargeTeam"
        label="Équipe"
        @update:model-value="updateTeam"
      />

      <section class="contractors">
        <h3>Prestataires</h3>
        <ContractorTable
          :contractors="inCharge.contractors"
          @add="addContractor"
          @update="updateContractor"
          @remove="removeContractor"
        />
      </section>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import type {
  FestivalActivity,
  PrepareContractorCreation,
  Contractor,
} from "@overbookd/festival-event";
import type { User } from "@overbookd/user";
import type { Team } from "@overbookd/team";
import { CTMA_EMAIL, HUMAINS_EMAIL } from "~/utils/mail/mail.constant";

const faStore = useFestivalActivityStore();
const teamStore = useTeamStore();
const userStore = useUserStore();

const selectedActivity = computed<FestivalActivity>(
  () => faStore.selectedActivity,
);
const inCharge = computed<FestivalActivity["inCharge"]>(
  () => selectedActivity.value.inCharge,
);
const inChargeTeam = computed<Team | undefined>(() => {
  return teamStore.getTeamByCode(inCharge.value.team || "");
});

const adherents = computed<User[]>(() => userStore.adherents);
if (adherents.value.length === 0) await userStore.fetchAdherents();

const updateAdherent = (adherent: User | null) => {
  if (!adherent) return;
  faStore.updateInCharge({ adherentId: adherent.id });
};
const updateTeam = (team: Team) => {
  faStore.updateInCharge({ team: team.code });
};
const addContractor = (contractor: PrepareContractorCreation) => {
  faStore.addContractor(contractor);
};
const updateContractor = (contractor: Contractor) => {
  faStore.updateContractor(contractor);
};
const removeContractor = (contractor: Contractor) => {
  faStore.removeContractor(contractor.id);
};
</script>
