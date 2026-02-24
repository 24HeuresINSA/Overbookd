<template>
  <v-card rounded="0" class="mx-0 my-0 px-0 py-0">
    <v-toolbar color="background">
      <v-btn
        icon="mdi-close"
        aria-label="Fermer"
        title="Fermer"
        @click="close"
      />
      <v-toolbar-title>
        Charte Bénévole (signature en bas de page)
      </v-toolbar-title>
    </v-toolbar>
    <div class="charter-wrapper">
      <v-card class="charter-card">
        <v-card-text>
          <VolunteerCharter
            :has-signed="props.hasSigned"
            @sign="signVolunteerCharter"
          />
        </v-card-text>
      </v-card>
    </div>
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

<style lang="scss" scoped>
.charter-wrapper {
  display: flex;
  justify-content: center;
  background-color: rgb(var(--v-theme-background));
}

.charter-card {
  width: 80%;
  @media screen and (max-width: $mobile-max-width) {
    width: 100%;
  }
}
</style>
