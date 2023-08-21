<template>
  <UserCalendar :user-id="userId" />
</template>

<script lang="ts">
import Vue from 'vue';
import UserCalendar from '~/components/organisms/planning/UserCalendar.vue';

export default Vue.extend({
  name: 'Planning',
  components: { UserCalendar },
  computed: {
    userId(): number {
      return +this.$route.params.userId;
    },
  },
  async created() {
    if (isNaN(this.userId)) {
      return this.$router.push({ path: '/' });
    }
  },
});
</script>
