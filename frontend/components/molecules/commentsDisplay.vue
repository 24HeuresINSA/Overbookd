<template>
  <div class="content">
    <div v-if="isModeOrgaToTache">
      <h2>{{ "Commentaire de " + getSelectedUserName + " :" }}</h2>
      <p>{{ getSelectedUserComment }}</p>
    </div>
    <div v-else>
      <h2>Commentaire</h2>
      <p style="font-style: italic">
        Les commentaires ne sont disponible qu'en mode tâche-orga
      </p>
    </div>
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
    isModeOrgaToTache() {
      return this.$accessor.assignment.filters.isModeOrgaToTache;
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
}
</style>
