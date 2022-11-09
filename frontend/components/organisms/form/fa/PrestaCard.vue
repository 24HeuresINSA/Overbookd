<template>
    <v-card>
        <v-card-title>Presta</v-card-title>
        <v-card-text>
            <v-form>
                <v-text-field
                    v-model="formData.fullname"
                    label="Nom complet de l'intervenant"
                    @change="onChange">
                </v-text-field>
                <v-text-field
                    v-model="formData.company"
                    label="Société"
                    @change="onChange">
                </v-text-field>
                <v-text-field
                    v-model="formData.phone"
                    label="Téléphone"
                    @change="onChange">
                </v-text-field>
                <v-text-field
                    v-model="formData.email"
                    label="E-mail"
                    @change="onChange">
                </v-text-field>
                <v-text-field
                    v-model="formData.comment"
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
        compiledFormData: {
            type: Object,
            default: () => {},
        },
    },
    data: () => ({
        formData: {}
    }),
    methods: {
        onChange() {
            this.compiledFormData = this.formData;
        }
    },
};
</script>

<style scoped></style>
  