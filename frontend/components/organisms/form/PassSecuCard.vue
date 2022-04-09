<template>
  <div>
    <v-card>
      <v-card-title>Pass Sécu</v-card-title>
      <v-card-text>
        <v-switch
          v-model="isPassSecuRequired"
          label="Besoin de pass sécu"
        ></v-switch>

        <v-data-table
          :headers="headers"
          :items="securityPasses"
          :items-per-page="-1"
          hide-default-footer
        >
          <template #[`item.action`]="row">
            <v-btn icon small @click="removeSecurityPass(row.index)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-btn icon small @click="modifSecurityPass(row)">
              <v-icon small>mdi-circle-edit-outline</v-icon>
            </v-btn>
          </template>
        </v-data-table>

        <template v-if="isPassSecuRequired">
          <OverForm
            :fields="FORM"
            :disabled="isDisabled"
            @form-change="onFormChange"
          ></OverForm>
          <v-btn text @click="addSecurityPass"
            >Ajouter demande de pass secu</v-btn
          >
        </template>
      </v-card-text>
    </v-card>

    <v-dialog v-model="isModifPassDialogOpen" width="600">
      <v-card>
        <v-card-title>Modification du pass</v-card-title>
        <OverForm
          style="margin: 20px"
          :fields="FORM"
          :data="mPass"
          :disabled="isDisabled"
          @form-change="onModifFormChange"
        ></OverForm>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="saveSecurityPass"> Enregistrer </v-btn>
          <v-btn color="error" @click="isModifPassDialogOpen = false">
            Annuler
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import OverForm from "../../overForm";

export default {
  name: "PassSecuCard",
  components: { OverForm },
  props: {
    isDisabled: {
      type: Boolean,
      default: () => {
        false;
      },
    },
    form: {
      type: Object,
      default: () => ({}),
    },
  },
  data: function () {
    return {
      isPassSecuRequired: false,
      topic: "secu",
      formKey: "fa_security_pass_form",
      FORM: [],
      // datatable
      headers: [
        { text: "Nom", value: "fullname" },
        { text: "Email", value: "email" },
        {
          text: "Plaque d'immatriculation",
          value: "licensePlate",
        },
        { text: "Tél", value: "phone" },
        { text: "Entité", value: "entity" },
        { text: "Raison", value: "reason" },
        { text: "Commentaire", value: "comment" },
        { text: "Action", value: "action" },
      ],
      newSecurityPass: {},
      mPass: {},
      mPassIndex: 0,
      isModifPassDialogOpen: false,
    };
  },
  computed: {
    securityPasses: function () {
      return this.$accessor.FA.mFA.securityPasses;
    },
  },
  mounted() {
    this.FORM = Array.from(this.$accessor.config.getConfig(this.formKey));
    if (this.securityPasses.length > 0) {
      this.isPassSecuRequired = true;
    }
  },
  methods: {
    onFormChange(form) {
      this.newSecurityPass = form;
    },
    onModifFormChange(form) {
      this.mPass = { ...this.mPass, ...form };
    },
    addSecurityPass() {
      this.$accessor.FA.addSecurityPass(this.newSecurityPass);
    },
    saveSecurityPass() {
      this.$accessor.FA.updateSecurityPass({
        index: this.mPassIndex,
        securityPass: this.mPass,
      });
      this.isModifPassDialogOpen = false;
    },
    removeSecurityPass(index) {
      this.$accessor.FA.deleteSecurityPass(index);
    },
    modifSecurityPass(pass) {
      this.mPass = pass.item;
      this.mPassIndex = pass.index;
      this.isModifPassDialogOpen = true;
    },
  },
};
</script>

<style scoped></style>
