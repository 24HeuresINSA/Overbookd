<template>
    <v-card>
        <v-card-title>Détail</v-card-title>
        <v-card-subtitle>Décris ici ton activité, soit assez exhaustif, si tu le demandes, c'est ce texte qui sera publié sur le site 24heures.org</v-card-subtitle>
        <v-card-text>
            <v-form>
                <v-text-field
                    v-model="detailData.description"
                    label="Description"
                    type="rich-text"
                    @change="onChange"
                ></v-text-field>
                <v-switch
                    v-model="detailData.isPublishable"
                    label="Publier sur le site / plaquette"
                    @change="onChange"
                ></v-switch>
                <v-switch
                    v-model="detailData.isMajorAnim"
                    label="Anim phare"
                    @change="onChange"
                ></v-switch>
                <v-switch
                    v-model="detailData.isForKids"
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
        data: {
            type: Object,
            default: () => {},
        },
    },
    computed: {
        detailData() {
            return this.data;
        },
    },
    methods: {
        onChange() {
            this.$emit("update-data", this.detailData);
        }
    },
};
</script>

<style scoped></style>
  