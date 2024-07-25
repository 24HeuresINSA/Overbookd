<template>
  <DialogCard @close="close">
    <template #title> Signalisation </template>
    <template #content>
      <v-text-field
        v-model="name"
        append-icon="mdi-hammer-screwdriver"
        label="Nom de la signalisation"
        clearable
        outlined
        clear-icon="mdi-close-circle-outline"
        counter
        :rules="[rules.nameMinLength]"
      />
      <v-select
        v-model="type"
        type="select"
        label="Type de la signatlisation"
        :items="signageTypeValues"
        :rules="[rules.typeRequired]"
      />
      <v-file-input
        v-model="uploadedImage"
        :rules="imageRules"
        label="Image pour la signalisation"
        prepend-icon="mdi-camera"
        accept="image/png, image/jpeg, image/gif"
        show-size
        multiple
      />
    </template>
    <template #actions>
      <v-btn
        prepend-icon="mdi-checkbox-marked-circle-outline"
        text="Sauvegarder la signalisation"
        color="success"
        size="large"
        variant="elevated"
        :disabled="cantCreateOrUpdateSignage"
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
const rules = {
  nameMinLength: minLength(NAME_MIN_LENGTH),
  typeRequired: required,
};
const imageRules = [isImageSizeWithinLimit, isSupportedImageFile];
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
const uploadedImage = ref<File[]>([]);

const cantCreateOrUpdateSignage = computed<boolean>(() => {
  const isNameValid = name.value.length >= NAME_MIN_LENGTH;
  const isTypeValid = type.value !== undefined;
  const isUploadValid =
    uploadedImage.value.length > 0 ? isImageValid.value : true;

  return !isNameValid || !isTypeValid || !isUploadValid;
});
const isImageValid = computed<boolean>(() =>
  imageRules.every((rule) => rule(uploadedImage.value) === true),
);

watch(
  () => props.signage,
  (signage: SignageWithPotentialImage) => {
    name.value = signage.name;
    type.value = signage.type;
  },
);

const emit = defineEmits(["close"]);
const close = () => emit("close");

const createOrUpdateSignage = async () => {
  if (!name.value || !type.value) return;
  const signage: SignageForm = {
    name: name.value,
    type: type.value,
  };

  await upsertSignage(signage);
  await updateImage();

  close();
  name.value = "";
  type.value = signageTypes.AFFICHE;
};
const upsertSignage = (signage: SignageForm) => {
  if (props.signage.id)
    return catalogSignageStore.updateSignage({
      ...signage,
      id: props.signage.id,
    });

  return catalogSignageStore.createSignage(signage);
};
const updateImage = () => {
  if (!uploadedImage.value || !uploadedImage.value.length) return;

  const signageId = props.signage.id
    ? props.signage.id
    : catalogSignageStore.signage?.id;

  if (signageId === undefined) return;

  const image = uploadedImage.value[0];
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
