<template>
    <v-card>
        <v-card-title>Détail</v-card-title>
        <v-card-subtitle>Décris ici ton activité, soit assez exhaustif, si tu le demandes, c'est ce texte qui sera publié sur le site 24heures.org</v-card-subtitle>
        <v-card-text>
            <v-form>
                <RichEditor
                    v-model="detailData.description"
                    label="Description"
                    @change="onChange"
                ></RichEditor>
                <v-switch
                    v-model="detailData.is_publishable"
                    label="Publier sur le site / plaquette"
                    @change="onChange"
                ></v-switch>
                <v-switch
                    v-model="detailData.is_major"
                    label="Anim phare"
                    @change="onChange"
                ></v-switch>
                <v-switch
                    v-model="detailData.is_kids"
                    label="Anim pour les gosses"
                    @change="onChange"
                ></v-switch>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script>
import RichEditor from '~/components/atoms/RichEditor.vue';

export default {
    name: "FADetailCard",
    components: { RichEditor },
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
  