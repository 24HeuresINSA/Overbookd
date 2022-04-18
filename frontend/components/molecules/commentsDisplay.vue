<template>
  <div class="content">
    <h2>{{ "Commentaire de " + getSelectedUserName + " :" }}</h2>
    <p>{{ getSelectedUserComment }}</p>
  </div>
</template>

<script>
export default {
  computed: {
    getSelectedUserComment() {
      const user = this.$accessor.assignment.selectedUser;
      if (user && user.comment) {
        return user.comment;
      } else {
        return "";
      }
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
  h2,
  p {
    margin: 0.5vh;
  }
  border: 1px solid #e0e0e0;
  border-radius: 5px;
}
</style>
