<template>
  <v-dialog v-model="isOpen" max-width="600">
    <DialogCard @close="isOpen = false">
      <template #content>
        <v-file-input
          v-model="profilePicture"
          :rules="rules"
          label="Photo de profil"
          prepend-icon="mdi-camera"
          accept="image/png, image/jpeg, image/gif"
          show-size
          multiple
        />
      </template>
      <template #actions>
        <v-btn
          text="Enregistrer"
          size="large"
          :disabled="invalidImage"
          @click="uploadProfilePicture"
        />
      </template>
    </DialogCard>
  </v-dialog>
</template>

<script lang="ts" setup>
import {
  isImage,
  isImageSizeWithinLimit,
  isSupportedImageFile,
} from "~/utils/rules/input.rules";

const userStore = useUserStore();

const isOpen = defineModel<boolean>();

const profilePicture = ref<File[] | undefined>(undefined);

const rules = [isImage, isSupportedImageFile, isImageSizeWithinLimit];

const loggedUser = computed(() => userStore.loggedUser);

const invalidImage = computed<boolean>(() =>
  rules.some((rule) => rule(profilePicture.value) !== true),
);

const uploadProfilePicture = async () => {
  if (
    !loggedUser.value ||
    !profilePicture.value ||
    !profilePicture.value.length
  )
    return;

  const picture = profilePicture.value[0];
  const profilePictureForm = new FormData();
  profilePictureForm.append("file", picture, picture.name);
  await userStore.addProfilePicture(profilePictureForm);
  userStore.setMyProfilePicture();

  const alertStore = useAlertStore();
  alertStore.dismiss("profilePicture");

  isOpen.value = false;
};
</script>
