<template>
    <v-card>
        <v-card-title>Eau</v-card-title>
        <v-card-subtitle>Si ton animation a besoin d'eau, il faut savoir quel est le débit dont tu as besoin et comment on l'évacue. pour plus de renseignement voit avec la Log Elec via logistique@24heures.org</v-card-subtitle>
        <v-card-text>
            <v-form>
                <v-switch
                    v-model="formData.isWaterNeeded"
                    label="Besoin d'eau">
                </v-switch>
                <v-text-field
                    v-if="formData.isWaterNeeded"
                    v-model="formData.waterNeed"
                    label="Desctiption du besoin en eau">
                </v-text-field>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    name: "WaterLogisticCard",
    props: {
        formData: {
            type: Object,
            default: () => {},
        },
    },
};
</script>

<style scoped></style>
  