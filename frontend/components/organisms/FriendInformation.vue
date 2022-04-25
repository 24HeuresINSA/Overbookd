<template>
  <v-dialog v-model="mToggle" width="50%">
    <v-card>
      <div style="padding: 4rem">
        <div class="d-flex w-full justify-between">
          <h3 class="mr-8">Compte :</h3>
          <v-chip @click="$emit('assign-user', user._id)">
            {{ user.firstname }} {{ user.lastname }}
          </v-chip>
        </div>
        <div class="d-flex w-full mt-8">
          <h3 class="mr-8">Amis :</h3>
          <v-chip
            v-for="friend in user.availableFriend"
            @click="$emit('assign-user', friend._id)"
          >
            {{ friend.firstname }} {{ friend.lastname }}
          </v-chip>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "FriendInformation",
  props: {
    user: {
      type: Object,
      default: () => undefined,
    },
    toggle: {
      type: Boolean,
      default: () => false,
    },
  },
  computed: {
    mToggle: {
      get: function () {
        return this.toggle;
      },
      set: function (t) {
        this.$emit("update-toggle", t);
      },
    },
  },
};
</script>

<style scoped></style>
