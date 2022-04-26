<template>
  <v-dialog v-model="mToggle" width="50%">
    <v-card>
      <div style="padding: 4rem">
        <div class="d-flex w-full justify-between">
          <h3 class="mr-8">Compte :</h3>
          <v-chip
            @click.left="$emit('assign-user', user._id)"
            @click.right="calendar(user)"
          >
            {{ user.firstname }} {{ user.lastname }}
          </v-chip>
        </div>
        <div class="d-flex w-full mt-8 flex-wrap">
          <h3 class="mr-8">Amis :</h3>
          <v-chip
            v-for="friend in user.availableFriend"
            :key="friend._id"
            @click.left="$emit('assign-user', friend._id)"
            @click.right="calendar(friend)"
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
  methods: {
    calendar(user) {
      window.open(`/calendar/${user._id}`, "_blank");
    },
  },
};
</script>

<style scoped></style>
