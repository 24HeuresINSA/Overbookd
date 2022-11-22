<template>
    <v-card>
        <v-card-title>Détail</v-card-title>
        <v-card-subtitle>Décris ici ton activité, soit assez exhaustif, si tu le demandes, c'est ce texte qui sera publié sur le site 24heures.org</v-card-subtitle>
        <v-card-text>
            <v-form>
                <RichEditor
                    :data="detailData.description"
                    label="Description"
                    @change="onChange('description', $event)"
                ></RichEditor>
                <v-switch
                    :value="detailData.is_publishable"
                    label="Publier sur le site / plaquette"
                    @change="onChange('is_publishable', $event)"
                ></v-switch>
                <v-switch
                    :value="detailData.is_major"
                    label="Anim phare"
                    @change="onChange('is_major', $event)"
                ></v-switch>
                <v-switch
                    :value="detailData.is_kids"
                    label="Anim pour les gosses"
                    @change="onChange('is_kids', $event)"
                ></v-switch>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import RichEditor from '~/components/atoms/RichEditor.vue';

export default Vue.extend({
    name: "FADetailCard",
    components: { RichEditor },
    computed: {
        detailData(): any {
            return this.$accessor.FA.mFA.details;
        }
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
  