<template>
    <v-card>
        <v-card-title>Détail</v-card-title>
        <v-card-subtitle>Décris ici ton activité, soit assez exhaustif, si tu le demandes, c'est ce texte qui sera publié sur le site 24heures.org</v-card-subtitle>
        <v-card-text>
            <v-form>
                <v-text-field
                    v-model="formData.description"
                    label="Description"
                    type="rich-text">
                </v-text-field>
                <v-switch
                    v-model="formData.isPublishable"
                    label="Publier sur le site / plaquette"
                ></v-switch>
                <v-switch
                    v-model="formData.isMajorAnim"
                    label="Anim phare"
                ></v-switch>
                <v-switch
                    v-model="formData.isForKids"
                    label="Anim pour les gosses"
                ></v-switch>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    name: "FADetailCard",
    props: {
        formData: {
            type: Object,
            default: () => {},
        },
    },
};
</script>

<style scoped></style>
  