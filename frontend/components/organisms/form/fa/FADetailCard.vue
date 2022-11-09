<template>
    <v-card>
        <v-card-title>Détail</v-card-title>
        <v-card-subtitle>Décris ici ton activité, soit assez exhaustif, si tu le demandes, c'est ce texte qui sera publié sur le site 24heures.org</v-card-subtitle>
        <v-card-text>
            <v-form>
                <v-text-field
                    v-model="formData.description"
                    label="Description"
                    type="rich-text"
                    @change="onChange"
                ></v-text-field>
                <v-switch
                    v-model="formData.isPublishable"
                    label="Publier sur le site / plaquette"
                    @change="onChange"
                ></v-switch>
                <v-switch
                    v-model="formData.isMajorAnim"
                    label="Anim phare"
                    @change="onChange"
                ></v-switch>
                <v-switch
                    v-model="formData.isForKids"
                    label="Anim pour les gosses"
                    @change="onChange"
                ></v-switch>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    name: "FADetailCard",
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
  