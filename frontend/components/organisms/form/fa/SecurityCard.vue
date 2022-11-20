<template>
    <v-card>
        <v-card-title>Sécurité</v-card-title>
        <v-card-subtitle>Si tu as des questions sur les besoins ou le nom d'un dispositif de sécu de ton activité, contacte securite@24heures.org</v-card-subtitle>
        <v-card-text>
            <v-form>
                <v-switch
                    v-model="securityData.is_needed"
                    label="Besoin de Pass Sécu"
                    @change="onChange"
                ></v-switch>
                <v-text-field
                    v-if="securityData.is_needed"
                    v-model="securityData.number_of_pass"
                    label="Nombre de Pass Sécu"
                    type="number"
                    min="1"
                    step="1"
                    @change="onChange"
              ></v-text-field>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    name: "SecurityCard",
    props: {
        data: {
            type: Object,
            default: () => {},
        },
    },
    computed: {
        securityData() {
            return this.data;
        },
    },
    methods: {
        onChange() {
            this.$emit("update-data", this.securityData);
        }
    },
}
</script>

<style scoped></style>
  