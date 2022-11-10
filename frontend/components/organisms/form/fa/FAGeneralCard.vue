<template>
    <v-card>
        <v-card-title>Général</v-card-title>
        <v-card-subtitle>N'hésite pas si tu as des questions à contacter humain@24heures.org. Tu peux aussi t'aider en allant voir les FA d'avant sur cetaitmieuxavant.24heures.org/ en te connectant avec jeuneetcon@24heures.org </v-card-subtitle>
        <v-card-text>
            <v-form>
                <v-text-field
                    v-model="generalData.name"
                    label="Nom de la FA"
                    required
                    @change="onChange"
                ></v-text-field>
                <v-select
                    v-model="generalData.type"
                    label="Type"
                    :items="['Concert',
                        'Course',
                        'Divertissement',
                        'Initiation',
                        'Match de Gala',
                        'Tournoi',
                        'Vente',
                        'Prévention',
                        'Spectacle',
                        'Autre']"
                    dense
                    required
                    @change="onChange"
                ></v-select>
                <v-select
                    v-model="generalData.team"
                    label="Equipe"
                    :items="teams"
                    required
                    @change="onChange"
                ></v-select>
                <v-select
                    v-model="generalData.inCharge"
                    label="Responsable"
                    :items="users"
                    required
                    @change="onChange"
                ></v-select>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    name: "FAGeneralCard",
    props: {
        data: {
            type: Object,
            default: () => {},
        },
    },
    computed: {
        generalData() {
            return this.data;
        },
        teams() {
            return [];  //Get all teams
        },
        users() {
            return [];  //Get all users
        },
    },
    methods: {
        onChange() {
            this.$emit("update-data", this.generalData);
        }
    },
};
</script>

<style scoped></style>
  