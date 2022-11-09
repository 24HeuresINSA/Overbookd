<template>
    <v-card>
        <v-card-title>Général</v-card-title>
        <v-card-subtitle>N'hésite pas si tu as des questions à contacter humain@24heures.org. Tu peux aussi t'aider en allant voir les FA d'avant sur cetaitmieuxavant.24heures.org/ en te connectant avec jeuneetcon@24heures.org </v-card-subtitle>
        <v-card-text>
            <v-form>
                <v-text-field
                    v-model="formData.name"
                    label="Nom de la FA"
                    required
                ></v-text-field>
                <v-select
                    v-model="formData.type"
                    type="select"
                    label="type"
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
                ></v-select>
                <v-text-field
                    v-model="formData.team"
                    label="Equipe"
                    type="teams"
                    :items="teams"
                    required
                ></v-text-field>
                <v-text-field
                    v-model="formData.inCharge"
                    label="Responsable"
                    type="user"
                    :items="users"
                    required
                ></v-text-field>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    name: "FAGeneralCard",
    props: {
        formData: {
            type: Object,
            default: () => {},
        },
    },
    computed: {
        teams: function () {
            return [];  //Get all teams
        },
        users: function () {
            return [];  //Get all users
        },
    },
};
</script>

<style scoped></style>
  