<template>
    <v-card>
        <v-card-title>Presta</v-card-title>
        <v-card-text>
            <v-form>
            <v-text-field
                v-model="formData.fullname"
                label="Nom complet de l'intervenant">
            </v-text-field>
            <v-text-field
                v-model="formData.company"
                label="Société">
            </v-text-field>
            <v-text-field
                v-model="formData.phone"
                label="Téléphone">
            </v-text-field>
            <v-text-field
                v-model="formData.email"
                label="E-mail">
            </v-text-field>
            <v-text-field
                v-model="formData.comment"
                label="Commentaire">
            </v-text-field>
            <v-switch
                v-model="formData.needsHosting"
                label="Besoin d'hébergement">
            </v-switch>
            <v-text-field
                v-model="formData.requiredSandwichFriday"
                label="Nombre de sandwichs vendredi">
            </v-text-field>
            <v-text-field
                v-model="formData.requiredSandwichSaturday"
                label="Nombre de sandwichs samedi">
            </v-text-field>
            <v-text-field
                v-model="formData.requiredSandwichSunday"
                label="Nombre de sandwichs dimanche">
            </v-text-field>
            </v-form>
        </v-card-text>
    </v-card>
</template>
  
<script lang="ts">
import { RepoFactory } from "~/repositories/repoFactory";
import { Header } from "~/utils/models/Data";
import Vue from "vue";
import { FormComment } from "~/utils/models/Comment";
import { safeCall } from "~/utils/api/calls";

declare interface Data {
headers: Header[];
newComment: string;
}
  
export default Vue.extend({
    name: "PrestaCard",
    props: {
        formData: {
        type: Object,
        default: () => {},
        },
    },

    computed: {
        store(): any {
        return this.$accessor.FA;
        },
    },
    methods: {

    },
});
</script>

<style scoped></style>
  