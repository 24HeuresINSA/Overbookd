<template>
  <div>TODO</div>
  <div v-if="shouldSign" class="charter-actions">
    <v-btn
      text="Signer la Charte Bénévole"
      color="success"
      :disabled="props.hasSigned"
      @click="signVolunteerCharter"
    />
    <p v-if="props.hasSigned">La Charte Bénévole est signée 🥳</p>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(["sign"]);

const props = defineProps({
  hasSigned: {
    type: Boolean,
    required: true,
  },
  shouldSign: {
    type: Boolean,
    required: false,
    default: true,
  },
});

const signVolunteerCharter = async () => {
  if (!props.shouldSign) return;
  emit("sign");
};
</script>

<style scoped>
.charter-actions {
  display: flex;
  justify-content: flex-end;
}
</style>
