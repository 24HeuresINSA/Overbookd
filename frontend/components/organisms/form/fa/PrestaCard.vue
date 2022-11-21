<template>
    <v-card>
        <v-card-title>Presta</v-card-title>
        <v-card-text>
            <v-form>
                <v-text-field
                    :value="prestaData.firstname"
                    label="Prénom de l'intervenant"
                    @change="onChange('firstname', $event)"
                ></v-text-field>
                <v-text-field
                    :valuel="prestaData.lastname"
                    label="Nom de l'intervenant"
                    @change="onChange('lastname', $event)"
                ></v-text-field>
                <v-text-field
                    :value="prestaData.phone"
                    label="Téléphone"
                    :rules="
                        [
                            (v) =>
                            new RegExp(`0[6-7]{1}[0-9]{8}$`).test(v) ||
                            (`ce numéro de téléphone n'est pas valide`),
                        ]
                    "
                    @change="onChange('phone', $event)"
                ></v-text-field>
                <v-text-field
                    :value="prestaData.email"
                    label="E-mail"
                    :rules="
                        [
                            (v) =>
                            new RegExp(`^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$`).test(v) ||
                            (`cet email n'est pas valide`),
                        ]
                    "
                    @change="onChange('email', $event)"
                ></v-text-field>
                <v-text-field
                    :value="prestaData.company"
                    label="Société"
                    @change="onChange('company', $event)"
                ></v-text-field>
                <v-text-field
                    :value="prestaData.comment"
                    label="Commentaire"
                    @change="onChange('comment', $event)"
                ></v-text-field>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    name: "PrestaCard",
    computed: {
        prestaData(): any {
            return {};
            // return this.$accessor.FA.mFA.collaborator;
        },
    },
    methods: {
        onChange(name: string, value: any) {
            if (typeof value === "string") value = value.trim();
            console.log(name + " : " + value);
            // Mettre à jour le store
        }
    },
});
</script>

<style scoped></style>
  