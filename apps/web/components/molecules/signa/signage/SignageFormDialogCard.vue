<template>
  <DialogCard @close="close">
    <template #title> Signalisation </template>
    <template #content>
      <v-form v-model="isFormValid">
        <v-text-field
          v-model="name"
          append-icon="mdi-hammer-screwdriver"
          label="Nom de la signalisation"
          clearable
          outlined
          clear-icon="mdi-close-circle-outline"
          counter
          :rules="[minLength(NAME_MIN_LENGTH)]"
        />
        <v-select
          v-model="type"
          type="select"
          label="Type de la signatlisation"
          :items="signageTypeValues"
          :rules="[required]"
        />
        <v-file-input
          v-model="uploadedImage"
          :rules="[isImageSizeWithinLimit, isSupportedImageFile]"
          label="Image pour la signalisation"
          prepend-icon="mdi-camera"
          accept="image/png, image/jpeg, image/gif"
          show-size
        />
      </v-form>
    </template>
    <template #actions>
      <v-btn
        prepend-icon="mdi-checkbox-marked-circle-outline"
        text="Sauvegarder la signalisation"
        size="large"
        :loading="loading"
        :disabled="!isFormValid"
        @click="createOrUpdateSignage"
      />
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import {
  minLength,
  required,
  isImageSizeWithinLimit,
  isSupportedImageFile,
} from "~/utils/rules/input.rules";
import {
  type SignageForm,
  type SignageType,
  signageTypes,
} from "@overbookd/signa";
import type { SignageWithPotentialImage } from "~/utils/logistic/signage";

const catalogSignageStore = useCatalogSignageStore();

const NAME_MIN_LENGTH = 3;
const signageTypeValues = Object.values(signageTypes);

const props = defineProps({
  signage: {
    type: Object as PropType<SignageWithPotentialImage>,
    default: () => ({
      name: "",
      type: signageTypes.AFFICHE,
    }),
  },
});

const name = ref<string>(props.signage.name);
const type = ref<SignageType>(props.signage.type);
const uploadedImage = ref<File | null>(null);

watch(
  () => props.signage,
  (signage: SignageWithPotentialImage) => {
    name.value = signage.name;
    type.value = signage.type;
  },
);

const emit = defineEmits(["close"]);
const close = () => emit("close");

const isFormValid = ref<boolean>(false);
const loading = ref<boolean>(false);

const createOrUpdateSignage = async () => {
  if (!isFormValid.value) return;
  loading.value = true;

  await upsertSignage();
  await updateImage();

  loading.value = false;
  close();
  name.value = "";
  type.value = signageTypes.AFFICHE;
};
const upsertSignage = () => {
  const signage: SignageForm = {
    name: name.value,
    type: type.value,
  };

  if (props.signage.id)
    return catalogSignageStore.updateSignage({
      ...signage,
      id: props.signage.id,
    });

  return catalogSignageStore.createSignage(signage);
};
const updateImage = () => {
  const image = uploadedImage.value;
  if (!image) return;

  const signageId = props.signage.id || catalogSignageStore.signage?.id;
  if (signageId === undefined) return;

  const signaImageForm = new FormData();
  signaImageForm.append("file", image, image.name);
  return catalogSignageStore.uploadSignageImage(signageId, signaImageForm);
};
</script>

<style lang="scss" scoped>
.signage {
  &__title {
    display: flex;
    justify-content: center;
    h2 {
      flex: 1;
      text-align: center;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    .fields {
      width: 80%;
    }
  }

  .close-btn {
    position: absolute;
    top: 3px;
    right: 3px;
  }
}
</style>
