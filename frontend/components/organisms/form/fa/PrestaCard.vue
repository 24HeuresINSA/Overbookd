<template>
    <v-card>
        <v-card-title>Presta</v-card-title>
        <v-card-text>
            <v-form>
                <v-text-field
                    v-model="prestaData.fullname"
                    label="Nom complet de l'intervenant"
                    @change="onChange">
                </v-text-field>
                <v-text-field
                    v-model="prestaData.company"
                    label="Société"
                    @change="onChange">
                </v-text-field>
                <v-text-field
                    v-model="prestaData.phone"
                    label="Téléphone"
                    @change="onChange">
                </v-text-field>
                <v-text-field
                    v-model="prestaData.email"
                    label="E-mail"
                    @change="onChange">
                </v-text-field>
                <v-text-field
                    v-model="prestaData.comment"
                    label="Commentaire"
                    @change="onChange">
                </v-text-field>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    name: "PrestaCard",
    props: {
        data: {
            type: Object,
            default: () => {},
        },
    },
    computed: {
        prestaData() {
            return this.data;
        },
    },
    methods: {
        onChange() {
            this.$emit("update-data", this.prestaData);
        }
    },
}
</script>

<style scoped></style>
  