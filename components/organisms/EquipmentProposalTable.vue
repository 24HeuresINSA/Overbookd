<template>
  <v-card>
    <EquipmentProposalValidationDialog
      ref="validationDialog"
      :equipment-proposal="proposal"
    ></EquipmentProposalValidationDialog>
    <v-data-table :headers="headers" :items="equipmentProposals">
      <template #[`item.actions`]="{ item }">
        <v-btn icon @click="open(item)">
          <v-icon>mdi-circle-edit-outline</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import EquipmentProposalValidationDialog from "./EquipmentProposalValidationDialog.vue";

export default Vue.extend({
  name: "EquipmentProposalTable",
  components: {
    EquipmentProposalValidationDialog,
  },
  data() {
    return {
      headers: [
        {
          text: "Name",
          value: "name",
          sortable: true,
          align: "left",
        },
        {
          text: "Lieu",
          value: "location",
          sortable: true,
          align: "left",
        },
        {
          text: "Action",
          value: "actions",
          sortable: true,
          align: "left",
        },
      ],
      proposal: {},
    };
  },
  computed: {
    equipmentProposals() {
      return this.$accessor.equipmentProposal.equipmentProposals;
    },
  },
  async mounted() {},
  methods: {
    open(item: any) {
      this.proposal = item;
      //How do i fix this ? :(
      (this.$refs.validationDialog as any).openDialog();
    },
  },
});
</script>

<style></style>
