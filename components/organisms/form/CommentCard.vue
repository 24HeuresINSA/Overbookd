<template>
  <v-card>
    <v-card-title>Commentaire</v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="comments"
        hide-default-footer
        :items-per-page="-1"
      >
        <template #[`item.time`]="{ item }">
          {{ new Date(item.time).toLocaleString() }}
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "CommentCard",
  props: {
    comments: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    headers: [
      { text: "validateur", value: "validator" },
      { text: "sujet", value: "topic" },
      {
        text: "commentaire",
        value: "text",
      },
      { text: "date", value: "time" },
    ],
  }),
};
</script>

<style scoped></style>
