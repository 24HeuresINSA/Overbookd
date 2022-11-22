<template>
    <v-card>
        <v-card-title>Sécurité</v-card-title>
        <v-card-subtitle>Si tu as des questions sur les besoins ou le nom d'un dispositif de sécu de ton activité, contacte securite@24heures.org</v-card-subtitle>
        <v-card-text>
            <v-form>
                <v-switch
                    :value="securityData.is_needed"
                    label="Besoin de Pass Sécu"
                    @change="onChange('is_needed', $event)"
                ></v-switch>
                <v-text-field
                    :value="securityData.number_of_pass"
                    label="Nombre de Pass Sécu"
                    type="number"
                    min="1"
                    step="1"
                    @change="onChange('number_of_pass', $event)"
              ></v-text-field>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    name: "SecurityCard",
    computed: {
        securityData(): any {
            return {};
            // return this.$accessor.FA.mFA.securityNeeds;
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
  