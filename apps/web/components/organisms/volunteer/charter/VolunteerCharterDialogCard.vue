<template>
  <v-card rounded="0" class="mx-0 my-0 px-0 py-0">
    <v-toolbar color="background">
      <v-btn
        icon="mdi-close"
        aria-label="Fermer"
        title="Fermer"
        @click="close"
      />
      <v-toolbar-title>Charte Bénévole</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <VolunteerCharter
        :has-signed="props.hasSigned"
        @sign="signVolunteerCharter"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
const props = defineProps({
  hasSigned: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close", "sign"]);
const close = () => emit("close");
const signVolunteerCharter = () => emit("sign");
</script>
