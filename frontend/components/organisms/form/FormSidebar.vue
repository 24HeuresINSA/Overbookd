<template>
    <div class="content">
        <div v-if="form === 'FA'" class="sidebar">
            <div @click="autoScroll('general')">
                <v-icon large>mdi-message-text</v-icon>
                <p>Général</p>
            </div>
            <div @click="autoScroll('signa')">
                <v-icon large>mdi-message-text</v-icon>
                <p>Général</p>
            </div>
            <div @click="autoScroll('detail')">
                <v-icon large>mdi-message-text</v-icon>
                <p>Détail</p>
            </div>
            <div @click="autoScroll('timeframe')">
                <v-icon large>mdi-message-text</v-icon>
                <p>Créneaux</p>
            </div>
            <div @click="autoScroll('security')">
                <v-icon large>mdi-message-text</v-icon>
                <p>Sécurité</p>
            </div>
            <div @click="autoScroll('presta')">
                <v-icon large>mdi-message-text</v-icon>
                <p>Presta</p>
            </div>
            <div @click="autoScroll('elec')">
                <v-icon large>mdi-message-text</v-icon>
                <p>Besoin Elec</p>
            </div>
            <div @click="autoScroll('water')">
                <v-icon large>mdi-message-text</v-icon>
                <p>Besoin Eau</p>
            </div>
            <div @click="autoScroll('comment')">
                <v-icon large>mdi-message-text</v-icon>
                <p>Commentaires</p>
            </div>
            <div @click="autoScroll('ft')">
                <v-icon large>mdi-message-text</v-icon>
                <p>FT</p>
            </div>
        </div>

        <div v-else-if="form === 'FT'" class="sidebar">
            <p>FT</p>
        </div>
    </div>
</template>

<script>
export default {
    name: "FormSidebar",
    props: {
        form: {
            type: String,
            default: () => "FA",
        },
    },
    methods: {
        autoScroll(id) {
            document.getElementById(id).scrollIntoView({ behavior: "smooth" });
        }
    },
};
</script>
    
<style scoped>
.sidebar > * {
    text-align: center;
    cursor: pointer;
}
</style>
  