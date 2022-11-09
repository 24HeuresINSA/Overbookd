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
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    name: "PrestaCard",
    props: {
        formData: {
            type: Object,
            default: () => {},
        },
    },
};
</script>

<style scoped></style>
  