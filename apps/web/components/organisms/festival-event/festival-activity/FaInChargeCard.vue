<template>
  <v-card>
    <div v-if="canReview" class="review">
      <v-btn
        class="review__action"
        fab
        x-small
        color="success"
        :disabled="cantApprove"
        @click="approved"
      >
        <v-icon>mdi-check-circle-outline</v-icon>
      </v-btn>
      <v-btn class="review__action" fab x-small color="error">
        <v-icon>mdi-close-circle-outline</v-icon>
      </v-btn>
    </div>

    <v-card-title>Responsable</v-card-title>

    <v-card-subtitle>
      <p>
        N'hésite pas si tu as des questions à contacter
        <a href="mailto:humain@24heures.org">humain@24heures.org</a>.
      </p>
      <p>
        Tu peux aussi t'aider en allant voir les FA de l'année dernière sur
        <a href="https://cetaitmieuxavant.24heures.org">cetaitmieuxavant</a> en
        te connectant avec jeuneetcon@24heures.org.
      </p>
    </v-card-subtitle>

    <v-card-text>
      <SearchUser
        :user="inCharge.adherent"
        label="Adhérent"
        :boxed="false"
        :list="adherents"
        @change="updateAdherent"
      />

      <SearchTeam
        :team="team"
        label="Équipe"
        :boxed="false"
        @change="updateTeam"
      />

      <section class="contractors">
        <h2>Prestataires</h2>
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

<script lang="ts">
import { defineComponent } from "vue";
import SearchUser from "~/components/atoms/field/search/SearchUser.vue";
import SearchTeam from "~/components/atoms/field/search/SearchTeam.vue";
import ContractorTable from "~/components/molecules/festival-event/contractor/ContractorTable.vue";
import {
  FestivalActivity,
  Adherent,
  PrepareContractorCreation,
  Contractor,
  humain,
  APPROVED,
  isDraft,
} from "@overbookd/festival-activity";
import { User } from "@overbookd/user";
import { Team } from "~/utils/models/team.model";

export default defineComponent({
  name: "FaGeneralCard",
  components: { SearchUser, SearchTeam, ContractorTable },
  computed: {
    mFA(): FestivalActivity {
      return this.$accessor.festivalActivity.selectedActivity;
    },
    inCharge(): FestivalActivity["inCharge"] {
      return this.mFA.inCharge;
    },
    team(): Team | null {
      const team = this.inCharge.team ?? "";
      return this.$accessor.team.getTeamByCode(team) ?? null;
    },
    adherents(): User[] {
      return this.$accessor.user.adherents;
    },
    canReview(): boolean {
      return this.$accessor.user.isMemberOf(humain);
    },
    cantApprove(): boolean {
      if (isDraft(this.mFA)) return true;

      return this.mFA.reviews.humain === APPROVED;
    },
  },
  async mounted() {
    if (this.adherents.length === 0) {
      await this.$accessor.user.fetchAdherents();
    }
  },
  methods: {
    updateAdherent(adherent: Adherent) {
      const adherentId = adherent.id;
      this.$accessor.festivalActivity.updateInCharge({ adherentId });
    },
    updateTeam(team: Team) {
      this.$accessor.festivalActivity.updateInCharge({ team: team.code });
    },
    addContractor(contractor: PrepareContractorCreation) {
      this.$accessor.festivalActivity.addContractor(contractor);
    },
    updateContractor(contractor: Contractor) {
      this.$accessor.festivalActivity.updateContractor(contractor);
    },
    removeContractor(contractor: Contractor) {
      this.$accessor.festivalActivity.removeContractor(contractor.id);
    },
    approved() {
      this.$accessor.festivalActivity.approveAs(humain);
    },
  },
});
</script>

<style lang="scss" scoped>
.review {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: row;
  gap: 10px;
}
</style>
