<template>
  <div class="content">
    <h2>{{ "Amis de " + getSelectedUserName + " :" }}</h2>
    <v-virtual-scroll :items="selectedUser" :height="height" item-height="40">
      <template #default="{ item }">
        <v-list-item :value="item">
          {{ item.username }}
        </v-list-item>
      </template>
    </v-virtual-scroll>
  </div>
</template>

<script>
export default {
  computed: {
    selectedUser() {
      const user = this.$accessor.assignment.selectedUser;
      if (user && user.friends) {
        let uniqueFriends = [];
        /* enlever les amis qui ont le même nom */
        user.friends.forEach((friend) => {
          if (
            uniqueFriends.findIndex((u) => u.username === friend.username) ===
            -1
          ) {
            uniqueFriends.push(friend);
          }
        });
        return uniqueFriends;
      } else {
        return [];
      }
    },
    height() {
      return window.innerHeight * 0.15;
    },
    getSelectedUserName() {
      const user = this.$accessor.assignment.selectedUser;
      if (user && user.firstname) {
        return user.firstname;
      } else {
        return "";
      }
    },
  },
};
</script>

<style scoped lang="scss">
.content {
  h2 {
    margin: 0.5vh;
  }
  border: 1px solid #e0e0e0;
  border-radius: 5px;
}
</style>
